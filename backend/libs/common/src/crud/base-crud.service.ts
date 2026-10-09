import { NotFoundException } from '@nestjs/common';
import type {
  DeepPartial,
  FindOptionsRelations,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import type { BaseEntity } from '@app/database';
import type {
  Paginated,
  TableFilterRule,
  TableQueryDto,
} from './table-query.dto.js';

export interface CrudOptions {
  /** Columns searched by the grid's global search box. */
  searchFields?: string[];
  /** Relations joined into list and detail responses. */
  relations?: string[];
  /** Default sort when the grid sends none. */
  defaultSort?: { field: string; order: 'ASC' | 'DESC' };
}

const ALIAS = 'e';

/**
 * Generic CRUD with soft delete, matching the Fuse admin `BaseCrudService`
 * contract. Filters and sorting only accept real column names, so request
 * bodies can never inject SQL.
 */
export abstract class BaseCrudService<T extends BaseEntity> {
  protected constructor(
    protected readonly repo: Repository<T>,
    protected readonly options: CrudOptions = {},
  ) {}

  findAll(): Promise<T[]> {
    return this.repo.find({
      relations: this.relations(),
      order: this.defaultOrder(),
    });
  }

  async paginate(
    query: TableQueryDto,
    archived = false,
  ): Promise<Paginated<T>> {
    const qb = this.repo.createQueryBuilder(ALIAS);
    for (const relation of this.options.relations ?? []) {
      qb.leftJoinAndSelect(`${ALIAS}.${relation}`, relation);
    }
    if (archived) {
      qb.withDeleted().andWhere(`${ALIAS}.deleted_at IS NOT NULL`);
    }

    this.applyFilters(qb, query.filters);
    this.applyGlobalFilter(qb, query.globalFilter);

    const sortColumn = query.sortField && this.column(query.sortField);
    if (sortColumn) {
      qb.orderBy(
        `${ALIAS}.${sortColumn.propertyName}`,
        query.sortOrder === -1 ? 'DESC' : 'ASC',
      );
    } else {
      const { field, order } = this.options.defaultSort ?? {
        field: 'created_at',
        order: 'DESC',
      };
      qb.orderBy(`${ALIAS}.${field}`, order);
    }

    qb.skip(query.first ?? 0).take(query.rows ?? 10);
    const [data, count] = await qb.getManyAndCount();
    return { count, data };
  }

  async findOne(id: string, archived = false): Promise<T> {
    const entity = await this.repo.findOne({
      where: { id } as FindOptionsWhere<T>,
      relations: this.relations(),
      withDeleted: archived,
    });
    if (!entity) {
      throw new NotFoundException();
    }
    return entity;
  }

  async create(dto: DeepPartial<T>): Promise<T> {
    const saved = await this.repo.save(this.repo.create(dto));
    return this.findOne(saved.id);
  }

  async update(id: string, dto: DeepPartial<T>): Promise<T> {
    const entity = await this.findOne(id);
    this.repo.merge(entity, dto);
    await this.repo.save(entity);
    return this.findOne(id);
  }

  async remove(id: string): Promise<T> {
    const entity = await this.findOne(id);
    await this.repo.softDelete(id);
    return entity;
  }

  async restore(id: string): Promise<T> {
    await this.findOne(id, true);
    await this.repo.restore(id);
    return this.findOne(id);
  }

  private relations() {
    return Object.fromEntries(
      (this.options.relations ?? []).map((relation) => [relation, true]),
    ) as FindOptionsRelations<T>;
  }

  private defaultOrder() {
    const { field, order } = this.options.defaultSort ?? {
      field: 'created_at',
      order: 'DESC',
    };
    return { [field]: order } as never;
  }

  private column(propertyName: string) {
    return this.repo.metadata.columns.find(
      (c) => c.propertyName === propertyName,
    );
  }

  private applyFilters(
    qb: SelectQueryBuilder<ObjectLiteral>,
    filters: Record<string, TableFilterRule> | undefined,
  ) {
    let index = 0;
    for (const [field, rule] of Object.entries(filters ?? {})) {
      const column = this.column(field);
      if (
        !column ||
        rule?.value === undefined ||
        rule.value === null ||
        rule.value === ''
      ) {
        continue;
      }
      const param = `f${index++}`;
      const target = this.textExpression(column.propertyName);

      if (rule.matchMode === 'equals' || typeof rule.value !== 'string') {
        qb.andWhere(`${ALIAS}.${column.propertyName} = :${param}`, {
          [param]: rule.value,
        });
        continue;
      }
      const value = escapeLike(rule.value);
      const pattern =
        rule.matchMode === 'startsWith'
          ? `${value}%`
          : rule.matchMode === 'endsWith'
            ? `%${value}`
            : `%${value}%`;
      qb.andWhere(`${target} ILIKE :${param}`, { [param]: pattern });
    }
  }

  private applyGlobalFilter(
    qb: SelectQueryBuilder<ObjectLiteral>,
    search?: string | null,
  ) {
    const fields = (this.options.searchFields ?? [])
      .map((field) => this.column(field))
      .filter((c) => c !== undefined);
    if (!search?.trim() || fields.length === 0) {
      return;
    }
    const conditions = fields.map(
      (c) => `${this.textExpression(c.propertyName)} ILIKE :globalFilter`,
    );
    qb.andWhere(`(${conditions.join(' OR ')})`, {
      globalFilter: `%${escapeLike(search.trim())}%`,
    });
  }

  /** Casting to text also makes jsonb translations searchable in every language at once. */
  private textExpression(propertyName: string) {
    return `CAST(${ALIAS}.${propertyName} AS text)`;
  }
}

function escapeLike(value: string) {
  return value.replace(/[\\%_]/g, (char) => `\\${char}`);
}

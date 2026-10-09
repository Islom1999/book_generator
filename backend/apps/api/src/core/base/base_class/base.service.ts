import { NotFoundException } from '@nestjs/common';
import type { CostumBaseEntity } from '@app/entities';
import type {
  DeepPartial,
  ObjectLiteral,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import type {
  PaginatedResult,
  PrimeTableQuerySwaggerDTO,
  SortOption,
  TableFilterRule,
} from '../base.interface.js';
import {
  ALIAS,
  applyNestedJoins,
  applySearch,
  escapeLike,
  findColumn,
  textExpression,
} from '../base.query.js';

export interface BaseAdminOptions {
  /** Columns searched by the grid's global search box. */
  searchFields?: string[];
  /** Relations joined into list and detail responses (dot paths for nested). */
  relations?: string[];
  /** Default sort when the grid sends none. */
  defaultSort?: SortOption;
}

/**
 * Admin panel CRUD with soft delete, matching the Fuse admin
 * `BaseCrudService` contract. Business methods are added by overriding or
 * extending in the concrete service; the base CRUD is not touched.
 */
export abstract class BaseAdminService<
  M extends CostumBaseEntity,
  D extends object,
  U extends object,
> {
  protected constructor(
    protected readonly repository: Repository<M>,
    protected readonly options: BaseAdminOptions = {},
  ) {}

  async create(dto: D): Promise<M> {
    const saved = await this.repository.save(
      this.repository.create(dto as unknown as DeepPartial<M>),
    );
    return this.findOne(saved.id);
  }

  findAll(): Promise<M[]> {
    const qb = this.query();
    this.applySort(qb);
    return qb.getMany();
  }

  async findAllPaginationPost(
    query: PrimeTableQuerySwaggerDTO,
    isArchive = false,
  ): Promise<PaginatedResult<M>> {
    const qb = this.query(isArchive);
    this.applyFilters(qb, query.filters);
    applySearch(
      qb,
      this.repository,
      this.options.searchFields,
      query.globalFilter,
    );
    this.applySort(qb, query.sortField, query.sortOrder);
    qb.skip(query.first ?? 0).take(query.rows ?? 10);
    const [data, count] = await qb.getManyAndCount();
    return { count, data };
  }

  /** Active record, or with `isArchive` a soft-deleted one. */
  async findOne(id: string, isArchive = false): Promise<M> {
    const entity = await this.query(isArchive)
      .andWhere(`${ALIAS}.id = :id`, { id })
      .getOne();
    if (!entity) {
      throw new NotFoundException();
    }
    return entity;
  }

  async update(id: string, dto: U): Promise<M> {
    const entity = await this.findOne(id);
    // DTOs are validated against the entity's columns, so they are partial entities.
    this.repository.merge(entity, dto as unknown as DeepPartial<M>);
    await this.repository.save(entity);
    return this.findOne(id);
  }

  /** Soft delete: the record moves to the archive. */
  async delete(id: string): Promise<M> {
    const entity = await this.findOne(id);
    await this.repository.softDelete(id);
    return entity;
  }

  /** Restores an archived record. */
  async repair(id: string): Promise<M> {
    await this.findOne(id, true);
    await this.repository.restore(id);
    return this.findOne(id);
  }

  protected query(isArchive = false): SelectQueryBuilder<M> {
    const qb = this.repository.createQueryBuilder(ALIAS);
    applyNestedJoins(qb, this.options.relations);
    if (isArchive) {
      qb.withDeleted().andWhere(`${ALIAS}.deleted_at IS NOT NULL`);
    }
    return qb;
  }

  private applySort(
    qb: SelectQueryBuilder<M>,
    sortField?: string,
    sortOrder?: 1 | -1,
  ) {
    const column = sortField && findColumn(this.repository, sortField);
    if (column) {
      qb.orderBy(
        `${ALIAS}.${column.propertyName}`,
        sortOrder === -1 ? 'DESC' : 'ASC',
      );
      return;
    }
    const { field, order } = this.options.defaultSort ?? {
      field: 'created_at',
      order: 'DESC',
    };
    qb.orderBy(`${ALIAS}.${field}`, order);
  }

  private applyFilters(
    qb: SelectQueryBuilder<ObjectLiteral>,
    filters: Record<string, TableFilterRule> | undefined,
  ) {
    let index = 0;
    for (const [field, rule] of Object.entries(filters ?? {})) {
      const column = findColumn(this.repository, field);
      if (
        !column ||
        rule?.value === undefined ||
        rule.value === null ||
        rule.value === ''
      ) {
        continue;
      }
      const param = `f${index++}`;
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
      qb.andWhere(`${textExpression(column.propertyName)} ILIKE :${param}`, {
        [param]: pattern,
      });
    }
  }
}

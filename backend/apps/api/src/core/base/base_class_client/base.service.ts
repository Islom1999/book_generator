import { BadRequestException, NotFoundException } from '@nestjs/common';
import type { CostumBaseEntity } from '@app/entities';
import type { Repository, SelectQueryBuilder } from 'typeorm';
import type {
  ClientPaginatedResult,
  ClientQuery,
  SortOption,
} from '../base.interface.js';
import {
  ALIAS,
  applyNestedJoins,
  applySearch,
  findColumn,
} from '../base.query.js';

export interface BaseClientOptions {
  /** Columns searched by `?search=` (ILIKE). */
  searchFields?: string[];
  /** Relations joined automatically, dot paths for nested (`district.region`). */
  relations?: string[];
  /** Columns the client may filter by equality: `?region_id=...`. */
  filterFields?: string[];
  /** Conditions always applied, e.g. `{ is_active: true }` — clients never see the rest. */
  where?: Record<string, string | number | boolean>;
  defaultSort?: SortOption;
  /** Upper bound for `?limit=`. */
  maxLimit?: number;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Read-only lists for the storefront. Unlike the admin base there is no
 * archive: soft-deleted rows are simply invisible, and `options.where`
 * hides inactive ones.
 */
export abstract class BaseClientService<M extends CostumBaseEntity> {
  protected constructor(
    protected readonly repository: Repository<M>,
    protected readonly options: BaseClientOptions = {},
  ) {}

  async findAllPagination(
    query: ClientQuery,
  ): Promise<ClientPaginatedResult<M>> {
    const qb = this.query();
    applySearch(qb, this.repository, this.options.searchFields, query.search);
    let index = 0;
    for (const [field, value] of Object.entries(query.filters)) {
      const param = `cf${index++}`;
      qb.andWhere(`${ALIAS}.${field} = :${param}`, { [param]: value });
    }
    const { field, order } = this.options.defaultSort ?? {
      field: 'created_at',
      order: 'DESC',
    };
    qb.orderBy(`${ALIAS}.${field}`, order)
      .skip((query.page - 1) * query.limit)
      .take(query.limit);
    const [data, total] = await qb.getManyAndCount();
    return { data, total, page: query.page, limit: query.limit };
  }

  async findOne(id: string): Promise<M> {
    const entity = await this.query()
      .andWhere(`${ALIAS}.id = :id`, { id })
      .getOne();
    if (!entity) {
      throw new NotFoundException();
    }
    return entity;
  }

  /** Parses `?page&limit&search&<filterField>` from a raw query string object. */
  parseQuery(raw: Record<string, unknown>): ClientQuery {
    const page = toPositiveInt(raw.page, 1, 'page');
    const limit = Math.min(
      toPositiveInt(raw.limit, 20, 'limit'),
      this.options.maxLimit ?? 100,
    );
    const search =
      typeof raw.search === 'string' ? raw.search.slice(0, 100) : undefined;

    const filters: Record<string, string> = {};
    for (const field of this.options.filterFields ?? []) {
      const value = raw[field];
      if (value === undefined || value === '') {
        continue;
      }
      const column = findColumn(this.repository, field);
      if (!column || typeof value !== 'string') {
        throw new BadRequestException(`Invalid filter: ${field}`);
      }
      if (column.type === 'uuid' && !UUID.test(value)) {
        throw new BadRequestException(`${field} must be a UUID`);
      }
      filters[column.propertyName] = value;
    }
    return { page, limit, search, filters };
  }

  protected query(): SelectQueryBuilder<M> {
    const qb = this.repository.createQueryBuilder(ALIAS);
    applyNestedJoins(qb, this.options.relations);
    let index = 0;
    for (const [field, value] of Object.entries(this.options.where ?? {})) {
      const param = `w${index++}`;
      qb.andWhere(`${ALIAS}.${field} = :${param}`, { [param]: value });
    }
    return qb;
  }
}

function toPositiveInt(value: unknown, fallback: number, name: string) {
  if (value === undefined || value === '') {
    return fallback;
  }
  const number = Number(value);
  if (!Number.isInteger(number) || number < 1) {
    throw new BadRequestException(`${name} must be a positive integer`);
  }
  return number;
}

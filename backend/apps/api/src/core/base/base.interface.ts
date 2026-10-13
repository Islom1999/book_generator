import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsIn,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export type MatchMode = 'contains' | 'equals' | 'startsWith' | 'endsWith';

export interface TableFilterRule {
  value: string | number | boolean | null;
  matchMode: MatchMode;
}

/**
 * Body of `POST <resource>/pagination`, as sent by the Fuse admin grid
 * (PrimeNG table state; `TableQueryDTO` in
 * `admin/src/app/shared/services/base-crud.service.ts`).
 */
export class PrimeTableQuerySwaggerDTO {
  @ApiPropertyOptional({ description: 'Offset', example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  first?: number;

  @ApiPropertyOptional({ description: 'Page size', example: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(200)
  rows?: number;

  @ApiPropertyOptional({ description: 'Entity column name' })
  @IsOptional()
  @IsString()
  sortField?: string;

  @ApiPropertyOptional({ enum: [1, -1] })
  @IsOptional()
  @IsIn([1, -1])
  sortOrder?: 1 | -1;

  @ApiPropertyOptional({
    description: '{ column: { value, matchMode } }',
    example: { name: { value: 'Tosh', matchMode: 'contains' } },
  })
  @IsOptional()
  @IsObject()
  filters?: Record<string, TableFilterRule>;

  @ApiPropertyOptional({ description: 'Searched in the service searchFields' })
  @IsOptional()
  @IsString()
  globalFilter?: string | null;
}

/** Admin list response: the shape the Fuse grid reads (`IPagination<T>`). */
export interface PaginatedResult<T> {
  count: number;
  data: T[];
}

/** Query string of client (storefront) list endpoints. */
export interface ClientQuery {
  page: number;
  limit: number;
  search?: string;
  /** Equality filters, only for the service's `filterFields`. */
  filters: Record<string, string>;
}

/** Client list response. */
export interface ClientPaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface SortOption {
  field: string;
  order: 'ASC' | 'DESC';
}

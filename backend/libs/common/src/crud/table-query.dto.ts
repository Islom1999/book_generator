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
 * (`TableQueryDTO` in `admin/src/app/shared/services/base-crud.service.ts`).
 */
export class TableQueryDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  first?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(200)
  rows?: number;

  @IsOptional()
  @IsString()
  sortField?: string;

  @IsOptional()
  @IsIn([1, -1])
  sortOrder?: 1 | -1;

  @IsOptional()
  @IsObject()
  filters?: Record<string, TableFilterRule>;

  @IsOptional()
  @IsString()
  globalFilter?: string | null;
}

export interface Paginated<T> {
  count: number;
  data: T[];
}

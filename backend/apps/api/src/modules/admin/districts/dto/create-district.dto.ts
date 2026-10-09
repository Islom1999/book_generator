import { IsTranslatable } from '../../../../common/index.js';
import type { Translatable } from '@app/entities';
import { IsBoolean, IsInt, IsOptional, IsUUID } from 'class-validator';

export class CreateDistrictDto {
  @IsTranslatable()
  name: Translatable;

  @IsUUID()
  region_id: string;

  @IsOptional()
  @IsInt()
  sort_order?: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

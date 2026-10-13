import { IsTranslatable } from '../../../../common/index.js';
import type { Translatable } from '@app/entities';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateRegionDto {
  @IsTranslatable()
  name: Translatable;

  @IsOptional()
  @IsString()
  @Length(1, 32)
  code?: string;

  @IsOptional()
  @IsInt()
  sort_order?: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

import { IsTranslatable } from '../../../../common/index.js';
import type { Translatable } from '@app/entities';
import {
  IsBoolean,
  IsLatitude,
  IsLongitude,
  IsOptional,
  IsUUID,
  Matches,
} from 'class-validator';

export class CreatePostOfficeDto {
  @Matches(/^\d{6}$/, { message: 'postal_code must be 6 digits' })
  postal_code: string;

  @IsTranslatable()
  name: Translatable;

  @IsOptional()
  @IsTranslatable()
  address?: Translatable;

  @IsUUID()
  district_id: string;

  @IsOptional()
  @IsLatitude()
  latitude?: number;

  @IsOptional()
  @IsLongitude()
  longitude?: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

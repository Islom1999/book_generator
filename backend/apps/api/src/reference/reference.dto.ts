import { PartialType } from '@nestjs/swagger';
import { IsTranslatable } from '@app/common';
import type { Translatable } from '@app/database';
import {
  IsBoolean,
  IsInt,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
} from 'class-validator';

export class CreateLanguageDto {
  @Matches(/^[a-z]{2}(-[a-z0-9]{2,4})?$/)
  code: string;

  @IsString()
  @Length(1, 64)
  name: string;

  @IsString()
  @Length(1, 64)
  native_name: string;

  @IsOptional()
  @IsBoolean()
  is_default?: boolean;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsInt()
  sort_order?: number;
}
export class UpdateLanguageDto extends PartialType(CreateLanguageDto) {}

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
export class UpdateRegionDto extends PartialType(CreateRegionDto) {}

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
export class UpdateDistrictDto extends PartialType(CreateDistrictDto) {}

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
export class UpdatePostOfficeDto extends PartialType(CreatePostOfficeDto) {}

export class CreateSettingDto {
  @Matches(/^[a-z0-9_.]+$/)
  key: string;

  @IsNotEmpty()
  value: unknown;

  @IsOptional()
  @IsString()
  description?: string;
}
export class UpdateSettingDto extends PartialType(CreateSettingDto) {}

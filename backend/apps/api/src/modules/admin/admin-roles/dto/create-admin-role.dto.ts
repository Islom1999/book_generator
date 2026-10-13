import type { Translatable } from '@app/entities';
import {
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { IsTranslatable } from '../../../../common/index.js';
import { PERMISSIONS } from '../../../../core/permission/permission.catalog.js';

export class CreateAdminRoleDto {
  @IsTranslatable()
  name: Translatable;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string | null;

  @IsArray()
  @ArrayUnique()
  @IsIn(PERMISSIONS, { each: true })
  permissions: string[];

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

import { AdminRole } from '@app/entities';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class CreateAdminUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @Length(2, 255)
  full_name: string;

  @IsEnum(AdminRole)
  role: AdminRole;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
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

  @IsOptional()
  @IsUUID()
  role_id?: string | null;

  /** Only a super admin can set it. */
  @IsOptional()
  @IsBoolean()
  is_super_admin?: boolean;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

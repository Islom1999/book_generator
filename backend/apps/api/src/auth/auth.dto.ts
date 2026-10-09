import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Matches,
} from 'class-validator';

export class TelegramLoginDto {
  @IsInt()
  @Type(() => Number)
  id: number;

  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsUrl()
  photo_url?: string;

  @IsInt()
  @Type(() => Number)
  auth_date: number;

  @Matches(/^[a-f0-9]{64}$/)
  hash: string;
}

export class GoogleLoginDto {
  @IsString()
  @IsNotEmpty()
  idToken: string;
}

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @Length(2, 255)
  full_name?: string;

  @IsOptional()
  @Matches(/^[a-z]{2}$/)
  locale?: string;
}

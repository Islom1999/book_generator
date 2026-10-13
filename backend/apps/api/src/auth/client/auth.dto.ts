import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
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

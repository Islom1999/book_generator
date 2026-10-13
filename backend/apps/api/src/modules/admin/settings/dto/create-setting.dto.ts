import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class CreateSettingDto {
  @Matches(/^[a-z0-9_.]+$/)
  key: string;

  @IsNotEmpty()
  value: unknown;

  @IsOptional()
  @IsString()
  description?: string;
}

import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
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

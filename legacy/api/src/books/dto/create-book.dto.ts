import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateBookDto {
  @IsString()
  slug: string;

  @IsString()
  titleUz: string;

  @IsString()
  titleRu: string;

  @IsString()
  descUz: string;

  @IsString()
  descRu: string;

  @IsInt()
  @Min(0)
  price: number;

  @IsOptional()
  @IsString()
  ageRange?: string;

  @IsOptional()
  @IsInt()
  pageCount?: number;

  @IsOptional()
  @IsInt()
  freePages?: number;

  @IsOptional()
  @IsString()
  badge?: string | null;

  @IsOptional()
  @IsString()
  gender?: string | null;

  @IsOptional()
  @IsInt()
  hue?: number;

  @IsOptional()
  @IsString()
  emoji?: string;

  @IsOptional()
  @IsString()
  coverUrl?: string | null;

  @IsString()
  themePrompt: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

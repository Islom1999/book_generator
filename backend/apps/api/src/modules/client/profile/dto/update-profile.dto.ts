import { IsOptional, IsString, Length, Matches } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @Length(2, 255)
  full_name?: string;

  @IsOptional()
  @Matches(/^[a-z]{2}$/)
  locale?: string;
}

import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

export class UpdateCustomerDto {
  @IsOptional()
  @IsString()
  @Length(2, 255)
  full_name?: string;

  @IsOptional()
  @IsBoolean()
  is_blocked?: boolean;
}

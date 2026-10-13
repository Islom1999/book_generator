import { IsEmail, IsJWT, IsString, MinLength } from 'class-validator';

export class AdminSignInDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class AdminTokenDto {
  @IsJWT()
  accessToken: string;
}

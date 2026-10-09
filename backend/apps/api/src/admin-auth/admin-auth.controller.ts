import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AdminSignInDto, AdminTokenDto } from './admin-auth.dto.js';
import { AdminAuthService } from './admin-auth.service.js';

/** Endpoints used by the Fuse admin `AuthService`. */
@Controller('admin/auth')
export class AdminAuthController {
  constructor(private readonly auth: AdminAuthService) {}

  @Post('sign-in')
  @HttpCode(200)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  signIn(@Body() dto: AdminSignInDto) {
    return this.auth.signIn(dto.email, dto.password);
  }

  @Post('sign-in-with-token')
  @HttpCode(200)
  signInWithToken(@Body() dto: AdminTokenDto) {
    return this.auth.signInWithToken(dto.accessToken);
  }
}

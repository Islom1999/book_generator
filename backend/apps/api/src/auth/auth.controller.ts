import { Body, Controller, Get, HttpCode, Patch, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Auth, UserAuth, type UserJwtPayload } from '@app/common';
import {
  GoogleLoginDto,
  TelegramLoginDto,
  UpdateProfileDto,
} from './auth.dto.js';
import { AuthService } from './auth.service.js';

/** Storefront login (Google, Telegram) and the current customer's profile. */
@Controller()
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('auth/telegram')
  @HttpCode(200)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  telegram(@Body() dto: TelegramLoginDto) {
    return this.auth.loginWithTelegram(dto);
  }

  @Post('auth/google')
  @HttpCode(200)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  google(@Body() dto: GoogleLoginDto) {
    return this.auth.loginWithGoogle(dto);
  }

  @Get('me')
  @UserAuth()
  me(@Auth() auth: UserJwtPayload) {
    return this.auth.me(auth.sub);
  }

  @Patch('me')
  @UserAuth()
  updateMe(@Auth() auth: UserJwtPayload, @Body() dto: UpdateProfileDto) {
    return this.auth.updateProfile(auth.sub, dto);
  }
}

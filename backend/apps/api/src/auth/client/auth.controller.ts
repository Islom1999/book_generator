import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { GoogleLoginDto, TelegramLoginDto } from './auth.dto.js';
import { AuthService } from './auth.service.js';

/** Storefront login (Google, Telegram). The profile lives in `modules/client/profile`. */
@ApiTags('client / auth')
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
}

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { DatabaseModule } from '@app/database';
import { AdminAuthModule } from './admin-auth/admin-auth.module.js';
import { AdminUsersModule } from './admin-users/admin-users.js';
import { AuthModule } from './auth/auth.module.js';
import { validateEnv } from './config/env.js';
import { HealthController } from './health/health.controller.js';
import { ReferenceModule } from './reference/reference.module.js';
import { CustomersAdminModule } from './users/users.admin.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    DatabaseModule,
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
      }),
    }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 120 }]),
    AdminAuthModule,
    AdminUsersModule,
    AuthModule,
    CustomersAdminModule,
    ReferenceModule,
  ],
  controllers: [HealthController],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}

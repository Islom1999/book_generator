import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, UserIdentity } from '@app/entities';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserIdentity])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}

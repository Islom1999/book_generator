import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BotService } from './bot.service.js';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  providers: [BotService],
})
export class BotModule {}

import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { BotModule } from './bot.module.js';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(BotModule);
  app.enableShutdownHooks();
}
await bootstrap();

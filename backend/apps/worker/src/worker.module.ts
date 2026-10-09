import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Queues, redisConnection } from '@app/queues';
import { DatabaseModule } from '@app/database';
import { GenerationProcessor } from './generation.processor.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    BullModule.forRoot({ connection: redisConnection() }),
    BullModule.registerQueue({ name: Queues.GENERATION }),
  ],
  providers: [GenerationProcessor],
})
export class WorkerModule {}

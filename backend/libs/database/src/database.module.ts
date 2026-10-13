import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ENTITIES } from '@app/entities';
import { databaseOptions } from './database.config.js';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => databaseOptions(ENTITIES),
    }),
  ],
})
export class DatabaseModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Region } from '@app/entities';
import { RegionsController } from './regions.controller.js';
import { RegionsService } from './regions.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Region])],
  controllers: [RegionsController],
  providers: [RegionsService],
})
export class RegionsModule {}

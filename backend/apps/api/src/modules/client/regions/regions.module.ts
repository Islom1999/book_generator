import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Region } from '@app/entities';
import { ClientRegionsController } from './regions.controller.js';
import { ClientRegionsService } from './regions.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Region])],
  controllers: [ClientRegionsController],
  providers: [ClientRegionsService],
})
export class ClientRegionsModule {}

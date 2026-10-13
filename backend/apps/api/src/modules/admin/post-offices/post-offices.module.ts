import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostOffice } from '@app/entities';
import { PostOfficesController } from './post-offices.controller.js';
import { PostOfficesService } from './post-offices.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([PostOffice])],
  controllers: [PostOfficesController],
  providers: [PostOfficesService],
})
export class PostOfficesModule {}

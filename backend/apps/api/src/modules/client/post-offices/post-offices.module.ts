import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostOffice } from '@app/entities';
import { ClientPostOfficesController } from './post-offices.controller.js';
import { ClientPostOfficesService } from './post-offices.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([PostOffice])],
  controllers: [ClientPostOfficesController],
  providers: [ClientPostOfficesService],
})
export class ClientPostOfficesModule {}

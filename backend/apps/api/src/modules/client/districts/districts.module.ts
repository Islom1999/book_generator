import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { District } from '@app/entities';
import { ClientDistrictsController } from './districts.controller.js';
import { ClientDistrictsService } from './districts.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([District])],
  controllers: [ClientDistrictsController],
  providers: [ClientDistrictsService],
})
export class ClientDistrictsModule {}

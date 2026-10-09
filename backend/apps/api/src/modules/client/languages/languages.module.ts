import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Language } from '@app/entities';
import { ClientLanguagesController } from './languages.controller.js';
import { ClientLanguagesService } from './languages.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Language])],
  controllers: [ClientLanguagesController],
  providers: [ClientLanguagesService],
})
export class ClientLanguagesModule {}

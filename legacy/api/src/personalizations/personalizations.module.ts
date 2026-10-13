import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksModule } from '../books/books.module';
import { Personalization } from '../entities/personalization.entity';
import { PersonalizationsController } from './personalizations.controller';
import { PdfService } from './pdf.service';
import { PersonalizationsService } from './personalizations.service';

@Module({
  imports: [TypeOrmModule.forFeature([Personalization]), BooksModule],
  controllers: [PersonalizationsController],
  providers: [PersonalizationsService, PdfService],
  exports: [PersonalizationsService],
})
export class PersonalizationsModule {}

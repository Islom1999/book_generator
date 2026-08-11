import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import type { Response } from 'express';
import { PersonalizationsService } from './personalizations.service';

@Controller('personalizations')
export class PersonalizationsController {
  constructor(private readonly service: PersonalizationsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: memoryStorage(),
      limits: { fileSize: 8 * 1024 * 1024 },
    }),
  )
  create(
    @UploadedFile() photo: Express.Multer.File,
    @Body()
    body: {
      bookId: string;
      childName: string;
      childAge: string;
      gender: string;
      bookLang?: string;
      dedication?: string;
    },
  ) {
    return this.service.create({
      bookId: body.bookId,
      childName: body.childName,
      childAge: Number(body.childAge),
      gender: body.gender,
      bookLang: body.bookLang || 'uz',
      dedication: body.dedication,
      photo,
    });
  }

  @Get()
  list(@Query('ids') ids?: string) {
    return this.service.listByIds(
      (ids || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    );
  }

  @Get(':id/pdf')
  @Header('Content-Type', 'application/pdf')
  async pdf(@Param('id') id: string, @Res() res: Response) {
    const buf = await this.service.buildPdf(id);
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader(
      'Content-Disposition',
      `inline; filename="ertak-${id.slice(0, 8)}.pdf"`,
    );
    res.send(buf);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.service.get(id);
  }
}

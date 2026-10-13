import {
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { STORAGE, type StorageDriver } from '@app/storage';
import type { Response } from 'express';
import { MediaUrlService } from './media-url.service.js';

const CONTENT_TYPES: Record<string, string> = {
  jpg: 'image/jpeg',
  webp: 'image/webp',
  png: 'image/png',
  pdf: 'application/pdf',
};

/** Serves private storage objects behind signed, expiring tokens. */
@ApiTags('media')
@Controller('media')
export class MediaController {
  constructor(
    private readonly urls: MediaUrlService,
    @Inject(STORAGE) private readonly storage: StorageDriver,
  ) {}

  @Get(':token')
  @Throttle({ default: { limit: 300, ttl: 60_000 } })
  async get(@Param('token') token: string, @Res() res: Response) {
    const key = this.urls.verify(token);
    if (!key || !(await this.storage.exists(key))) {
      throw new NotFoundException();
    }
    const extension = key.split('.').pop() ?? '';
    res.setHeader(
      'Content-Type',
      CONTENT_TYPES[extension] ?? 'application/octet-stream',
    );
    res.setHeader('Cache-Control', 'private, max-age=300');
    // Images are shown on the admin and client origins.
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.send(await this.storage.get(key));
  }
}

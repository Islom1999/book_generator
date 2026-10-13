import { randomUUID } from 'node:crypto';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileKind, StoredFile } from '@app/entities';
import {
  makePreview,
  normalizeImage,
  STORAGE,
  type StorageDriver,
} from '@app/storage';
import type { Repository } from 'typeorm';
import { SettingsReader } from '../settings/settings.reader.js';
import { MediaUrlService } from './media-url.service.js';

export interface UploadImageOptions {
  kind: FileKind;
  userId?: string | null;
  /** Watermark the preview (anything a customer can see). */
  watermark: boolean;
  deleteAfter?: Date | null;
}

/** Image uploads into private storage plus signed URLs for showing them. */
@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(StoredFile)
    private readonly files: Repository<StoredFile>,
    @Inject(STORAGE) private readonly storage: StorageDriver,
    private readonly urls: MediaUrlService,
    private readonly settings: SettingsReader,
  ) {}

  /** Normalises the image, stores original + preview and records the file. */
  async uploadImage(input: Buffer, options: UploadImageOptions) {
    let original;
    try {
      original = await normalizeImage(input);
    } catch {
      throw new BadRequestException('File is not a supported image');
    }
    const preview = await makePreview(original.buffer, {
      maxPx: await this.settings.get('preview.max_px'),
      watermark: options.watermark
        ? await this.settings.get('preview.watermark_text')
        : undefined,
    });
    const now = new Date();
    const base = `${options.kind}/${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, '0')}/${randomUUID()}`;
    const key = `${base}.jpg`;
    const previewKey = `${base}.preview.webp`;
    await this.storage.put(key, original.buffer, original.contentType);
    await this.storage.put(previewKey, preview.buffer, preview.contentType);
    return this.files.save(
      this.files.create({
        key,
        preview_key: previewKey,
        kind: options.kind,
        mime_type: original.contentType,
        size_bytes: original.buffer.length,
        width: original.width,
        height: original.height,
        user_id: options.userId ?? null,
        delete_after: options.deleteAfter ?? null,
      }),
    );
  }

  findOne(id: string) {
    return this.files.findOneBy({ id });
  }

  /** Signed preview URL: the only form a customer ever receives. */
  async previewUrl(file: Pick<StoredFile, 'preview_key'> | null | undefined) {
    return this.urls.sign(
      file?.preview_key,
      await this.settings.get('preview.url_ttl_seconds'),
    );
  }

  /** Signed full-resolution URL; admin endpoints only. */
  async originalUrl(file: Pick<StoredFile, 'key'> | null | undefined) {
    return this.urls.sign(
      file?.key,
      await this.settings.get('preview.url_ttl_seconds'),
    );
  }

  /** Removes the objects and the row (retention, replaced images). */
  async remove(file: StoredFile) {
    await this.storage.delete(file.key);
    if (file.preview_key) {
      await this.storage.delete(file.preview_key);
    }
    await this.files.delete(file.id);
  }
}

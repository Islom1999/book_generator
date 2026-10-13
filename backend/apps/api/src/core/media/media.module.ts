import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoredFile } from '@app/entities';
import { StorageModule } from '@app/storage';
import { SettingsReader } from '../settings/settings.reader.js';
import { FilesService } from './files.service.js';
import { MediaUrlService } from './media-url.service.js';
import { MediaController } from './media.controller.js';

/** Storage, signed media URLs and settings, available to every API module. */
@Global()
@Module({
  imports: [StorageModule, TypeOrmModule.forFeature([StoredFile])],
  controllers: [MediaController],
  providers: [FilesService, MediaUrlService, SettingsReader],
  exports: [FilesService, MediaUrlService, SettingsReader],
})
export class MediaModule {}

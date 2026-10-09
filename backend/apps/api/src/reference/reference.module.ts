import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { District, Language, PostOffice, Region, Setting } from '@app/database';
import {
  DistrictsAdminController,
  LanguagesAdminController,
  PostOfficesAdminController,
  RegionsAdminController,
  SettingsAdminController,
} from './reference.admin.controllers.js';
import { ReferencePublicController } from './reference.public.controller.js';
import {
  DistrictsService,
  LanguagesService,
  PostOfficesService,
  RegionsService,
  SettingsService,
} from './reference.services.js';

/** Spravochniklar: languages, address directory, settings. */
@Module({
  imports: [
    TypeOrmModule.forFeature([District, Language, PostOffice, Region, Setting]),
  ],
  controllers: [
    LanguagesAdminController,
    RegionsAdminController,
    DistrictsAdminController,
    PostOfficesAdminController,
    SettingsAdminController,
    ReferencePublicController,
  ],
  providers: [
    DistrictsService,
    LanguagesService,
    PostOfficesService,
    RegionsService,
    SettingsService,
  ],
  exports: [LanguagesService, SettingsService],
})
export class ReferenceModule {}

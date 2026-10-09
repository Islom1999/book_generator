import { Controller } from '@nestjs/common';
import { AdminAuth, CrudController } from '@app/common';
import {
  AdminRole,
  type District,
  type Language,
  type PostOffice,
  type Region,
  type Setting,
} from '@app/database';
import {
  CreateDistrictDto,
  CreateLanguageDto,
  CreatePostOfficeDto,
  CreateRegionDto,
  CreateSettingDto,
  UpdateDistrictDto,
  UpdateLanguageDto,
  UpdatePostOfficeDto,
  UpdateRegionDto,
  UpdateSettingDto,
} from './reference.dto.js';
import {
  DistrictsService,
  LanguagesService,
  PostOfficesService,
  RegionsService,
  SettingsService,
} from './reference.services.js';

@Controller('admin/languages')
@AdminAuth(AdminRole.SUPER_ADMIN)
export class LanguagesAdminController extends CrudController<Language>({
  create: CreateLanguageDto,
  update: UpdateLanguageDto,
}) {
  constructor(readonly service: LanguagesService) {
    super();
  }
}

@Controller('admin/regions')
@AdminAuth(AdminRole.OPERATOR, AdminRole.LOGISTICS)
export class RegionsAdminController extends CrudController<Region>({
  create: CreateRegionDto,
  update: UpdateRegionDto,
}) {
  constructor(readonly service: RegionsService) {
    super();
  }
}

@Controller('admin/districts')
@AdminAuth(AdminRole.OPERATOR, AdminRole.LOGISTICS)
export class DistrictsAdminController extends CrudController<District>({
  create: CreateDistrictDto,
  update: UpdateDistrictDto,
}) {
  constructor(readonly service: DistrictsService) {
    super();
  }
}

@Controller('admin/post-offices')
@AdminAuth(AdminRole.OPERATOR, AdminRole.LOGISTICS)
export class PostOfficesAdminController extends CrudController<PostOffice>({
  create: CreatePostOfficeDto,
  update: UpdatePostOfficeDto,
}) {
  constructor(readonly service: PostOfficesService) {
    super();
  }
}

@Controller('admin/settings')
@AdminAuth(AdminRole.SUPER_ADMIN)
export class SettingsAdminController extends CrudController<Setting>({
  create: CreateSettingDto,
  update: UpdateSettingDto,
}) {
  constructor(readonly service: SettingsService) {
    super();
  }
}

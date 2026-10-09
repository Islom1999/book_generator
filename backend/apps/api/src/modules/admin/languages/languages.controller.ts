import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminRole, Language } from '@app/entities';
import { AdminAuth } from '../../../common/index.js';
import { BaseAdminController } from '../../../core/base/base_class/base.controller.js';
import { CreateLanguageDto } from './dto/create-language.dto.js';
import { UpdateLanguageDto } from './dto/update-language.dto.js';
import { LanguagesService } from './languages.service.js';

@ApiTags('admin / languages')
@ApiBearerAuth()
@Controller('admin/languages')
@AdminAuth(AdminRole.SUPER_ADMIN) // permission: languages.manage
export class LanguagesController extends BaseAdminController<
  Language,
  CreateLanguageDto,
  UpdateLanguageDto
> {
  constructor(service: LanguagesService) {
    super(service);
  }

  protected dtoClassCreate() {
    return CreateLanguageDto;
  }

  protected dtoClassUpdate() {
    return UpdateLanguageDto;
  }
}

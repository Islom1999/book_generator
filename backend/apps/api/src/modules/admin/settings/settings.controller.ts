import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminRole, Setting } from '@app/entities';
import { AdminAuth } from '../../../common/index.js';
import { BaseAdminController } from '../../../core/base/base_class/base.controller.js';
import { CreateSettingDto } from './dto/create-setting.dto.js';
import { UpdateSettingDto } from './dto/update-setting.dto.js';
import { SettingsService } from './settings.service.js';

@ApiTags('admin / settings')
@ApiBearerAuth()
@Controller('admin/settings')
@AdminAuth(AdminRole.SUPER_ADMIN) // permission: settings.manage
export class SettingsController extends BaseAdminController<
  Setting,
  CreateSettingDto,
  UpdateSettingDto
> {
  constructor(service: SettingsService) {
    super(service);
  }

  protected dtoClassCreate() {
    return CreateSettingDto;
  }

  protected dtoClassUpdate() {
    return UpdateSettingDto;
  }
}

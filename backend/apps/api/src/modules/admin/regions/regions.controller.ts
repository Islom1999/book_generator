import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminRole, Region } from '@app/entities';
import { AdminAuth } from '../../../common/index.js';
import { BaseAdminController } from '../../../core/base/base_class/base.controller.js';
import { CreateRegionDto } from './dto/create-region.dto.js';
import { UpdateRegionDto } from './dto/update-region.dto.js';
import { RegionsService } from './regions.service.js';

@ApiTags('admin / regions')
@ApiBearerAuth()
@Controller('admin/regions')
@AdminAuth(AdminRole.OPERATOR, AdminRole.LOGISTICS) // permission: addresses.manage
export class RegionsController extends BaseAdminController<
  Region,
  CreateRegionDto,
  UpdateRegionDto
> {
  constructor(service: RegionsService) {
    super(service);
  }

  protected dtoClassCreate() {
    return CreateRegionDto;
  }

  protected dtoClassUpdate() {
    return UpdateRegionDto;
  }
}

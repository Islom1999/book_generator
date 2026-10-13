import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { District } from '@app/entities';
import { AdminAuth } from '../../../common/index.js';
import { BaseAdminController } from '../../../core/base/base_class/base.controller.js';
import { CreateDistrictDto } from './dto/create-district.dto.js';
import { UpdateDistrictDto } from './dto/update-district.dto.js';
import { DistrictsService } from './districts.service.js';

@ApiTags('admin / districts')
@ApiBearerAuth()
@Controller('admin/districts')
@AdminAuth('addresses.manage')
export class DistrictsController extends BaseAdminController<
  District,
  CreateDistrictDto,
  UpdateDistrictDto
> {
  constructor(service: DistrictsService) {
    super(service);
  }

  protected dtoClassCreate() {
    return CreateDistrictDto;
  }

  protected dtoClassUpdate() {
    return UpdateDistrictDto;
  }
}

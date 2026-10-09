import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminRole, PostOffice } from '@app/entities';
import { AdminAuth } from '../../../common/index.js';
import { BaseAdminController } from '../../../core/base/base_class/base.controller.js';
import { CreatePostOfficeDto } from './dto/create-post-office.dto.js';
import { UpdatePostOfficeDto } from './dto/update-post-office.dto.js';
import { PostOfficesService } from './post-offices.service.js';

@ApiTags('admin / post-offices')
@ApiBearerAuth()
@Controller('admin/post-offices')
@AdminAuth(AdminRole.OPERATOR, AdminRole.LOGISTICS) // permission: addresses.manage
export class PostOfficesController extends BaseAdminController<
  PostOffice,
  CreatePostOfficeDto,
  UpdatePostOfficeDto
> {
  constructor(service: PostOfficesService) {
    super(service);
  }

  protected dtoClassCreate() {
    return CreatePostOfficeDto;
  }

  protected dtoClassUpdate() {
    return UpdatePostOfficeDto;
  }
}

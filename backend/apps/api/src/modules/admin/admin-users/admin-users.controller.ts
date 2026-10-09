import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminRole, AdminUser } from '@app/entities';
import { AdminAuth } from '../../../common/index.js';
import { BaseAdminController } from '../../../core/base/base_class/base.controller.js';
import { CreateAdminUserDto } from './dto/create-admin-user.dto.js';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto.js';
import { AdminUsersService } from './admin-users.service.js';

@ApiTags('admin / admin-users')
@ApiBearerAuth()
@Controller('admin/admin-users')
@AdminAuth(AdminRole.SUPER_ADMIN) // permission: admins.manage
export class AdminUsersController extends BaseAdminController<
  AdminUser,
  CreateAdminUserDto,
  UpdateAdminUserDto
> {
  constructor(service: AdminUsersService) {
    super(service);
  }

  protected dtoClassCreate() {
    return CreateAdminUserDto;
  }

  protected dtoClassUpdate() {
    return UpdateAdminUserDto;
  }
}

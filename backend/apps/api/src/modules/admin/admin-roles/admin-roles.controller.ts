import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminRole } from '@app/entities';
import { AdminAuth, AdminReadAuth } from '../../../common/index.js';
import { BaseAdminController } from '../../../core/base/base_class/base.controller.js';
import { PERMISSION_GROUPS } from '../../../core/permission/permission.catalog.js';
import { AdminRolesService } from './admin-roles.service.js';
import { CreateAdminRoleDto } from './dto/create-admin-role.dto.js';
import { UpdateAdminRoleDto } from './dto/update-admin-role.dto.js';

@ApiTags('admin / roles')
@ApiBearerAuth()
@Controller('admin/roles')
@AdminAuth('roles.manage')
@AdminReadAuth('admins.view', 'admins.manage')
export class AdminRolesController extends BaseAdminController<
  AdminRole,
  CreateAdminRoleDto,
  UpdateAdminRoleDto
> {
  constructor(service: AdminRolesService) {
    super(service);
  }

  protected dtoClassCreate() {
    return CreateAdminRoleDto;
  }

  protected dtoClassUpdate() {
    return UpdateAdminRoleDto;
  }
}

/** The permission catalog, grouped; labels are translated in the admin panel. */
@ApiTags('admin / roles')
@ApiBearerAuth()
@Controller('admin/permissions')
@AdminAuth()
export class PermissionsController {
  @Get()
  catalog() {
    return Object.entries(PERMISSION_GROUPS).map(([group, keys]) => ({
      group,
      permissions: keys,
    }));
  }
}

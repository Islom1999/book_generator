import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminRole, AdminUser } from '@app/entities';
import type { Repository } from 'typeorm';
import { BaseAdminService } from '../../../core/base/base_class/base.service.js';
import { requestContext } from '../../../core/context/request-context.js';
import { CreateAdminRoleDto } from './dto/create-admin-role.dto.js';
import { UpdateAdminRoleDto } from './dto/update-admin-role.dto.js';

@Injectable()
export class AdminRolesService extends BaseAdminService<
  AdminRole,
  CreateAdminRoleDto,
  UpdateAdminRoleDto
> {
  constructor(
    @InjectRepository(AdminRole) repository: Repository<AdminRole>,
    @InjectRepository(AdminUser)
    private readonly admins: Repository<AdminUser>,
  ) {
    super(repository, { searchFields: ['name', 'description'] });
  }

  override create(dto: CreateAdminRoleDto) {
    assertCanGrant(dto.permissions);
    return super.create(dto);
  }

  override async update(id: string, dto: UpdateAdminRoleDto) {
    const admin = requestContext().admin;
    if (admin && !admin.is_super_admin) {
      const own = await this.admins.findOneBy({ id: admin.id });
      if (own?.role_id === id) {
        throw new ForbiddenException('You cannot edit your own role');
      }
    }
    assertCanGrant(dto.permissions);
    return super.update(id, dto);
  }

  override async delete(id: string) {
    if (await this.admins.existsBy({ role_id: id })) {
      throw new ConflictException('Role is assigned to admins');
    }
    return super.delete(id);
  }
}

/** An admin can only hand out permissions they have themselves (BUSINESS_LOGIC §9). */
export function assertCanGrant(permissions: readonly string[] | undefined) {
  const admin = requestContext().admin;
  if (!admin || admin.is_super_admin || !permissions) {
    return;
  }
  const missing = permissions.filter((key) => !admin.permissions.has(key));
  if (missing.length) {
    throw new ForbiddenException(
      `You cannot grant permissions you do not have: ${missing.join(', ')}`,
    );
  }
}

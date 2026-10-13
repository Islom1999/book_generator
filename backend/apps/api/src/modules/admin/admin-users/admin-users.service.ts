import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminRole, AdminUser } from '@app/entities';
import bcrypt from 'bcryptjs';
import { Not, type Repository } from 'typeorm';
import { BaseAdminService } from '../../../core/base/base_class/base.service.js';
import { requestContext } from '../../../core/context/request-context.js';
import { assertCanGrant } from '../admin-roles/admin-roles.service.js';
import { CreateAdminUserDto } from './dto/create-admin-user.dto.js';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto.js';

/**
 * Rules (BUSINESS_LOGIC §9): only a super admin creates or edits super admins;
 * an admin cannot change their own role, flags or status; a role can only be
 * assigned by someone who has all its permissions; at least one active super
 * admin always remains.
 */
@Injectable()
export class AdminUsersService extends BaseAdminService<
  AdminUser,
  CreateAdminUserDto,
  UpdateAdminUserDto
> {
  constructor(
    @InjectRepository(AdminUser) repository: Repository<AdminUser>,
    @InjectRepository(AdminRole)
    private readonly roles: Repository<AdminRole>,
  ) {
    super(repository, {
      searchFields: ['email', 'full_name'],
      relations: ['role'],
    });
  }

  override async create(dto: CreateAdminUserDto) {
    if (dto.is_super_admin) {
      assertSuperAdmin();
    }
    await this.assertAssignableRole(dto.role_id);
    return super.create((await this.withHash(dto)) as never);
  }

  override async update(id: string, dto: UpdateAdminUserDto) {
    const target = await this.findOne(id);
    const actor = requestContext().admin;
    // Forms send every field; only real changes are checked.
    const changes = (key: 'role_id' | 'is_super_admin' | 'is_active') =>
      dto[key] !== undefined && dto[key] !== target[key];
    if (target.is_super_admin || changes('is_super_admin')) {
      assertSuperAdmin();
    }
    if (
      actor?.id === id &&
      (changes('role_id') || changes('is_super_admin') || changes('is_active'))
    ) {
      throw new ForbiddenException('You cannot change your own role or status');
    }
    if (changes('role_id')) {
      await this.assertAssignableRole(dto.role_id);
    }
    const losesSuperAdmin =
      target.is_super_admin &&
      target.is_active &&
      (dto.is_super_admin === false || dto.is_active === false);
    if (losesSuperAdmin) {
      await this.assertAnotherSuperAdmin(id);
    }
    return super.update(id, (await this.withHash(dto)) as never);
  }

  override async delete(id: string) {
    const target = await this.findOne(id);
    if (requestContext().admin?.id === id) {
      throw new ForbiddenException('You cannot delete yourself');
    }
    if (target.is_super_admin) {
      assertSuperAdmin();
      await this.assertAnotherSuperAdmin(id);
    }
    return super.delete(id);
  }

  private async assertAssignableRole(roleId: string | null | undefined) {
    if (!roleId) {
      return;
    }
    const role = await this.roles.findOneBy({ id: roleId });
    if (!role) {
      throw new BadRequestException('Role not found');
    }
    assertCanGrant(role.permissions);
  }

  private async assertAnotherSuperAdmin(exceptId: string) {
    const others = await this.repository.countBy({
      id: Not(exceptId),
      is_super_admin: true,
      is_active: true,
    });
    if (others === 0) {
      throw new ConflictException(
        'At least one active super admin must remain',
      );
    }
  }

  /** Swaps the plain `password` for `password_hash` and normalises the email. */
  private async withHash({ password, ...dto }: UpdateAdminUserDto) {
    return {
      ...dto,
      ...(dto.email ? { email: dto.email.toLowerCase() } : {}),
      ...(password ? { password_hash: await bcrypt.hash(password, 12) } : {}),
    };
  }
}

function assertSuperAdmin() {
  if (!requestContext().admin?.is_super_admin) {
    throw new ForbiddenException('Only a super admin can do this');
  }
}

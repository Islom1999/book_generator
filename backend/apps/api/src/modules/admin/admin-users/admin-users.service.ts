import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminUser } from '@app/entities';
import bcrypt from 'bcryptjs';
import type { Repository } from 'typeorm';
import { BaseAdminService } from '../../../core/base/base_class/base.service.js';
import { CreateAdminUserDto } from './dto/create-admin-user.dto.js';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto.js';

@Injectable()
export class AdminUsersService extends BaseAdminService<
  AdminUser,
  CreateAdminUserDto,
  UpdateAdminUserDto
> {
  constructor(@InjectRepository(AdminUser) repository: Repository<AdminUser>) {
    super(repository, {
      searchFields: ['email', 'full_name'],
    });
  }

  override async create(dto: CreateAdminUserDto) {
    return super.create((await this.withHash(dto)) as never);
  }

  override async update(id: string, dto: UpdateAdminUserDto) {
    return super.update(id, (await this.withHash(dto)) as never);
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

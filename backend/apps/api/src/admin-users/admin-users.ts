import { Controller, Injectable, Module } from '@nestjs/common';
import { PartialType } from '@nestjs/swagger';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { AdminAuth, BaseCrudService, CrudController } from '@app/common';
import { AdminRole, AdminUser } from '@app/database';
import bcrypt from 'bcryptjs';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';
import type { DeepPartial, Repository } from 'typeorm';

export class CreateAdminUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @Length(2, 255)
  full_name: string;

  @IsEnum(AdminRole)
  role: AdminRole;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
export class UpdateAdminUserDto extends PartialType(CreateAdminUserDto) {}

type AdminUserInput = DeepPartial<AdminUser> & { password?: string };

@Injectable()
export class AdminUsersService extends BaseCrudService<AdminUser> {
  constructor(@InjectRepository(AdminUser) repo: Repository<AdminUser>) {
    super(repo, { searchFields: ['email', 'full_name'] });
  }

  override async create(dto: AdminUserInput) {
    return super.create(await this.withHash(dto));
  }

  override async update(id: string, dto: AdminUserInput) {
    return super.update(id, await this.withHash(dto));
  }

  private async withHash({ password, ...dto }: AdminUserInput) {
    return {
      ...dto,
      ...(dto.email ? { email: String(dto.email).toLowerCase() } : {}),
      ...(password ? { password_hash: await bcrypt.hash(password, 12) } : {}),
    };
  }
}

@Controller('admin/admin-users')
@AdminAuth(AdminRole.SUPER_ADMIN)
export class AdminUsersController extends CrudController<AdminUser>({
  create: CreateAdminUserDto,
  update: UpdateAdminUserDto,
}) {
  constructor(readonly service: AdminUsersService) {
    super();
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([AdminUser])],
  controllers: [AdminUsersController],
  providers: [AdminUsersService],
})
export class AdminUsersModule {}

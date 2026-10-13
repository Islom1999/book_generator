import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminRole, AdminUser } from '@app/entities';
import {
  AdminRolesController,
  PermissionsController,
} from './admin-roles.controller.js';
import { AdminRolesService } from './admin-roles.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([AdminRole, AdminUser])],
  controllers: [AdminRolesController, PermissionsController],
  providers: [AdminRolesService],
})
export class AdminRolesModule {}

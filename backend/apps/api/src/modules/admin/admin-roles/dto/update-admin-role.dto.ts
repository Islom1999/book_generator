import { PartialType } from '@nestjs/swagger';
import { CreateAdminRoleDto } from './create-admin-role.dto.js';

export class UpdateAdminRoleDto extends PartialType(CreateAdminRoleDto) {}

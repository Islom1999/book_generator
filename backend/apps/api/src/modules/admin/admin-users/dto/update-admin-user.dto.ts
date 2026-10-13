import { PartialType } from '@nestjs/swagger';
import { CreateAdminUserDto } from './create-admin-user.dto.js';

export class UpdateAdminUserDto extends PartialType(CreateAdminUserDto) {}

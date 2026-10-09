import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@app/entities';
import type { Repository } from 'typeorm';
import { BaseAdminService } from '../../../core/base/base_class/base.service.js';
import { UpdateCustomerDto } from './dto/update-customer.dto.js';

@Injectable()
export class CustomersService extends BaseAdminService<
  User,
  never,
  UpdateCustomerDto
> {
  constructor(@InjectRepository(User) repository: Repository<User>) {
    super(repository, {
      searchFields: ['full_name', 'phone', 'email'],
      relations: ['identities'],
    });
  }
}

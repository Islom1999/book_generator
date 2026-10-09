import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostOffice } from '@app/entities';
import type { Repository } from 'typeorm';
import { BaseClientService } from '../../../core/base/base_class_client/base.service.js';

@Injectable()
export class ClientPostOfficesService extends BaseClientService<PostOffice> {
  constructor(
    @InjectRepository(PostOffice) repository: Repository<PostOffice>,
  ) {
    super(repository, {
      searchFields: ['postal_code', 'name', 'address'],
      filterFields: ['district_id'],
      where: { is_active: true },
      defaultSort: { field: 'postal_code', order: 'ASC' },
    });
  }
}

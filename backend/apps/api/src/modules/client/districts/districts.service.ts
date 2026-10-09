import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { District } from '@app/entities';
import type { Repository } from 'typeorm';
import { BaseClientService } from '../../../core/base/base_class_client/base.service.js';

@Injectable()
export class ClientDistrictsService extends BaseClientService<District> {
  constructor(@InjectRepository(District) repository: Repository<District>) {
    super(repository, {
      searchFields: ['name'],
      filterFields: ['region_id'],
      where: { is_active: true },
      defaultSort: { field: 'sort_order', order: 'ASC' },
    });
  }
}

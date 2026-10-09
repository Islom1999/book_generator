import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Region } from '@app/entities';
import type { Repository } from 'typeorm';
import { BaseClientService } from '../../../core/base/base_class_client/base.service.js';

@Injectable()
export class ClientRegionsService extends BaseClientService<Region> {
  constructor(@InjectRepository(Region) repository: Repository<Region>) {
    super(repository, {
      searchFields: ['name'],
      where: { is_active: true },
      defaultSort: { field: 'sort_order', order: 'ASC' },
    });
  }
}

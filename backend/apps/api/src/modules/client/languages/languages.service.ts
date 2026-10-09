import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Language } from '@app/entities';
import type { Repository } from 'typeorm';
import { BaseClientService } from '../../../core/base/base_class_client/base.service.js';

@Injectable()
export class ClientLanguagesService extends BaseClientService<Language> {
  constructor(@InjectRepository(Language) repository: Repository<Language>) {
    super(repository, {
      searchFields: ['code', 'name', 'native_name'],
      where: { is_active: true },
      defaultSort: { field: 'sort_order', order: 'ASC' },
    });
  }
}

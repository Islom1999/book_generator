import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Setting } from '@app/entities';
import type { Repository } from 'typeorm';
import { BaseAdminService } from '../../../core/base/base_class/base.service.js';
import { CreateSettingDto } from './dto/create-setting.dto.js';
import { UpdateSettingDto } from './dto/update-setting.dto.js';

@Injectable()
export class SettingsService extends BaseAdminService<
  Setting,
  CreateSettingDto,
  UpdateSettingDto
> {
  constructor(@InjectRepository(Setting) repository: Repository<Setting>) {
    super(repository, {
      searchFields: ['key', 'description'],
      defaultSort: { field: 'key', order: 'ASC' },
    });
  }

  /** Typed value of a setting, or `fallback` when it isn't set. */
  async get<T>(key: string, fallback: T): Promise<T> {
    const setting = await this.repository.findOneBy({ key });
    return setting ? (setting.value as T) : fallback;
  }
}

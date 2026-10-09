import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Language } from '@app/entities';
import { Not, Repository } from 'typeorm';
import { BaseAdminService } from '../../../core/base/base_class/base.service.js';
import { CreateLanguageDto } from './dto/create-language.dto.js';
import { UpdateLanguageDto } from './dto/update-language.dto.js';

@Injectable()
export class LanguagesService extends BaseAdminService<
  Language,
  CreateLanguageDto,
  UpdateLanguageDto
> {
  constructor(@InjectRepository(Language) repository: Repository<Language>) {
    super(repository, {
      searchFields: ['code', 'name', 'native_name'],
      defaultSort: { field: 'sort_order', order: 'ASC' },
    });
  }

  override async create(dto: CreateLanguageDto) {
    return this.keepSingleDefault(await super.create(dto));
  }

  override async update(id: string, dto: UpdateLanguageDto) {
    return this.keepSingleDefault(await super.update(id, dto));
  }

  /** Only one language can be the default. */
  private async keepSingleDefault(language: Language) {
    if (language.is_default) {
      await this.repository.update(
        { id: Not(language.id), is_default: true },
        { is_default: false },
      );
    }
    return language;
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseCrudService } from '@app/common';
import { District, Language, PostOffice, Region, Setting } from '@app/database';
import { type DeepPartial, Not, Repository } from 'typeorm';

@Injectable()
export class LanguagesService extends BaseCrudService<Language> {
  constructor(@InjectRepository(Language) repo: Repository<Language>) {
    super(repo, {
      searchFields: ['code', 'name', 'native_name'],
      defaultSort: { field: 'sort_order', order: 'ASC' },
    });
  }

  findActive() {
    return this.repo.find({
      where: { is_active: true },
      order: { sort_order: 'ASC' },
    });
  }

  override async create(dto: DeepPartial<Language>) {
    const language = await super.create(dto);
    return this.keepSingleDefault(language);
  }

  override async update(id: string, dto: DeepPartial<Language>) {
    const language = await super.update(id, dto);
    return this.keepSingleDefault(language);
  }

  private async keepSingleDefault(language: Language) {
    if (language.is_default) {
      await this.repo.update(
        { id: Not(language.id), is_default: true },
        { is_default: false },
      );
    }
    return language;
  }
}

@Injectable()
export class RegionsService extends BaseCrudService<Region> {
  constructor(@InjectRepository(Region) repo: Repository<Region>) {
    super(repo, {
      searchFields: ['name', 'code'],
      defaultSort: { field: 'sort_order', order: 'ASC' },
    });
  }

  findActive() {
    return this.repo.find({
      where: { is_active: true },
      order: { sort_order: 'ASC' },
    });
  }
}

@Injectable()
export class DistrictsService extends BaseCrudService<District> {
  constructor(@InjectRepository(District) repo: Repository<District>) {
    super(repo, {
      searchFields: ['name'],
      relations: ['region'],
      defaultSort: { field: 'sort_order', order: 'ASC' },
    });
  }

  findActiveByRegion(regionId: string) {
    return this.repo.find({
      where: { region_id: regionId, is_active: true },
      order: { sort_order: 'ASC' },
    });
  }
}

@Injectable()
export class PostOfficesService extends BaseCrudService<PostOffice> {
  constructor(@InjectRepository(PostOffice) repo: Repository<PostOffice>) {
    super(repo, {
      searchFields: ['postal_code', 'name', 'address'],
      relations: ['district'],
      defaultSort: { field: 'postal_code', order: 'ASC' },
    });
  }

  findActiveByDistrict(districtId: string) {
    return this.repo.find({
      where: { district_id: districtId, is_active: true },
      order: { postal_code: 'ASC' },
    });
  }
}

@Injectable()
export class SettingsService extends BaseCrudService<Setting> {
  constructor(@InjectRepository(Setting) repo: Repository<Setting>) {
    super(repo, {
      searchFields: ['key', 'description'],
      defaultSort: { field: 'key', order: 'ASC' },
    });
  }

  async get<T>(key: string, fallback: T): Promise<T> {
    const setting = await this.repo.findOneBy({ key });
    return setting ? (setting.value as T) : fallback;
  }
}

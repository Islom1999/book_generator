import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { District } from '@app/entities';
import type { Repository } from 'typeorm';
import { BaseAdminService } from '../../../core/base/base_class/base.service.js';
import { CreateDistrictDto } from './dto/create-district.dto.js';
import { UpdateDistrictDto } from './dto/update-district.dto.js';

@Injectable()
export class DistrictsService extends BaseAdminService<
  District,
  CreateDistrictDto,
  UpdateDistrictDto
> {
  constructor(@InjectRepository(District) repository: Repository<District>) {
    super(repository, {
      searchFields: ['name'],
      relations: ['region'],
      defaultSort: { field: 'sort_order', order: 'ASC' },
    });
  }
}

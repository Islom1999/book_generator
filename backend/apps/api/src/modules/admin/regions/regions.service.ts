import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Region } from '@app/entities';
import type { Repository } from 'typeorm';
import { BaseAdminService } from '../../../core/base/base_class/base.service.js';
import { CreateRegionDto } from './dto/create-region.dto.js';
import { UpdateRegionDto } from './dto/update-region.dto.js';

@Injectable()
export class RegionsService extends BaseAdminService<
  Region,
  CreateRegionDto,
  UpdateRegionDto
> {
  constructor(@InjectRepository(Region) repository: Repository<Region>) {
    super(repository, {
      searchFields: ['name', 'code'],
      defaultSort: { field: 'sort_order', order: 'ASC' },
    });
  }
}

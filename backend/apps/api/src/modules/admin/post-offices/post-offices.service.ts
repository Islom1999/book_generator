import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostOffice } from '@app/entities';
import type { Repository } from 'typeorm';
import { BaseAdminService } from '../../../core/base/base_class/base.service.js';
import { CreatePostOfficeDto } from './dto/create-post-office.dto.js';
import { UpdatePostOfficeDto } from './dto/update-post-office.dto.js';

@Injectable()
export class PostOfficesService extends BaseAdminService<
  PostOffice,
  CreatePostOfficeDto,
  UpdatePostOfficeDto
> {
  constructor(
    @InjectRepository(PostOffice) repository: Repository<PostOffice>,
  ) {
    super(repository, {
      searchFields: ['postal_code', 'name', 'address'],
      relations: ['district', 'district.region'],
      defaultSort: { field: 'postal_code', order: 'ASC' },
    });
  }
}

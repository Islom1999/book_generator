import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuditLog } from '@app/entities';
import type { Repository } from 'typeorm';
import { BaseAdminService } from '../../../core/base/base_class/base.service.js';

/** Read-only: audit rows are written by `writeAudit`, never through the API. */
@Injectable()
export class AuditLogsService extends BaseAdminService<AuditLog, never, never> {
  constructor(@InjectRepository(AuditLog) repository: Repository<AuditLog>) {
    super(repository, {
      searchFields: ['action', 'entity', 'entity_id'],
      relations: ['admin'],
    });
  }
}

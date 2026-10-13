import { Injectable } from '@angular/core'
import { BaseCrudService } from 'app/shared/services/base-crud.service'
import { IAuditLog } from '../models/audit-log.model'

@Injectable({ providedIn: 'root' })
export class AuditLogService extends BaseCrudService<IAuditLog> {
  constructor() {
    super('admin/audit-logs')
  }
}

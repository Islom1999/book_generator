import { Injectable } from '@angular/core'
import { BaseCrudService } from 'app/shared/services/base-crud.service'
import { IAdminUser } from '../models/admin-user.model'

@Injectable({ providedIn: 'root' })
export class AdminUserService extends BaseCrudService<IAdminUser> {
  constructor() {
    super('admin/admin-users')
  }
}

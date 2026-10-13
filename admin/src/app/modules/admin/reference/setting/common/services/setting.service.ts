import { Injectable } from '@angular/core'
import { BaseCrudService } from 'app/shared/services/base-crud.service'
import { ISetting } from '../models/setting.model'

@Injectable({ providedIn: 'root' })
export class SettingService extends BaseCrudService<ISetting> {
  constructor() {
    super('admin/settings')
  }
}

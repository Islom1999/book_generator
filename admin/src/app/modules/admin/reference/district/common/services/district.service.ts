import { Injectable } from '@angular/core'
import { BaseCrudService } from 'app/shared/services/base-crud.service'
import { IDistrict } from '../models/district.model'

@Injectable({ providedIn: 'root' })
export class DistrictService extends BaseCrudService<IDistrict> {
  constructor() {
    super('admin/districts')
  }
}

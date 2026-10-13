import { Injectable } from '@angular/core'
import { BaseCrudService } from 'app/shared/services/base-crud.service'
import { IRegion } from '../models/region.model'

@Injectable({ providedIn: 'root' })
export class RegionService extends BaseCrudService<IRegion> {
  constructor() {
    super('admin/regions')
  }
}

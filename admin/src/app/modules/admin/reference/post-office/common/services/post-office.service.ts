import { Injectable } from '@angular/core'
import { BaseCrudService } from 'app/shared/services/base-crud.service'
import { IPostOffice } from '../models/post-office.model'

@Injectable({ providedIn: 'root' })
export class PostOfficeService extends BaseCrudService<IPostOffice> {
  constructor() {
    super('admin/post-offices')
  }
}

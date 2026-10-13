import { Injectable } from '@angular/core'
import { BaseCrudService } from 'app/shared/services/base-crud.service'
import { ICustomer } from '../models/customer.model'

@Injectable({ providedIn: 'root' })
export class CustomerService extends BaseCrudService<ICustomer> {
  constructor() {
    super('admin/users')
  }
}

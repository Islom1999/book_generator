import { Injectable } from '@angular/core'
import { IPermissionGroup } from 'app/core/permission/permission.catalog'
import { BaseCrudService } from 'app/shared/services/base-crud.service'
import { Observable, shareReplay } from 'rxjs'
import { IAdminRole } from '../models/admin-role.model'

@Injectable({ providedIn: 'root' })
export class AdminRoleService extends BaseCrudService<IAdminRole> {
  constructor() {
    super('admin/roles')
  }

  /** The grouped permission catalog; it only changes with a deploy, so it is cached. */
  readonly catalog$: Observable<IPermissionGroup[]> = this.baseApi
    .get<IPermissionGroup[]>('admin/permissions')
    .pipe(shareReplay(1))
}

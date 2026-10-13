import { inject, Injectable } from '@angular/core'
import { GridService } from 'app/shared/components/grid/common/grid.service'
import { TableQueryDTO } from 'app/shared/services/base-crud.service'
import { map, Observable } from 'rxjs'
import { GridResponse } from 'app/shared'
import { IAdminRole } from '../models/admin-role.model'
import { AdminRoleService } from './admin-role.service'

@Injectable()
export class AdminRoleGridService extends GridService<IAdminRole> {
  private adminRoleService = inject(AdminRoleService)

  constructor() {
    super()
  }

  override getAllData(
    params: TableQueryDTO,
    isArchiveView: boolean,
  ): Observable<GridResponse<IAdminRole>> {
    return this.adminRoleService.getAllPagination(params, isArchiveView).pipe(
      map((response) => ({
        count: response.count,
        data: Array.isArray(response.data) ? response.data : [],
      })),
    )
  }
}

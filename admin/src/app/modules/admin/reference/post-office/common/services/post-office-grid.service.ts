import { inject, Injectable } from '@angular/core'
import { GridService } from 'app/shared/components/grid/common/grid.service'
import { TableQueryDTO } from 'app/shared/services/base-crud.service'
import { map, Observable } from 'rxjs'
import { GridResponse } from 'app/shared'
import { IPostOffice } from '../models/post-office.model'
import { PostOfficeService } from './post-office.service'

@Injectable()
export class PostOfficeGridService extends GridService<IPostOffice> {
  private postOfficeService = inject(PostOfficeService)

  constructor() {
    super()
  }

  override getAllData(
    params: TableQueryDTO,
    isArchiveView: boolean,
  ): Observable<GridResponse<IPostOffice>> {
    return this.postOfficeService.getAllPagination(params, isArchiveView).pipe(
      map((response) => ({
        count: response.count,
        data: Array.isArray(response.data) ? response.data : [],
      })),
    )
  }
}

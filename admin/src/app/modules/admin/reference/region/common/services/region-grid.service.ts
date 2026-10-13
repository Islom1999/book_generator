import { inject, Injectable } from '@angular/core'
import { GridService } from 'app/shared/components/grid/common/grid.service'
import { TableQueryDTO } from 'app/shared/services/base-crud.service'
import { map, Observable } from 'rxjs'
import { GridResponse } from 'app/shared'
import { IRegion } from '../models/region.model'
import { RegionService } from './region.service'

@Injectable()
export class RegionGridService extends GridService<IRegion> {
  private regionService = inject(RegionService)

  constructor() {
    super()
  }

  override getAllData(
    params: TableQueryDTO,
    isArchiveView: boolean,
  ): Observable<GridResponse<IRegion>> {
    return this.regionService.getAllPagination(params, isArchiveView).pipe(
      map((response) => ({
        count: response.count,
        data: Array.isArray(response.data) ? response.data : [],
      })),
    )
  }
}

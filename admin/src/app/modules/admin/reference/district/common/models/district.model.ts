import { IBaseModel } from 'app/core/services/base.model'
import { Translatable } from 'app/shared/translatable/translatable'

export interface IDistrict extends IBaseModel {
  name: Translatable
  region_id: string
  region?: { id: string; name: Translatable }
  sort_order: number
  is_active: boolean
}

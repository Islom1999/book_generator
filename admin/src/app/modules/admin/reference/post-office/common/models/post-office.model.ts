import { IBaseModel } from 'app/core/services/base.model'
import { Translatable } from 'app/shared/translatable/translatable'

export interface IPostOffice extends IBaseModel {
  postal_code: string
  name: Translatable
  address: Translatable | null
  district_id: string
  district?: { id: string; name: Translatable }
  latitude: number | null
  longitude: number | null
  is_active: boolean
}

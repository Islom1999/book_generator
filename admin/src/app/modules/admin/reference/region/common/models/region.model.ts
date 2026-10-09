import { IBaseModel } from 'app/core/services/base.model'
import { Translatable } from 'app/shared/translatable/translatable'

export interface IRegion extends IBaseModel {
  name: Translatable
  code: string | null
  sort_order: number
  is_active: boolean
}

import { IBaseModel } from 'app/core/services/base.model'

export interface ILanguage extends IBaseModel {
  code: string
  name: string
  native_name: string
  is_default: boolean
  is_active: boolean
  sort_order: number
}

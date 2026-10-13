import { IBaseModel } from 'app/core/services/base.model'

export interface ISetting extends IBaseModel {
  key: string
  value: unknown
  description: string | null
}

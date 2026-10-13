import { IBaseModel } from 'app/core/services/base.model'
import { Permission } from 'app/core/permission/permission.catalog'
import { Translatable } from 'app/shared/translatable/translatable'

export interface IAdminRole extends IBaseModel {
  name: Translatable
  description: string | null
  permissions: Permission[]
  is_active: boolean
}

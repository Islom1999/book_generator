import { IBaseModel } from 'app/core/services/base.model'
import { IAdminRole } from 'app/modules/admin/users/admin-role/common/models/admin-role.model'

export interface IAdminUser extends IBaseModel {
  email: string
  full_name: string
  role_id: string | null
  role: IAdminRole | null
  is_super_admin: boolean
  is_active: boolean
  last_login_at: string | null
}

import { IBaseModel } from 'app/core/services/base.model'
import { AdminRole } from 'app/core/user/user.types'

export interface IAdminUser extends IBaseModel {
  email: string
  full_name: string
  role: AdminRole
  is_active: boolean
  last_login_at: string | null
}

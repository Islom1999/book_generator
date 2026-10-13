import { IBaseModel } from 'app/core/services/base.model'

export interface ICustomer extends IBaseModel {
  full_name: string
  phone: string | null
  email: string | null
  avatar_url: string | null
  locale: string | null
  is_blocked: boolean
  last_login_at: string | null
}

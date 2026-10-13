import { Permission } from 'app/core/permission/permission.catalog'
import { Translatable } from 'app/shared/translatable/translatable'

export interface User {
  id: string
  name: string
  email: string
  role?: { id: string; name: Translatable } | null
  is_super_admin?: boolean
  permissions?: Permission[]
  avatar?: string
  status?: string
}

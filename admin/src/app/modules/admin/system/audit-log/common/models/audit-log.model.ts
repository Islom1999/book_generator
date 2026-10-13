import { IBaseModel } from 'app/core/services/base.model'
import { IAdminUser } from 'app/modules/admin/users/admin-user/common/models/admin-user.model'

export interface IAuditLog extends IBaseModel {
  admin_id: string | null
  admin: Pick<IAdminUser, 'id' | 'email' | 'full_name'> | null
  action: string
  entity: string
  entity_id: string | null
  before: Record<string, unknown> | null
  after: Record<string, unknown> | null
  ip: string | null
}

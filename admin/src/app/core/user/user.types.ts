export type AdminRole = 'super_admin' | 'moderator' | 'operator' | 'logistics' | 'finance'

export interface User {
  id: string
  name: string
  email: string
  role?: AdminRole
  avatar?: string
  status?: string
}

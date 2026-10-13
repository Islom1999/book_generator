import { computed, inject, Injectable } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { UserService } from 'app/core/user/user.service'
import { Permission } from './permission.catalog'

/** The signed-in admin's permissions (from the sign-in response). */
@Injectable({ providedIn: 'root' })
export class PermissionService {
  private user = toSignal(inject(UserService).user$)

  readonly permissions = computed(() => new Set(this.user()?.permissions ?? []))
  readonly isSuperAdmin = computed(() => !!this.user()?.is_super_admin)

  /** True when the admin has any of the keys (no keys = any admin). */
  hasAny(...keys: Permission[]): boolean {
    if (this.isSuperAdmin() || keys.length === 0) {
      return true
    }
    const own = this.permissions()
    return keys.some((key) => own.has(key))
  }
}

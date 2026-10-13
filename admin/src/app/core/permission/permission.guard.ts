import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { UserService } from 'app/core/user/user.service'
import { map, take } from 'rxjs'
import { Permission } from './permission.catalog'

/** Route guard: the admin needs any of the keys, otherwise back to the dashboard. */
export const permissionGuard =
  (...keys: Permission[]): CanActivateFn =>
  () => {
    const router = inject(Router)
    return inject(UserService).user$.pipe(
      take(1),
      map((user) => {
        const own = new Set(user.permissions ?? [])
        return user.is_super_admin || keys.some((key) => own.has(key))
          ? true
          : router.parseUrl('/dashboard')
      }),
    )
  }

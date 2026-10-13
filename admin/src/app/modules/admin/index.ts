import { Route } from '@angular/router'
import { permissionGuard } from 'app/core/permission/permission.guard'

/**
 * Admin panel pages (rendered inside the main layout, behind AuthGuard).
 * New feature routes are added here.
 */
export const adminRoutes: Route[] = [
  {
    path: 'dashboard',
    loadChildren: () => import('app/modules/admin/dashboard/dashboard.routes'),
  },
  {
    path: 'users',
    children: [
      {
        path: 'customers',
        canActivate: [permissionGuard('customers.view')],
        loadChildren: () => import('app/modules/admin/users/customer/customer.routes'),
      },
      {
        path: 'admins',
        canActivate: [permissionGuard('admins.view', 'admins.manage')],
        loadChildren: () => import('app/modules/admin/users/admin-user/admin-user.routes'),
      },
      {
        path: 'roles',
        canActivate: [permissionGuard('roles.manage', 'admins.view', 'admins.manage')],
        loadChildren: () => import('app/modules/admin/users/admin-role/admin-role.routes'),
      },
    ],
  },
  {
    path: 'reference',
    children: [
      {
        path: 'regions',
        canActivate: [permissionGuard('addresses.manage')],
        loadChildren: () => import('app/modules/admin/reference/region/region.routes'),
      },
      {
        path: 'districts',
        canActivate: [permissionGuard('addresses.manage')],
        loadChildren: () => import('app/modules/admin/reference/district/district.routes'),
      },
      {
        path: 'post-offices',
        canActivate: [permissionGuard('addresses.manage')],
        loadChildren: () => import('app/modules/admin/reference/post-office/post-office.routes'),
      },
      {
        path: 'languages',
        canActivate: [permissionGuard('languages.manage')],
        loadChildren: () => import('app/modules/admin/reference/language/language.routes'),
      },
      {
        path: 'settings',
        canActivate: [permissionGuard('settings.manage')],
        loadChildren: () => import('app/modules/admin/reference/setting/setting.routes'),
      },
    ],
  },
  {
    path: 'system',
    children: [
      {
        path: 'audit',
        canActivate: [permissionGuard('audit.view')],
        loadChildren: () => import('app/modules/admin/system/audit-log/audit-log.routes'),
      },
    ],
  },
]

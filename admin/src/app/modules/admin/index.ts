import { Route } from '@angular/router'

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
        loadChildren: () => import('app/modules/admin/users/customer/customer.routes'),
      },
      {
        path: 'admins',
        loadChildren: () => import('app/modules/admin/users/admin-user/admin-user.routes'),
      },
    ],
  },
  {
    path: 'reference',
    children: [
      {
        path: 'regions',
        loadChildren: () => import('app/modules/admin/reference/region/region.routes'),
      },
      {
        path: 'districts',
        loadChildren: () => import('app/modules/admin/reference/district/district.routes'),
      },
      {
        path: 'post-offices',
        loadChildren: () => import('app/modules/admin/reference/post-office/post-office.routes'),
      },
      {
        path: 'languages',
        loadChildren: () => import('app/modules/admin/reference/language/language.routes'),
      },
      {
        path: 'settings',
        loadChildren: () => import('app/modules/admin/reference/setting/setting.routes'),
      },
    ],
  },
]

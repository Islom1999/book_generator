import { Route } from '@angular/router'
import { initialDataResolver } from 'app/app.resolvers'
import { AuthGuard } from 'app/core/auth/guards/auth.guard'
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard'
import { LayoutComponent } from 'app/layout/layout.component'

export const appRoutes: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },

  // After signing in, the sign-in page redirects here.
  { path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'dashboard' },

  // Guests
  {
    path: '',
    canActivate: [NoAuthGuard],
    canActivateChild: [NoAuthGuard],
    component: LayoutComponent,
    data: { layout: 'empty' },
    children: [
      { path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.routes') },
    ],
  },

  // Signed-in admins, empty layout
  {
    path: '',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component: LayoutComponent,
    data: { layout: 'empty' },
    children: [
      { path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.routes') },
    ],
  },

  // Admin panel
  {
    path: '',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component: LayoutComponent,
    resolve: { initialData: initialDataResolver },
    children: [
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
            loadChildren: () =>
              import('app/modules/admin/reference/post-office/post-office.routes'),
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
    ],
  },
]

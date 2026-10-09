import { Routes } from '@angular/router'
import { AdminUserListComponent, AdminUserFormComponent } from './pages'

export const adminUserRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: AdminUserListComponent,
      },
      {
        path: 'create',
        component: AdminUserFormComponent,
      },
      {
        path: 'edit/:id',
        component: AdminUserFormComponent,
      },
    ],
  },
]

export default adminUserRoutes

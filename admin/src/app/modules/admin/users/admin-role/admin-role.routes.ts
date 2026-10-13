import { Routes } from '@angular/router'
import { AdminRoleListComponent, AdminRoleFormComponent } from './pages'

export const adminRoleRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: AdminRoleListComponent,
      },
      {
        path: 'create',
        component: AdminRoleFormComponent,
      },
      {
        path: 'edit/:id',
        component: AdminRoleFormComponent,
      },
    ],
  },
]

export default adminRoleRoutes

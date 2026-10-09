import { Routes } from '@angular/router'
import { CustomerListComponent, CustomerFormComponent } from './pages'

export const customerRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: CustomerListComponent,
      },
      {
        path: 'create',
        component: CustomerFormComponent,
      },
      {
        path: 'edit/:id',
        component: CustomerFormComponent,
      },
    ],
  },
]

export default customerRoutes

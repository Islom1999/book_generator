import { Routes } from '@angular/router'
import { PostOfficeListComponent, PostOfficeFormComponent } from './pages'

export const postOfficeRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: PostOfficeListComponent,
      },
      {
        path: 'create',
        component: PostOfficeFormComponent,
      },
      {
        path: 'edit/:id',
        component: PostOfficeFormComponent,
      },
    ],
  },
]

export default postOfficeRoutes

import { Routes } from '@angular/router'
import { RegionListComponent, RegionFormComponent } from './pages'

export const regionRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: RegionListComponent,
      },
      {
        path: 'create',
        component: RegionFormComponent,
      },
      {
        path: 'edit/:id',
        component: RegionFormComponent,
      },
    ],
  },
]

export default regionRoutes

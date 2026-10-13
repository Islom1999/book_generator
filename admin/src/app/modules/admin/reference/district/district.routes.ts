import { Routes } from '@angular/router'
import { DistrictListComponent, DistrictFormComponent } from './pages'

export const districtRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: DistrictListComponent,
      },
      {
        path: 'create',
        component: DistrictFormComponent,
      },
      {
        path: 'edit/:id',
        component: DistrictFormComponent,
      },
    ],
  },
]

export default districtRoutes

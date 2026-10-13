import { Routes } from '@angular/router'
import { SettingListComponent, SettingFormComponent } from './pages'

export const settingRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: SettingListComponent,
      },
      {
        path: 'create',
        component: SettingFormComponent,
      },
      {
        path: 'edit/:id',
        component: SettingFormComponent,
      },
    ],
  },
]

export default settingRoutes

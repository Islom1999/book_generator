import { Routes } from '@angular/router'
import { LanguageListComponent, LanguageFormComponent } from './pages'

export const languageRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: LanguageListComponent,
      },
      {
        path: 'create',
        component: LanguageFormComponent,
      },
      {
        path: 'edit/:id',
        component: LanguageFormComponent,
      },
    ],
  },
]

export default languageRoutes

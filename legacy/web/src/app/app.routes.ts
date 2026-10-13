import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home.component';
import { CatalogComponent } from './pages/catalog.component';
import { BookDetailComponent } from './pages/book-detail.component';
import { WizardComponent } from './pages/wizard.component';
import { CartComponent } from './pages/cart.component';
import { CheckoutComponent } from './pages/checkout.component';
import { AdminComponent } from './pages/admin.component';
import { ResultsListComponent } from './pages/results-list.component';
import { ResultDetailComponent } from './pages/result-detail.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'books', component: CatalogComponent },
  { path: 'books/:slug', component: BookDetailComponent },
  { path: 'books/:slug/personalize', component: WizardComponent },
  { path: 'natijalar', component: ResultsListComponent },
  { path: 'natijalar/:id', component: ResultDetailComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'admin', component: AdminComponent },
  { path: '**', redirectTo: '' },
];

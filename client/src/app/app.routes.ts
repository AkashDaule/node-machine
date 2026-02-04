import { Routes } from '@angular/router';
import { CategoryComponent } from './pages/category/category.component';
import { ProductComponent } from './pages/product/product.component';

export const routes: Routes = [
  { path: 'categories', component: CategoryComponent },
  { path: 'products', component: ProductComponent },
  { path: '', redirectTo: 'categories', pathMatch: 'full' }
];

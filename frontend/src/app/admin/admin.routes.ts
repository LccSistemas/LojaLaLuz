import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layout/admin-layout.component';
import { adminGuard } from '../guards/admin.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/admin-login.component').then(
        (m) => m.AdminLoginComponent
      ),
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/dashboard/admin-dashboard.component').then(
            (m) => m.AdminDashboardComponent
          ),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./pages/products/products-list.component').then(
            (m) => m.ProductsListComponent
          ),
      },
      {
        path: 'products/new',
        loadComponent: () =>
          import('./pages/products/product-form.component').then(
            (m) => m.ProductFormComponent
          ),
      },
      {
        path: 'products/:id',
        loadComponent: () =>
          import('./pages/products/product-form.component').then(
            (m) => m.ProductFormComponent
          ),
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./pages/categories/categories-list.component').then(
            (m) => m.CategoriesListComponent
          ),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./pages/orders/orders-list.component').then(
            (m) => m.OrdersListComponent
          ),
      },
      {
        path: 'customers',
        loadComponent: () =>
          import('./pages/customers/customers-list.component').then(
            (m) => m.CustomersListComponent
          ),
      },
      {
        path: 'banners',
        loadComponent: () =>
          import('./pages/banners/banners-list.component').then(
            (m) => m.BannersListComponent
          ),
      },
      {
        path: 'site-config',
        loadComponent: () =>
          import('./pages/site-config/site-config.component').then(
            (m) => m.SiteConfigComponent
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./pages/settings/settings.component').then(
            (m) => m.SettingsComponent
          ),
      },
    ],
  },
];

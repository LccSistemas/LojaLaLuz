import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'produtos',
    loadComponent: () =>
      import('./pages/products/products.component').then(
        (m) => m.ProductsComponent
      ),
  },
  {
    path: 'produto/:slug',
    loadComponent: () =>
      import('./pages/product-detail/product-detail.component').then(
        (m) => m.ProductDetailComponent
      ),
  },
  {
    path: 'carrinho',
    loadComponent: () =>
      import('./pages/cart/cart.component').then((m) => m.CartComponent),
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('./pages/checkout/checkout.component').then(
        (m) => m.CheckoutComponent
      ),
  },
  {
    path: 'checkout/success',
    loadComponent: () =>
      import('./pages/checkout-success/checkout-success.component').then(
        (m) => m.CheckoutSuccessComponent
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'cadastro',
    loadComponent: () =>
      import('./pages/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: 'conta',
    loadComponent: () =>
      import('./pages/account/account.component').then(
        (m) => m.AccountComponent
      ),
  },
  {
    path: 'activate-account',
    loadComponent: () =>
      import('./pages/activate-account/activate-account.component').then(
        (m) => m.ActivateAccountComponent
      ),
  },
  {
    path: 'categoria/:slug',
    loadComponent: () =>
      import('./pages/products/products.component').then(
        (m) => m.ProductsComponent
      ),
  },
  {
    path: 'orders/:orderNumber',
    loadComponent: () =>
      import('./pages/checkout-success/checkout-success.component').then(
        (m) => m.CheckoutSuccessComponent
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];

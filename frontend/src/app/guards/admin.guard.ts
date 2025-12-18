import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    // Não está logado, redireciona para login do admin
    router.navigate(['/admin/login'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }

  if (!authService.isAdmin()) {
    // Está logado mas não é admin, faz logout e redireciona para login do admin
    authService.logout();
    router.navigate(['/admin/login'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }

  return true;
};

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }

  return true;
};

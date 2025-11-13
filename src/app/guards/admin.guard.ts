import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // ✅ Verifica que estamos en el navegador
  if (isPlatformBrowser(platformId)) {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      if (parsedUser.rol === 'ADMIN') {
        return true;
      }
    }
  }

  // Si no es admin o no está logueado, redirige al login
  router.navigate(['/login']);
  return false;
};

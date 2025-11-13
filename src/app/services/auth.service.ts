import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) {}

  // Guarda token y rol
  login(token: string, rol: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('rol', rol);
  }

  // Devuelve si está autenticado
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // Devuelve el rol actual
  getUserRole(): string | null {
    return localStorage.getItem('rol');
  }

  // Cierra sesión
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    this.router.navigate(['/login']);
  }
}

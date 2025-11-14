import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  // Datos del formulario
  correo ='';
  password = '';

  errorMsg: string = '';
  loading: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  onLogin() {
    console.log('🟢 Ejecutando onLogin()');

    const datos = { correo: this.correo, password: this.password };
    console.log('📤 Enviando datos:', datos);

    this.http.post<any>('http://4.155.250.187:8080/auth/login', datos).subscribe({
      next: (response) => {
        console.log('✅ Login exitoso', response);

        if (response.token && response.rol && response.id) {
          const userData = {
            token: response.token,
            rol: response.rol,
            id: response.id
          };

          localStorage.setItem('user', JSON.stringify(userData));
          console.log('💾 Usuario guardado en localStorage');

          // 🔥 Redirigir según el rol
          if (response.rol === 'ADMIN') {
            this.router.navigate(['/inicio']);
          }
          else if (response.rol === 'MESERO') {
            console.log('Redirigiendo a /mesasPedidos');
            this.router.navigate(['/mesasPedidos']);
          }
          else if (response.rol === 'COCINERO') {
            console.log('Redirigiendo a cocina');
            this.router.navigate(['/cocina']);
          }
          else {
            console.warn('⚠️ Rol desconocido:', response.rol);
          }

        } else {
          console.error('⚠️ Respuesta sin token o rol');
        }
      },
      error: (error) => {
        console.error('❌ Error en login', error);
      },
    });
  }
}

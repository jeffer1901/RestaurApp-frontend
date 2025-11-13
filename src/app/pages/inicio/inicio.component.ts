import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  // ✅ Signals reemplazan las propiedades tradicionales (más eficiente en Angular 20)
  user = signal<any>(null);
  nombre = signal('');
  rol = signal('');

  constructor(
    private router: Router,
    private http: HttpClient

  ) {}

  ngOnInit() {
    const storedUser = localStorage.getItem('user');

    if (!storedUser) {
      this.router.navigate(['/login']);
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    this.user.set(parsedUser);
    this.rol.set(parsedUser.rol);

    const userId = parsedUser.id;
    const token = parsedUser.token;

    console.log('🟢 ID del usuario:', userId);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.get<any>(`http://localhost:8080/usuarios/${userId}`, { headers })
      .subscribe({
        next: (data) => {
          console.log('📩 Datos del usuario:', data);
          if (data?.nombre && data?.apellido) {
            this.nombre.set(`${data.nombre} ${data.apellido}`);
            console.log('✅ Nombre asignado:', this.nombre());
          } else {
            console.warn('⚠️ Datos incompletos:', data);
          }
        },
        error: (err) => {
          console.error('❌ Error al obtener usuario:', err);
        }
      });
  }

  cerrarSesion() {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}

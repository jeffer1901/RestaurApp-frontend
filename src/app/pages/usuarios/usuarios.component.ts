import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { UsuariosService } from '../../services/usuario.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  usuarios: any[] = [];
  filtro: string = '';
  idBusqueda: string = '';
  mostrarModal: boolean = false;
  nuevoUsuario: any = { id: null, nombre: '', apellido: '', correo: '', password: '', rol: 'MESERO' };

  constructor(
    private usuariosService: UsuariosService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarUsuarios();
    this.router.events
      .pipe(filter((event: any) => event.constructor.name === 'NavigationEnd'))
      .subscribe((event: any) => {
        if (event.urlAfterRedirects === '/usuarios') {
          this.cargarUsuarios();
        }
      });
  }

  cargarUsuarios() {
    this.usuariosService.obtenerUsuarios().subscribe({
      next: (data: any) => {
        this.usuarios = data;
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('❌ Error al cargar usuarios:', err)
    });
  }

  buscarPorId() {
    const id = this.idBusqueda?.toString().trim();
    if (!id) {
      this.cargarUsuarios();
      return;
    }

    this.usuariosService.obtenerUsuarioPorId(Number(id)).subscribe({
      next: (usuario: any) => {
        this.usuarios = usuario ? [usuario] : [];
        this.cdr.detectChanges();
      },
      error: () => {
        alert('No se encontró el usuario con ese ID');
        this.cargarUsuarios();
      }
    });
  }

  abrirModal(usuario?: any) {
    this.nuevoUsuario = usuario
      ? JSON.parse(JSON.stringify(usuario))
      : { id: null, nombre: '', apellido: '', correo: '', password: '', rol: 'MESERO' };
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  esEdicion(): boolean {
    if (!this.nuevoUsuario || !this.nuevoUsuario.id) return false;
    return this.usuarios.some((u: any) => u.id === this.nuevoUsuario.id);
  }

  guardarUsuario() {
    if (this.esEdicion()) {
      this.usuariosService.actualizarUsuario(this.nuevoUsuario.id, this.nuevoUsuario).subscribe({
        next: (usuarioActualizado: any) => {
          alert('✅ Usuario actualizado');
          // ✅ Actualiza directamente el array sin volver a pedir todo al backend
          const index = this.usuarios.findIndex(u => u.id === usuarioActualizado.id);
          if (index !== -1) this.usuarios[index] = usuarioActualizado;
          this.cdr.detectChanges();
          this.cerrarModal();
        },
        error: (err: any) => console.error('❌ Error al actualizar usuario:', err)
      });
    } else {
      this.usuariosService.agregarUsuario(this.nuevoUsuario).subscribe({
        next: (usuarioCreado: any) => {
          alert('✅ Usuario agregado');
          // ✅ Añade el nuevo usuario directamente a la lista
          this.usuarios.push(usuarioCreado);
          this.cdr.detectChanges();
          this.cerrarModal();
        },
        error: (err: any) => console.error('❌ Error al agregar usuario:', err)
      });
    }
  }

  eliminarUsuario(id: number) {
    if (!confirm(`¿Seguro que deseas eliminar el usuario ${id}?`)) return;

    this.usuariosService.eliminarUsuario(id).subscribe({
      next: () => {
        alert('✅ Usuario eliminado');
        // ✅ Elimina del array sin volver a cargar todo
        this.usuarios = this.usuarios.filter(u => u.id !== id);
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('❌ Error al eliminar usuario:', err)
    });
  }

  get usuariosFiltrados() {
    if (!this.filtro.trim()) return this.usuarios;
    const filtroLower = this.filtro.toLowerCase();
    return this.usuarios.filter(
      u =>
        u.nombre.toLowerCase().includes(filtroLower) ||
        u.apellido.toLowerCase().includes(filtroLower) ||
        u.rol.toLowerCase().includes(filtroLower)
    );
  }
}

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MesasService } from '../../services/mesas.service';

@Component({
  selector: 'app-mesas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet],
  templateUrl: './mesas.component.html',
  styleUrls: ['./mesas.component.css']
})
export class MesasComponent implements OnInit {
  mesas: any[] = [];
  idBusqueda: string = '';
  filtro: string = '';
  mostrarModal: boolean = false;
  editando: boolean = false; // 👈 Nuevo flag
  nuevaMesa: any = { id: null, capacidad: 0, estado: 'LIBRE', mesero: { id: null } };

  constructor(
    private mesasService: MesasService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarMesas();
    this.router.events
      .pipe(filter((event: any) => event.constructor.name === 'NavigationEnd'))
      .subscribe((event: any) => {
        if (event.urlAfterRedirects === '/mesas') {
          this.cargarMesas();
        }
      });
  }

  cargarMesas() {
    this.mesasService.obtenerMesas().subscribe({
      next: (data) => {
        this.mesas = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('❌ Error al cargar mesas:', err)
    });
  }

  buscarPorId() {
    const id = this.idBusqueda?.toString().trim();
    if (!id) {
      this.cargarMesas();
      return;
    }

    this.mesasService.obtenerMesaPorId(Number(id)).subscribe({
      next: (mesa) => {
        this.mesas = mesa ? [mesa] : [];
        this.cdr.detectChanges();
      },
      error: () => {
        alert('No se encontró la mesa con ese ID');
        this.cargarMesas();
      }
    });
  }

  abrirModal(mesa?: any) {
    if (mesa) {
      this.nuevaMesa = JSON.parse(JSON.stringify(mesa));
      this.editando = true;
    } else {
      const maxId = this.mesas.length > 0 ? Math.max(...this.mesas.map(m => m.id)) : 0;
      this.nuevaMesa = { id: maxId + 1, capacidad: 0, estado: 'LIBRE', mesero: { id: null } };
      this.editando = false;
    }
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  guardarMesa() {
    if (this.editando) {
      // 🟡 Actualizar mesa existente
      this.mesasService.actualizarMesa(this.nuevaMesa.id, this.nuevaMesa).subscribe({
        next: () => {
          alert('Mesa actualizada ✅');
          this.cerrarModal();
          this.cargarMesas();
        },
        error: (err) => console.error('❌ Error al actualizar mesa:', err)
      });
    } else {
      // 🟢 Agregar nueva mesa
      this.mesasService.agregarMesa(this.nuevaMesa).subscribe({
        next: () => {
          alert('Mesa agregada ✅');
          this.cerrarModal();
          this.cargarMesas();
        },
        error: (err) => console.error('❌ Error al agregar mesa:', err)
      });
    }
  }

  eliminarMesa(id: number) {
    if (!confirm(`¿Seguro que deseas eliminar la mesa ${id}?`)) return;

    this.mesasService.eliminarMesa(id).subscribe({
      next: () => {
        alert('Mesa eliminada ✅');
        this.cargarMesas();
      },
      error: (err) => console.error('❌ Error al eliminar mesa:', err)
    });
  }

  get mesasFiltradas() {
    if (!this.filtro.trim()) return this.mesas;
    const filtroLower = this.filtro.toLowerCase();
    return this.mesas.filter(
      m =>
        m.estado.toLowerCase().includes(filtroLower) ||
        m.mesero?.nombre?.toLowerCase().includes(filtroLower)
    );
  }
}

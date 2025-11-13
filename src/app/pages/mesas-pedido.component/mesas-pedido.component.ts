import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MesasService } from '../../services/mesas.service';

@Component({
  selector: 'app-mesas-pedido',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mesas-pedido.component.html',
  styleUrls: ['./mesas-pedido.component.css']
})
export class MesasPedidoComponent implements OnInit {
  mesas: any[] = [];
  filtro: string = '';

  constructor(
    private mesasService: MesasService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarMesas();
  }

  cargarMesas() {
    this.mesasService.obtenerMesas().subscribe({
      next: (data) => {
        this.mesas = data;
        this.cdr.detectChanges(); // forzar refresco
      },
      error: (err) => console.error('❌ Error al cargar mesas:', err)
    });
  }

  buscarMesas() {
    if (!this.filtro.trim()) {
      this.cargarMesas();
    } else {
      const filtroLower = this.filtro.toLowerCase();
      this.mesas = this.mesas.filter(
        m =>
          m.id.toString().includes(this.filtro) ||
          m.estado.toLowerCase().includes(filtroLower) ||
          m.mesero?.nombre?.toLowerCase().includes(filtroLower)
      );
    }
  }

  liberarMesa(mesa: any) {
    this.mesasService.liberarMesa(mesa.id).subscribe({
      next: () => {
        mesa.estado = 'LIBRE';
        mesa.mesero = null;
        this.cdr.detectChanges(); // refrescar tabla
      },
      error: (err) => console.error('❌ Error al liberar mesa:', err)
    });
  }

  irAPedido(mesa: any) {
    const usuario = JSON.parse(localStorage.getItem('user') || '{}');

    if (!usuario || !usuario.id) {
      alert('No hay usuario en sesión.');
      return;
    }

    // Si la mesa ya está ocupada, simplemente entrar al pedido sin volver a actualizarla
    if (mesa.estado === 'OCUPADA') {
      localStorage.setItem('pedidoMesa', JSON.stringify(mesa));
      this.router.navigate(['/pedidos'], {
        state: { mesa, usuario }
      });
      return;
    }

    // Si está libre, se actualiza normalmente
    const mesaActualizada = {
      ...mesa,
      estado: 'OCUPADA',
      mesero: {
        id: usuario.id,
        nombre: usuario.nombre
      }
    };

    this.mesasService.actualizarMesa(mesaActualizada.id, mesaActualizada).subscribe({
      next: (res) => {
        console.log('✅ Mesa actualizada correctamente:', res);
        localStorage.setItem('pedidoMesa', JSON.stringify(res));

        this.router.navigate(['/pedidos'], {
          state: { mesa: res, usuario }
        });
      },
      error: (err) => {
        console.error('❌ Error al actualizar la mesa:', err);
        alert('No se pudo actualizar la mesa');
      }
    });
  }
}

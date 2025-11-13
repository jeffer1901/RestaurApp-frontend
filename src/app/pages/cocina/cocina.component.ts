import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PedidosService } from '../../services/pedidos.service';

@Component({
  selector: 'app-cocina',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cocina.component.html',
  styleUrls: ['./cocina.component.css']
})
export class CocinaComponent implements OnInit {
  pedidos: any[] = [];
  pedidosFiltrados: any[] = [];
  filtroEstado: string = '';

  constructor(
    private pedidosService: PedidosService,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit() {
    this.cargarPedidos();
  }

  cargarPedidos() {
    this.pedidosService.obtenerPedidos().subscribe({
      next: (res) => {
        this.pedidos = res;
        this.pedidosFiltrados = [...this.pedidos]; // copia para filtrado
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar pedidos:', err)
    });
  }

  filtrarPedidos() {
    const filtro = this.filtroEstado.trim().toLowerCase();

    if (!filtro) {
      this.pedidosFiltrados = [...this.pedidos];
      return;
    }

    this.pedidosFiltrados = this.pedidos.filter(p =>
      p.estado?.toLowerCase().includes(filtro)
    );
  }

  resetFiltro() {
    this.filtroEstado = '';
    this.pedidosFiltrados = [...this.pedidos];
  }

  actualizarEstado(pedido: any, nuevoEstado: string) {
    if (!nuevoEstado) return;

    this.pedidosService.actualizarEstadoPedido(pedido.id, nuevoEstado).subscribe({
      next: () => {
        pedido.estado = nuevoEstado;
        pedido.nuevoEstado = '';
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al actualizar estado:', err)
    });
  }
}

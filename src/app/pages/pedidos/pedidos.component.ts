import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductosService } from '../../services/productos.service';
import { PedidosService } from '../../services/pedidos.service';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {
  mesa: any;
  usuario: any;
  productos: any[] = [];
  carrito: { producto: any, cantidad: number }[] = [];

  constructor(
    private router: Router,
    private productosService: ProductosService,
    private pedidosService: PedidosService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state as { mesa: any; usuario: any };

    // Obtener datos desde router state o localStorage
    this.mesa = state?.mesa || JSON.parse(localStorage.getItem('pedidoMesa') || 'null');
    this.usuario = state?.usuario || JSON.parse(localStorage.getItem('user') || 'null');

    if (!this.mesa || !this.usuario) {
      alert('No se recibió la información de la mesa o usuario.');
      this.router.navigate(['/mesasPedidos']);
      return;
    }

    this.cargarProductos();
  }

  cargarProductos() {
    this.productosService.obtenerProductos().subscribe({
      next: (res) => {
        // Agregamos cantidadSeleccionada a cada producto
        this.productos = res.map(p => ({ ...p, cantidadSeleccionada: 0 }));
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar productos:', err)
    });
  }

  guardarPedido() {
    // Validar que haya productos seleccionados
    if (this.productos.every(p => p.cantidadSeleccionada <= 0)) {
      alert('No has seleccionado productos.');
      return;
    }

    // Construir detalle de pedidos
    const detallePedidos = this.productos
      .filter(p => p.cantidadSeleccionada > 0)
      .map(p => ({
        cantidad: p.cantidadSeleccionada,
        precioUnitario: p.precio,
        precioTotal: p.precio * p.cantidadSeleccionada,
        producto: { id: p.id }
      }));

    // Construir el pedido completo incluyendo mesa y mesero
    const pedido = {
      mesa: {
        id: this.mesa.id,
        mesero: { id: this.usuario.id }  // ✅ Se envía el mesero correctamente
      },
      fechaHora: new Date().toISOString(),
      estado: 'REGISTRADO',
      total: detallePedidos.reduce((sum, dp) => sum + dp.precioTotal, 0),
      detallePedidos
    };

    // Enviar al backend
    this.pedidosService.guardarPedido(pedido).subscribe({
      next: (res) => {
        alert('Pedido guardado ✅');
        // Reiniciar cantidades
        this.productos.forEach(p => (p.cantidadSeleccionada = 0));
        // Volver a la lista de mesas
        this.router.navigate(['/mesasPedidos']);
      },
      error: (err) => {
        console.error('Error al guardar pedido:', err);
        // Manejar caso donde Angular marque 200 OK como error
        if (err.status === 200) {
          alert('Pedido guardado ✅');
          this.productos.forEach(p => (p.cantidadSeleccionada = 0));
          this.router.navigate(['/mesasPedidos']);
        } else {
          alert('No se pudo guardar el pedido. Revisa la consola.');
        }
      }
    });
  }
}

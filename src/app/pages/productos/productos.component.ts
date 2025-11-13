import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ProductosService } from '../../services/productos.service';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  productos: any[] = [];
  idBusqueda: string = '';
  filtro: string = '';
  mostrarFormulario: boolean = false;
  modoEdicion: boolean = false;

  nuevoProducto: any = {
    id: null,
    nombre: '',
    descripcion: '',
    precio: 0,
    disponible: true,
    tipo: ''
  };

  constructor(
    private productosService: ProductosService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarProductos();

    // 🔁 Recargar si vuelve a /productos
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((event) => {
        if (event.urlAfterRedirects === '/productos') {
          this.cargarProductos();
        }
      });
  }

  cargarProductos() {
    this.productosService.obtenerProductos().subscribe({
      next: (data: any[]) => {
        this.productos = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('❌ Error al cargar productos:', err)
    });
  }

  buscarPorId() {
    const id = String(this.idBusqueda ?? '').trim();
    if (!id) {
      this.cargarProductos();
      return;
    }

    this.productosService.obtenerProductoPorId(Number(id)).subscribe({
      next: (producto: any) => {
        if (producto) {
          this.productos = [producto];
        } else {
          alert('⚠️ No se encontró el producto');
          this.cargarProductos();
        }
        this.cdr.detectChanges();
      },
      error: () => {
        alert('❌ No se encontró el producto');
        this.cargarProductos();
      }
    });
  }

  abrirFormulario(editar: boolean = false, producto?: any) {
    this.mostrarFormulario = true;
    this.modoEdicion = editar;
    this.nuevoProducto = editar && producto ? { ...producto } : {
      id: null,
      nombre: '',
      descripcion: '',
      precio: 0,
      disponible: true,
      tipo: ''
    };
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
  }

  guardarProducto() {
    if (this.modoEdicion && this.nuevoProducto.id) {
      // ✏️ Editar
      this.productosService.actualizarProducto(this.nuevoProducto.id, this.nuevoProducto).subscribe({
        next: () => {
          alert('✅ Producto actualizado');
          this.cerrarFormulario();
          this.cargarProductos();
        },
        error: (err) => {
          console.error(err);
          alert('❌ Error al actualizar');
        }
      });
    } else {
      // ➕ Crear
      this.productosService.agregarProducto(this.nuevoProducto).subscribe({
        next: () => {
          alert('✅ Producto agregado');
          this.cerrarFormulario();
          this.cargarProductos();
        },
        error: (err) => {
          console.error(err);
          alert('❌ Error al agregar');
        }
      });
    }
  }

  eliminarProducto(id: number) {
    if (!confirm('¿Seguro que deseas eliminar este producto?')) return;
    this.productosService.eliminarProducto(id).subscribe({
      next: () => {
        alert('🗑️ Producto eliminado');
        this.cargarProductos();
      },
      error: (err) => console.error('❌ Error al eliminar:', err)
    });
  }

  get productosFiltrados() {
    if (!this.filtro.trim()) return this.productos;
    const filtroLower = this.filtro.toLowerCase();
    return this.productos.filter(p =>
      p.nombre?.toLowerCase().includes(filtroLower) ||
      p.descripcion?.toLowerCase().includes(filtroLower)
    );
  }
}

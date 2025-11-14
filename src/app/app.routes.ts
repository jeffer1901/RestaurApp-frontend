import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { MesasComponent } from './pages/mesas/mesas.component';
import { ProductosComponent } from './pages/productos/productos.component';
import { CocinaComponent } from './pages/cocina/cocina.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { MesasPedidoComponent } from './pages/mesas-pedido.component/mesas-pedido.component';
import { PedidosComponent } from './pages/pedidos/pedidos.component';
import { adminGuard } from './guards/admin.guard';
import { cocineroGuard } from './guards/cocinero.guard';
import { meseroGuard } from './guards/mesero.guard';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'inicio', component: InicioComponent,canActivate: [adminGuard] },
  { path: 'mesas', component: MesasComponent,canActivate: [adminGuard] },
  { path: 'productos', component: ProductosComponent,canActivate: [adminGuard] },
  { path: 'cocina', component: CocinaComponent},
  { path: 'pedidos', component: PedidosComponent},
  { path: 'usuarios', component: UsuariosComponent,canActivate: [adminGuard] },
  { path: 'mesasPedidos', component: MesasPedidoComponent},


];

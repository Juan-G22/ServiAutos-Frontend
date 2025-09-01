import { Routes } from '@angular/router';

// Dashboard
import { DashboardComponent } from './dashboard/dashboard';

// Productos
import { ListarComponent as ListarProductosComponent } from './productos/listar/listar.component';
import { CrearComponent as CrearProductoComponent } from './productos/crear/crear.component';

// Pedidos
import { Listar as ListarPedidosComponent } from './pedidos/listar/listar';
import { CrearPedidoComponent as CrearPedidoComponent } from './pedidos/crear/crear.component';

// Clientes
import { Listar as ListarClientesComponent } from './clientes/listar/listar';
import { Crear as CrearClienteComponent } from './clientes/crear/crear';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'productos', component: ListarProductosComponent },
  { path: 'productos/crear', loadComponent: () => import('./productos/crear/crear.component').then(m => m.CrearComponent) },
  { path: 'pedidos', component: ListarPedidosComponent },
  { path: 'pedidos/crear', component: CrearPedidoComponent },
  { path: 'clientes', component: ListarClientesComponent },
  { path: 'clientes/crear', component: CrearClienteComponent },
  { path: '**', redirectTo: '' } // fallback
];

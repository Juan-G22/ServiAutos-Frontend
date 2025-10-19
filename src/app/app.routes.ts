import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

// Dashboard
import { DashboardComponent } from './dashboard/dashboard.component';

// Vehículos
import { ListarVehiculosComponent as ListarVehiculosComponent } from './vehiculos/listar/listar.component';
import { CrearVehiculoComponent as CrearVehiculoComponent } from './vehiculos/crear/crear.component';
import { EditarVehiculoComponent } from './vehiculos/editar/editar.component';

// Órdenes
import { ListarOrdenesComponent } from './ordenes/listar/listar.component';
import { CrearOrdenComponent } from './ordenes/crear/crear.component';

// Clientes
import { ListarClientesComponent as ListarClientesComponent } from './clientes/listar/listar.component';
import { CrearClienteComponent as CrearClienteComponent } from './clientes/crear/crear.component';

export const routes: Routes = [
  // Rutas públicas (sin guard)
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent) },
  { path: 'recuperar', loadComponent: () => import('./auth/recuperar/recuperar.component').then(m => m.RecuperarComponent) },

  // Rutas protegidas con el guard
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },

  // Vehículos
  { path: 'vehiculos', component: ListarVehiculosComponent, canActivate: [authGuard] },
  { path: 'vehiculos/crear', component: CrearVehiculoComponent, canActivate: [authGuard] },
  { path: 'vehiculos/editar/:id', component: EditarVehiculoComponent, canActivate: [authGuard] },

  // Órdenes
  { path: 'ordenes', component: ListarOrdenesComponent, canActivate: [authGuard] },
  { path: 'ordenes/crear', component: CrearOrdenComponent, canActivate: [authGuard] },

  // Clientes
  { path: 'clientes', component: ListarClientesComponent, canActivate: [authGuard] },
  { path: 'clientes/crear', component: CrearClienteComponent, canActivate: [authGuard] },
  { path: 'clientes/editar/:id', loadComponent: () => import('./clientes/editar/editar.component').then(m => m.EditarClienteComponent), canActivate: [authGuard] },

  // Inventario
  { path: 'inventario', loadComponent: () => import('./inventario/listar/listar.component').then(m => m.ListarInventarioComponent), canActivate: [authGuard] },
  { path: 'inventario/crear', loadComponent: () => import('./inventario/crear/crear.component').then(m => m.CrearInventarioComponent), canActivate: [authGuard] },
  { path: 'inventario/editar/:id', loadComponent: () => import('./inventario/editar/editar.component').then(m => m.EditarInventarioComponent), canActivate: [authGuard] },
  { path: 'inventario/low-stock', loadComponent: () => import('./inventario/low-stock/low-stock.component').then(m => m.LowStockComponent), canActivate: [authGuard] },
  { path: 'inventario/stock', loadComponent: () => import('./inventario/stock/stock.component').then(m => m.StockComponent), canActivate: [authGuard] },
  { path: 'inventario/movimientos', loadComponent: () => import('./inventario/movimientos/movimientos.component').then(m => m.MovimientosComponent), canActivate: [authGuard] },

  // Técnicos
  { path: 'technicians', loadComponent: () => import('./technicians/listar/listar.component').then(m => m.ListarTechniciansComponent), canActivate: [authGuard] },
  { path: 'technicians/crear', loadComponent: () => import('./technicians/crear/crear.component').then(m => m.CrearTechnicianComponent), canActivate: [authGuard] },
  { path: 'technicians/editar/:id', loadComponent: () => import('./technicians/editar/editar.component').then(m => m.EditarTechnicianComponent), canActivate: [authGuard] },

  // Órdenes - rutas adicionales
  { path: 'ordenes/detalle/:id', loadComponent: () => import('./ordenes/detalle/detalle.component').then(m => m.DetalleOrdenComponent), canActivate: [authGuard] },
  { path: 'ordenes/editar/:id', loadComponent: () => import('./ordenes/editar/editar.component').then(m => m.EditarOrdenComponent), canActivate: [authGuard] },

  // fallback
  { path: '**', redirectTo: 'login' }
];

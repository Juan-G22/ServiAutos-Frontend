import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

// Dashboard
import { DashboardComponent } from './dashboard/dashboard.component';

// Vehículos
import { ListarVehiculosComponent as ListarVehiculosComponent } from './vehiculos/listar/listar.component';
import { CrearVehiculoComponent as CrearVehiculoComponent } from './vehiculos/crear/crear.component';

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

  // Órdenes
  { path: 'ordenes', component: ListarOrdenesComponent, canActivate: [authGuard] },
  { path: 'ordenes/crear', component: CrearOrdenComponent, canActivate: [authGuard] },

  // Clientes
  { path: 'clientes', component: ListarClientesComponent, canActivate: [authGuard] },
  { path: 'clientes/crear', component: CrearClienteComponent, canActivate: [authGuard] },
  { path: 'clientes/editar/:id', loadComponent: () => import('./clientes/editar/editar.component').then(m => m.EditarClienteComponent), canActivate: [authGuard] },


  // fallback
  { path: '**', redirectTo: 'login' }
];

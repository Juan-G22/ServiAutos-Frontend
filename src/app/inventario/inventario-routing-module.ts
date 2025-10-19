import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListarInventarioComponent } from './listar/listar.component';
import { CrearInventarioComponent } from './crear/crear.component';
import { EditarInventarioComponent } from './editar/editar.component';
import { LowStockComponent } from './low-stock/low-stock.component';
import { StockComponent } from './stock/stock.component';
import { MovimientosComponent } from './movimientos/movimientos.component';

const routes: Routes = [
  { path: '', component: ListarInventarioComponent },
  { path: 'crear', component: CrearInventarioComponent },
  { path: 'editar/:id', component: EditarInventarioComponent },
  { path: 'low-stock', component: LowStockComponent },
  { path: 'stock', component: StockComponent },
  { path: 'movimientos', component: MovimientosComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventarioRoutingModule { }

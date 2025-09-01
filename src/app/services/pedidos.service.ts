import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Producto } from './productos.service';

export interface Pedido {
  id: number;
  cliente: string;
  productos: Producto[];
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class PedidosService {
  private pedidos: Pedido[] = [];

  listar(): Observable<Pedido[]> {
    return of(this.pedidos);
  }

  crear(pedido: Pedido): void {
    this.pedidos.push({ ...pedido, id: this.pedidos.length + 1 });
  }
}

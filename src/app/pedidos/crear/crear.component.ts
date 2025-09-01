import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { ProductosService, Producto } from '../../services/productos.service';
import { PedidosService } from '../../services/pedidos.service';

@Component({
  selector: 'app-crear-pedido',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.scss']
})
export class CrearPedidoComponent {
  cliente = '';
  productos: Producto[] = [];
  seleccionados: Producto[] = [];

  constructor(
    private productosService: ProductosService,
    private pedidosService: PedidosService
  ) {
    this.productosService.listar().subscribe(p => this.productos = p);
  }

  get total(): number {
  return this.seleccionados.reduce((sum, p) => sum + p.precio, 0);
  }

  toggleProducto(producto: Producto) {
    if (this.seleccionados.includes(producto)) {
      this.seleccionados = this.seleccionados.filter(p => p !== producto);
    } else {
      this.seleccionados.push(producto);
    }
  }

  crearPedido() {
    const total = this.seleccionados.reduce((sum, p) => sum + p.precio, 0);
    this.pedidosService.crear({
      id: 0,
      cliente: this.cliente,
      productos: this.seleccionados,
      total
    });
    alert('Pedido creado ✅');
    this.cliente = '';
    this.seleccionados = [];
  }
}

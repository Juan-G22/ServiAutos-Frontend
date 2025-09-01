import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';       //  necesario para [(ngModel)]
import { ProductosService, Producto } from '../../services/productos.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listar-productos',
  standalone: true, // si se usa standalone (Angular 20 lo soporta)
  imports: [CommonModule, FormsModule], // 
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.scss']
})
export class ListarComponent implements OnInit {
  productos: Producto[] = [];
  search = '';

  constructor(private productosService: ProductosService, public router: Router) {}

  ngOnInit() {
    this.productosService.listar().subscribe(data => (this.productos = data));
  }

  get productosFiltrados() {
    return this.productos.filter(p =>
      p.nombre.toLowerCase().includes(this.search.toLowerCase())
    );
  }
}

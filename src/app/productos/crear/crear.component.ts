import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class CrearComponent {
  nombre = '';
  stock = 0;
  precio = 0;

  guardarProducto() {
    console.log({
      nombre: this.nombre,
      stock: this.stock,
      precio: this.precio
    });
    alert('Producto guardado (simulado).');
    // Aquí luego se llama al servicio para guardar en la base de datos
  }
}

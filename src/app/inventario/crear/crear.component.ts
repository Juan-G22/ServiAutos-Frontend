import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InventarioService, SparePart } from '../../services/inventario.service';

@Component({
  selector: 'app-crear-inventario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.scss']
})
export class CrearInventarioComponent {
  repuesto: SparePart = {
    name: '',
    detail: '',
    category: '',
    brand: '',
    partNumber: '',
    unitValue: 0,
    availableStock: 0,
    minimumStock: 0,
    location: ''
  };

  successMessage = '';
  errorMessage = '';
  loading = false;

  constructor(
    private inventarioService: InventarioService,
    private router: Router
  ) {}

  crearRepuesto(): void {
    if (!this.validarFormulario()) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.inventarioService.crearRepuesto(this.repuesto).subscribe({
      next: () => {
        this.successMessage = 'Repuesto creado con éxito ✅';
        setTimeout(() => {
          this.router.navigate(['/inventario']);
        }, 1500);
      },
      error: (error) => {
        this.errorMessage = 'Error al crear el repuesto ❌';
        console.error('Error:', error);
        this.loading = false;
      }
    });
  }

  validarFormulario(): boolean {
    if (!this.repuesto.name.trim()) {
      this.errorMessage = 'El nombre es requerido';
      return false;
    }
    if (!this.repuesto.category.trim()) {
      this.errorMessage = 'La categoría es requerida';
      return false;
    }
    if (!this.repuesto.brand.trim()) {
      this.errorMessage = 'La marca es requerida';
      return false;
    }
    if (!this.repuesto.partNumber.trim()) {
      this.errorMessage = 'El código/número de parte es requerido';
      return false;
    }
    if (this.repuesto.unitValue <= 0) {
      this.errorMessage = 'El precio unitario debe ser mayor a 0';
      return false;
    }
    if (this.repuesto.availableStock < 0) {
      this.errorMessage = 'El stock disponible no puede ser negativo';
      return false;
    }
    if (this.repuesto.minimumStock < 0) {
      this.errorMessage = 'El stock mínimo no puede ser negativo';
      return false;
    }
    return true;
  }

  cancelar(): void {
    this.router.navigate(['/inventario']);
  }
}


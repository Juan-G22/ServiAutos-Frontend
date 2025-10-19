import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { InventarioService, SparePart } from '../../services/inventario.service';

@Component({
  selector: 'app-editar-inventario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.scss']
})
export class EditarInventarioComponent implements OnInit {
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

  repuestoId: string = '';
  successMessage = '';
  errorMessage = '';
  loading = false;
  loadingData = true;

  constructor(
    private inventarioService: InventarioService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.repuestoId = this.route.snapshot.paramMap.get('id') || '';
    if (this.repuestoId) {
      this.cargarRepuesto();
    } else {
      this.errorMessage = 'ID de repuesto no válido';
      this.loadingData = false;
    }
  }

  cargarRepuesto(): void {
    this.inventarioService.obtenerRepuestoPorId(this.repuestoId).subscribe({
      next: (data) => {
        this.repuesto = data;
        this.loadingData = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar el repuesto';
        console.error('Error:', error);
        this.loadingData = false;
      }
    });
  }

  actualizarRepuesto(): void {
    if (!this.validarFormulario()) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.inventarioService.actualizarRepuesto(this.repuestoId, this.repuesto).subscribe({
      next: () => {
        this.successMessage = 'Repuesto actualizado con éxito ✅';
        setTimeout(() => {
          this.router.navigate(['/inventario']);
        }, 1500);
      },
      error: (error) => {
        this.errorMessage = 'Error al actualizar el repuesto ❌';
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


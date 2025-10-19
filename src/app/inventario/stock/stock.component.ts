import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { InventarioService, SparePart } from '../../services/inventario.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit {
  repuestos: SparePart[] = [];
  repuestoSeleccionado: SparePart | null = null;
  loading = false;
  errorMessage = '';
  successMessage = '';

  // Datos del formulario
  tipoOperacion: 'add' | 'remove' | 'adjust' = 'add';
  cantidad: number = 0;
  cantidadNueva: number = 0;
  razon: string = '';
  userId: string = '';

  constructor(
    private inventarioService: InventarioService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.cargarRepuestos();
    this.userId = this.authService.getUserId() || '';

    // Si viene un ID de repuesto por query params, preseleccionarlo
    this.route.queryParams.subscribe(params => {
      const repuestoId = params['repuestoId'];
      if (repuestoId) {
        setTimeout(() => {
          this.seleccionarRepuestoPorId(repuestoId);
        }, 500);
      }
    });
  }

  cargarRepuestos(): void {
    this.loading = true;
    this.inventarioService.listarTodosRepuestos().subscribe({
      next: (data) => {
        this.repuestos = data;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar los repuestos';
        console.error('Error:', error);
        this.loading = false;
      }
    });
  }

  seleccionarRepuesto(repuesto: SparePart): void {
    this.repuestoSeleccionado = repuesto;
    this.cantidad = 0;
    this.cantidadNueva = repuesto.availableStock;
    this.razon = '';
    this.errorMessage = '';
    this.successMessage = '';
  }

  seleccionarRepuestoPorId(id: string): void {
    const repuesto = this.repuestos.find(r => r.id === id);
    if (repuesto) {
      this.seleccionarRepuesto(repuesto);
    }
  }

  cambiarTipoOperacion(tipo: 'add' | 'remove' | 'adjust'): void {
    this.tipoOperacion = tipo;
    this.cantidad = 0;
    if (this.repuestoSeleccionado) {
      this.cantidadNueva = this.repuestoSeleccionado.availableStock;
    }
    this.errorMessage = '';
  }

  ejecutarOperacion(): void {
    if (!this.repuestoSeleccionado || !this.repuestoSeleccionado.id) {
      this.errorMessage = 'Debe seleccionar un repuesto';
      return;
    }

    if (!this.razon.trim()) {
      this.errorMessage = 'Debe proporcionar una razón para el movimiento';
      return;
    }

    if (!this.userId) {
      this.errorMessage = 'No se pudo obtener el ID del usuario';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    let operacion;

    switch (this.tipoOperacion) {
      case 'add':
        if (this.cantidad <= 0) {
          this.errorMessage = 'La cantidad debe ser mayor a 0';
          this.loading = false;
          return;
        }
        operacion = this.inventarioService.agregarStock(
          this.repuestoSeleccionado.id,
          this.cantidad,
          this.razon,
          this.userId
        );
        break;

      case 'remove':
        if (this.cantidad <= 0) {
          this.errorMessage = 'La cantidad debe ser mayor a 0';
          this.loading = false;
          return;
        }
        if (this.cantidad > this.repuestoSeleccionado.availableStock) {
          this.errorMessage = 'No hay suficiente stock disponible';
          this.loading = false;
          return;
        }
        operacion = this.inventarioService.removerStock(
          this.repuestoSeleccionado.id,
          this.cantidad,
          this.razon,
          this.userId
        );
        break;

      case 'adjust':
        if (this.cantidadNueva < 0) {
          this.errorMessage = 'La cantidad nueva no puede ser negativa';
          this.loading = false;
          return;
        }
        operacion = this.inventarioService.ajustarStock(
          this.repuestoSeleccionado.id,
          this.cantidadNueva,
          this.razon,
          this.userId
        );
        break;

      default:
        this.errorMessage = 'Tipo de operación no válido';
        this.loading = false;
        return;
    }

    operacion.subscribe({
      next: (repuestoActualizado) => {
        this.successMessage = 'Operación realizada con éxito ✅';
        this.cantidad = 0;
        this.razon = '';
        
        // Actualizar el repuesto en la lista y en el seleccionado
        const index = this.repuestos.findIndex(r => r.id === repuestoActualizado.id);
        if (index !== -1) {
          this.repuestos[index] = repuestoActualizado;
        }
        this.repuestoSeleccionado = repuestoActualizado;
        this.cantidadNueva = repuestoActualizado.availableStock;
        
        this.loading = false;
        
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        this.errorMessage = 'Error al realizar la operación ❌';
        console.error('Error:', error);
        this.loading = false;
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/inventario']);
  }

  getStockClass(repuesto: SparePart): string {
    if (repuesto.availableStock <= repuesto.minimumStock) {
      return 'text-red-600 font-bold';
    } else if (repuesto.availableStock <= repuesto.minimumStock * 1.5) {
      return 'text-yellow-600 font-semibold';
    }
    return 'text-green-600';
  }
}


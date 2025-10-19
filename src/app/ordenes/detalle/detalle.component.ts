import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { OrdenesService, Orden, AddSparePartRequest } from '../../services/ordenes.service';
import { TechniciansService, Technician } from '../../services/technicians.service';
import { InventarioService, SparePart } from '../../services/inventario.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-detalle-orden',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss']
})
export class DetalleOrdenComponent implements OnInit {
  orden: Orden | null = null;
  ordenId: string = '';
  loading = false;
  errorMessage = '';
  successMessage = '';

  // Para asignar técnico
  tecnicos: Technician[] = [];
  tecnicoSeleccionado: string = '';
  mostrarModalTecnico = false;

  // Para agregar repuestos
  repuestos: SparePart[] = [];
  repuestoSeleccionado: string = '';
  cantidadRepuesto: number = 1;
  mostrarModalRepuesto = false;

  constructor(
    private ordenesService: OrdenesService,
    private techniciansService: TechniciansService,
    private inventarioService: InventarioService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.ordenId = this.route.snapshot.paramMap.get('id') || '';
    if (this.ordenId) {
      this.cargarDatosCompletos();
    } else {
      this.errorMessage = 'ID de orden no válido';
    }
  }

  cargarDatosCompletos(): void {
    this.loading = true;
    
    // Cargar orden, técnicos y repuestos en paralelo
    forkJoin({
      orden: this.ordenesService.getById(this.ordenId),
      tecnicos: this.techniciansService.listarTecnicosActivos(),
      repuestos: this.inventarioService.listarTodosRepuestos()
    }).subscribe({
      next: (resultado) => {
        this.orden = resultado.orden;
        this.tecnicos = resultado.tecnicos;
        this.repuestos = resultado.repuestos.filter(r => r.availableStock > 0);
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar los datos de la orden';
        console.error('❌ Error:', error);
        this.loading = false;
      }
    });
  }


  cargarOrden(): void {
    // Este método ahora solo se usa después de agregar/remover repuestos
    this.cargarDatosCompletos();
  }

  cargarTecnicos(): void {
    this.techniciansService.listarTecnicosActivos().subscribe({
      next: (data) => {
        this.tecnicos = data;
      },
      error: (error) => {
        console.error('Error al cargar técnicos:', error);
      }
    });
  }

  cargarRepuestos(): void {
    this.inventarioService.listarTodosRepuestos().subscribe({
      next: (data) => {
        this.repuestos = data.filter(r => r.availableStock > 0);
      },
      error: (error) => {
        console.error('Error al cargar repuestos:', error);
      }
    });
  }

  abrirModalTecnico(): void {
    this.mostrarModalTecnico = true;
    this.tecnicoSeleccionado = this.orden?.assignedTechnicianId || '';
  }

  cerrarModalTecnico(): void {
    this.mostrarModalTecnico = false;
    this.tecnicoSeleccionado = '';
  }

  asignarTecnico(): void {
    if (!this.tecnicoSeleccionado) {
      this.errorMessage = 'Debe seleccionar un técnico';
      return;
    }

    this.loading = true;
    this.ordenesService.asignarTecnico(this.ordenId, this.tecnicoSeleccionado).subscribe({
      next: () => {
        this.successMessage = 'Técnico asignado con éxito ✅';
        this.cerrarModalTecnico();
        this.cargarOrden();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        this.errorMessage = 'Error al asignar técnico ❌';
        console.error('Error:', error);
        this.loading = false;
      }
    });
  }

  abrirModalRepuesto(): void {
    this.mostrarModalRepuesto = true;
    this.repuestoSeleccionado = '';
    this.cantidadRepuesto = 1;
  }

  cerrarModalRepuesto(): void {
    this.mostrarModalRepuesto = false;
    this.repuestoSeleccionado = '';
    this.cantidadRepuesto = 1;
  }

  agregarRepuesto(): void {
    if (!this.repuestoSeleccionado) {
      this.errorMessage = 'Debe seleccionar un repuesto';
      return;
    }

    if (this.cantidadRepuesto <= 0) {
      this.errorMessage = 'La cantidad debe ser mayor a 0';
      return;
    }

    const repuesto = this.repuestos.find(r => r.id === this.repuestoSeleccionado);
    if (repuesto && this.cantidadRepuesto > repuesto.availableStock) {
      this.errorMessage = `Stock insuficiente. Disponible: ${repuesto.availableStock}`;
      return;
    }

    const request: AddSparePartRequest = {
      sparePartId: this.repuestoSeleccionado,
      quantity: this.cantidadRepuesto
    };

    this.loading = true;
    this.ordenesService.agregarRepuesto(this.ordenId, request).subscribe({
      next: () => {
        this.successMessage = 'Repuesto agregado con éxito ✅';
        this.cerrarModalRepuesto();
        this.cargarOrden();
        this.cargarRepuestos(); // Recargar para actualizar stock disponible
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'Error al agregar repuesto ❌';
        console.error('Error:', error);
        this.loading = false;
      }
    });
  }

  removerRepuesto(idSparePart: string): void {
    if (!confirm('¿Está seguro de remover este repuesto de la orden?')) {
      return;
    }

    this.loading = true;
    this.ordenesService.removerRepuesto(this.ordenId, idSparePart).subscribe({
      next: () => {
        this.successMessage = 'Repuesto removido con éxito ✅';
        this.cargarOrden();
        this.cargarRepuestos();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        this.errorMessage = 'Error al remover repuesto ❌';
        console.error('Error:', error);
        this.loading = false;
      }
    });
  }

  finalizarOrden(): void {
    if (!confirm('¿Está seguro de finalizar esta orden? Esta acción no se puede deshacer.')) {
      return;
    }

    this.loading = true;
    this.ordenesService.finalizarOrden(this.ordenId).subscribe({
      next: () => {
        this.successMessage = 'Orden finalizada con éxito ✅';
        this.cargarOrden();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        this.errorMessage = 'Error al finalizar orden ❌';
        console.error('Error:', error);
        this.loading = false;
      }
    });
  }

  getEstadoClass(estado: string | undefined): string {
    switch (estado?.toUpperCase()) {
      case 'PENDING':
      case 'PENDIENTE':
        return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS':
      case 'EN_PROGRESO':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
      case 'FINALIZADA':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
      case 'CANCELADA':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getNombreEstado(estado: string | undefined): string {
    switch (estado?.toUpperCase()) {
      case 'PENDING':
        return 'Pendiente';
      case 'IN_PROGRESS':
        return 'En Progreso';
      case 'COMPLETED':
        return 'Finalizada';
      case 'CANCELLED':
        return 'Cancelada';
      default:
        return estado || 'Desconocido';
    }
  }

  puedeEditar(): boolean {
    const estado = this.orden?.status?.toUpperCase();
    return estado !== 'COMPLETED' && estado !== 'FINALIZADA' && estado !== 'CANCELLED' && estado !== 'CANCELADA';
  }

  getNumeroRepuestos(): number {
    return this.orden?.spareParts?.length || 0;
  }
}


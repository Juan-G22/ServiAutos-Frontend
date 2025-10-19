import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { Orden, OrdenesService } from '../../services/ordenes.service';
import { TechniciansService, Technician } from '../../services/technicians.service';
import { ClientesService } from '../../services/clientes.service';
import { VehiculosService } from '../../services/vehiculos.service';

@Component({
  selector: 'app-editar-orden',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.scss']
})
export class EditarOrdenComponent implements OnInit {

  id!: string;
  loading = true;
  errorMessage = '';
  successMessage = '';

  form: Partial<Orden> = {};
  
  // Listas para selects
  tecnicos: Technician[] = [];
  clientes: any[] = [];
  vehiculos: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ordenes: OrdenesService,
    private techniciansService: TechniciansService,
    private clientesService: ClientesService,
    private vehiculosService: VehiculosService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';

    if (!this.id) {
      this.errorMessage = 'ID de la orden no válido.';
      this.loading = false;
      return;
    }

    this.cargarDatos();
  }

  cargarDatos(): void {
    // Cargar la orden
    this.ordenes.getById(this.id).subscribe({
      next: (o) => {
        this.form = {
          clientId: o.clientId,
          vehicleId: o.vehicleId,
          diagnostic: o.diagnostic,
          assignedTechnicianId: o.assignedTechnicianId,
          laborValue: o.laborValue,
          dateService: o.dateService,
          status: o.status,
          clientName: o.clientName,
          vehiclePlate: o.vehiclePlate
        };
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'No se pudo cargar la orden';
        this.loading = false;
      }
    });

    // Cargar técnicos activos
    this.techniciansService.listarTecnicosActivos().subscribe({
      next: (data) => {
        this.tecnicos = data;
      },
      error: () => console.error('Error cargando técnicos')
    });

    // Cargar clientes
    this.clientesService.getClients().subscribe({
      next: (data) => {
        this.clientes = data;
      },
      error: () => console.error('Error cargando clientes')
    });

    // Cargar vehículos
    this.vehiculosService.getVehiculos().subscribe({
      next: (data) => {
        this.vehiculos = data;
      },
      error: () => console.error('Error cargando vehículos')
    });
  }

  guardar(): void {
    if (!this.id) return;

    if (!this.validarFormulario()) {
      return;
    }

    const payload: Orden = {
      id: this.id,
      clientId: this.form.clientId || '',
      vehicleId: this.form.vehicleId || '',
      diagnostic: this.form.diagnostic || '',
      assignedTechnicianId: this.form.assignedTechnicianId,
      laborValue: this.form.laborValue ?? 0
    };

    this.loading = true;
    this.ordenes.updateOrden(this.id, payload).subscribe({
      next: () => {
        this.successMessage = 'Orden actualizada con éxito ✅';
        setTimeout(() => {
          this.router.navigate(['/ordenes']);
        }, 1500);
      },
      error: () => {
        this.errorMessage = 'Error al actualizar la orden ❌';
        this.loading = false;
      }
    });
  }

  validarFormulario(): boolean {
    if (!this.form.clientId) {
      this.errorMessage = 'Debe seleccionar un cliente';
      return false;
    }
    if (!this.form.vehicleId) {
      this.errorMessage = 'Debe seleccionar un vehículo';
      return false;
    }
    if (!this.form.diagnostic?.trim()) {
      this.errorMessage = 'El diagnóstico es requerido';
      return false;
    }
    if (!this.form.laborValue || this.form.laborValue <= 0) {
      this.errorMessage = 'El valor de mano de obra debe ser mayor a 0';
      return false;
    }
    return true;
  }

  cancelar(): void {
    this.router.navigate(['/ordenes']);
  }
}

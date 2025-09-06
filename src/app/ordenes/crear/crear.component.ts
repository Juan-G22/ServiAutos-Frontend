// src/app/ordenes/crear/crear.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OrdenesService, Orden } from '../../services/ordenes.service';
import { ClientesService } from '../../services/clientes.service';
import { VehiculosService } from '../../services/vehiculos.service';

@Component({
  selector: 'app-crear-orden',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.scss']
})
export class CrearOrdenComponent implements OnInit {
  orden: Orden = {
  clientId: '',
  vehicleId: '',
  diagnostic: '',
  assignedTechnician: '',   
  laborValue: 0,            
  status: 'Pendiente',
  dateService: new Date().toISOString()
  };

  clientes: any[] = [];
  vehiculos: any[] = [];
  errorMessage = '';
  successMessage = '';

  constructor(
    private ordenesService: OrdenesService,
    private clientesService: ClientesService,
    private vehiculosService: VehiculosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadClientes();
    this.loadVehiculos();
  }

  loadClientes() {
    this.clientesService.getClients().subscribe({
      next: (data) => (this.clientes = data),
      error: () => (this.errorMessage = 'Error cargando clientes')
    });
  }

  loadVehiculos() {
    this.vehiculosService.getVehiculos().subscribe({
      next: (data) => (this.vehiculos = data),
      error: () => (this.errorMessage = 'Error cargando vehículos')
    });
  }

  guardarOrden() {
    this.ordenesService.createOrden(this.orden).subscribe({
      next: () => {
        this.successMessage = 'Orden creada exitosamente';
        setTimeout(() => this.router.navigate(['/ordenes']), 1500);
      },
      error: () => (this.errorMessage = 'Error al crear la orden')
    });
  }
}

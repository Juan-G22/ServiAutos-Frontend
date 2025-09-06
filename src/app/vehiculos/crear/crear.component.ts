import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { VehiculosService } from '../../services/vehiculos.service';
import { ClientesService } from '../../services/clientes.service';

@Component({
  selector: 'app-crear-vehiculo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear.component.html'
})
export class CrearVehiculoComponent implements OnInit {
  // ✅ el objeto que enlaza tu formulario
  vehiculo = {
    licencePlate: '',
    brand: '',
    model: '',
    clientId: '' // aquí se guarda el cliente seleccionado
  };

  // ✅ lista de clientes para el <select>
  clientes: any[] = [];

  // ✅ mensajes para mostrar en la vista
  successMessage = '';
  errorMessage = '';

  constructor(
    private vehiculosService: VehiculosService,
    private clientesService: ClientesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  // ✅ carga clientes al iniciar
  cargarClientes() {
    this.clientesService.getClients().subscribe({
      next: (data) => (this.clientes = data),
      error: () => (this.errorMessage = 'Error cargando clientes')
    });
  }

  // ✅ guarda vehículo
  guardarVehiculo() {
    this.vehiculosService.createVehiculo(this.vehiculo).subscribe({
      next: () => {
        this.successMessage = 'Vehículo creado exitosamente';
        setTimeout(() => {
          this.router.navigate(['/vehiculos']);
        }, 1500);
      },
      error: () => {
        this.errorMessage = 'Error al crear vehículo';
      }
    });
  }
}
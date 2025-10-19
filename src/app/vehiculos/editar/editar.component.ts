import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { VehiculosService } from '../../services/vehiculos.service';
import { ClientesService } from '../../services/clientes.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-editar-vehiculo',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './editar.component.html'
})
export class EditarVehiculoComponent implements OnInit {
  vehiculo: any = {
    licencePlate: '',
    brand: '',
    model: '',
    clientId: ''
  };
  clientes: any[] = [];
  errorMessage = '';
  successMessage = '';
  loading = true;
  vehiculoId: string = '';

  constructor(
    private route: ActivatedRoute,
    private vehiculosService: VehiculosService,
    private clientesService: ClientesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.vehiculoId = this.route.snapshot.paramMap.get('id') || '';
    
    if (this.vehiculoId) {
      this.cargarDatos();
    } else {
      this.errorMessage = 'ID de vehículo no válido';
      this.loading = false;
    }
  }

  cargarDatos() {
    forkJoin({
      vehiculo: this.vehiculosService.getVehiculoById(this.vehiculoId),
      clientes: this.clientesService.getClients()
    }).subscribe({
      next: (result) => {
        this.vehiculo = result.vehiculo;
        this.clientes = result.clientes;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Error cargando datos';
        this.loading = false;
      }
    });
  }

  actualizarVehiculo() {
    this.vehiculosService.updateVehiculo(this.vehiculoId, this.vehiculo).subscribe({
      next: () => {
        this.successMessage = 'Vehículo actualizado con éxito ✅';
        setTimeout(() => this.router.navigate(['/vehiculos']), 2000);
      },
      error: () => {
        this.errorMessage = 'Error actualizando vehículo ❌';
      }
    });
  }
}


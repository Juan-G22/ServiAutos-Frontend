import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { VehiculosService, Vehiculo } from '../../services/vehiculos.service';
import { ClientesService } from '../../services/clientes.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-listar-vehiculos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.scss']
})
export class ListarVehiculosComponent implements OnInit {
  vehiculos: Vehiculo[] = [];
  clientes: any[] = [];
  search = '';
  errorMessage = '';
  successMessage = '';

  constructor(
    private vehiculosService: VehiculosService,
    private clientesService: ClientesService,
    public router: Router
  ) {}

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    forkJoin({
      vehiculos: this.vehiculosService.getVehiculos(),
      clientes: this.clientesService.getClients()
    }).subscribe({
      next: (result) => {
        this.vehiculos = result.vehiculos;
        this.clientes = result.clientes;
      },
      error: () => {
        this.errorMessage = 'Error cargando datos';
      }
    });
  }

  get vehiculosFiltrados() {
    return this.vehiculos.filter(v =>
      v.licencePlate.toLowerCase().includes(this.search.toLowerCase()) ||
      v.brand.toLowerCase().includes(this.search.toLowerCase()) ||
      v.model.toLowerCase().includes(this.search.toLowerCase())
    );
  }

  getTotalVehiculos(): number {
    return this.vehiculos.length;
  }

  getClientName(clientId: string): string {
    const cliente = this.clientes.find(c => (c.id || c._id) === clientId);
    return cliente ? `${cliente.name} ${cliente.lastName}` : 'Cliente no encontrado';
  }

  editarVehiculo(id: string) {
    this.router.navigate(['/vehiculos/editar', id]);
  }

  eliminarVehiculo(id: string) {
    if (confirm('¿Estás seguro de eliminar este vehículo?')) {
      this.vehiculosService.deleteVehiculo(id).subscribe({
        next: () => {
          this.vehiculos = this.vehiculos.filter(v => v.id !== id);
          this.successMessage = 'Vehículo eliminado con éxito ✅';
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: () => {
          this.errorMessage = 'Error eliminando vehículo ❌';
          setTimeout(() => this.errorMessage = '', 3000);
        }
      });
    }
  }
}

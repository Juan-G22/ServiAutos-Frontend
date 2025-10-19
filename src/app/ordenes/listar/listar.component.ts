import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { OrdenesService, Orden } from '../../services/ordenes.service';
import { ClientesService } from '../../services/clientes.service';
import { VehiculosService } from '../../services/vehiculos.service';
import { TechniciansService } from '../../services/technicians.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-listar-ordenes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], 
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.scss']
})
export class ListarOrdenesComponent implements OnInit {
  ordenes: Orden[] = [];
  ordenesFiltradas: Orden[] = [];
  searchTerm: string = '';
  filtroEstado: string = '';
  loading = false;
  errorMessage = '';
  successMessage = '';

  // Para enriquecer datos
  clientes: any[] = [];
  vehiculos: any[] = [];
  tecnicos: any[] = [];

  constructor(
    public router: Router, 
    private ordenesService: OrdenesService,
    private clientesService: ClientesService,
    private vehiculosService: VehiculosService,
    private techniciansService: TechniciansService
  ) {}

  ngOnInit(): void {
    this.cargarOrdenes();
  }

  cargarOrdenes() {
    this.loading = true;

    // Cargar órdenes, clientes, vehículos y técnicos en paralelo
    forkJoin({
      ordenes: this.ordenesService.listar(),
      clientes: this.clientesService.getClients(),
      vehiculos: this.vehiculosService.getVehiculos(),
      tecnicos: this.techniciansService.listarTodosTecnicos()
    }).subscribe({
      next: (resultado) => {
        this.clientes = resultado.clientes;
        this.vehiculos = resultado.vehiculos;
        this.tecnicos = resultado.tecnicos;

        // Enriquecer las órdenes con los nombres
        this.ordenes = resultado.ordenes.map(orden => {
          const cliente = this.clientes.find(c => c.id === orden.clientId);
          const vehiculo = this.vehiculos.find(v => v.id === orden.vehicleId);
          const tecnico = this.tecnicos.find(t => t.id === orden.assignedTechnicianId);

          return {
            ...orden,
            clientName: cliente ? `${cliente.name} ${cliente.lastName || ''}`.trim() : 'N/A',
            vehiclePlate: vehiculo ? vehiculo.licencePlate : 'N/A',
            technicianName: tecnico ? tecnico.name : null
          };
        });

        this.ordenesFiltradas = this.ordenes;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando datos:', error);
        this.errorMessage = 'Error cargando órdenes';
        this.loading = false;
      }
    });
  }

  aplicarFiltros(): void {
    this.ordenesFiltradas = this.ordenes.filter(orden => {
      const matchSearch = this.searchTerm === '' || 
        (orden.diagnostic?.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (orden.clientName?.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (orden.vehiclePlate?.toLowerCase().includes(this.searchTerm.toLowerCase()));
      
      const matchEstado = this.filtroEstado === '' || 
        orden.status?.toUpperCase() === this.filtroEstado.toUpperCase();
      
      return matchSearch && matchEstado;
    });
  }

  limpiarFiltros(): void {
    this.searchTerm = '';
    this.filtroEstado = '';
    this.ordenesFiltradas = this.ordenes;
  }

  verDetalle(id: string | undefined) {
    if (!id) return;
    this.router.navigate(['/ordenes/detalle', id]);
  }

  editarOrden(id: string | undefined) {
    if (!id) return;
    this.router.navigate(['/ordenes/editar', id]);
  }

  eliminarOrden(id: string | undefined) {
    if (!id) return;
    if (confirm('¿Seguro que deseas eliminar esta orden?')) {
      this.ordenesService.eliminar(id).subscribe({
        next: () => {
          this.successMessage = 'Orden eliminada con éxito';
          this.cargarOrdenes();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: () => {
          this.errorMessage = 'Error eliminando orden';
          setTimeout(() => this.errorMessage = '', 3000);
        }
      });
    }
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

  getOrdenesPendientes(): number {
    return this.ordenesFiltradas.filter(o => o.status?.toUpperCase() === 'PENDING').length;
  }

  getOrdenesEnProgreso(): number {
    return this.ordenesFiltradas.filter(o => o.status?.toUpperCase() === 'IN_PROGRESS').length;
  }

  getOrdenesFinalizadas(): number {
    return this.ordenesFiltradas.filter(o => o.status?.toUpperCase() === 'COMPLETED').length;
  }
}
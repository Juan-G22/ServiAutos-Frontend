import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { WarrantiesService, Warranty } from '../../services/warranties.service';
import { ClientesService } from '../../services/clientes.service';

@Component({
  selector: 'app-listar-garantias',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.scss']
})
export class ListarGarantiasComponent implements OnInit {
  garantias: Warranty[] = [];
  garantiasFiltradas: Warranty[] = [];
  statusFiltro = '';
  searchTerm = '';
  errorMessage = '';
  successMessage = '';
  loading = false;

  clientesMap = new Map<string, string>();

  constructor(
    private warrantiesService: WarrantiesService,
    private clientesService: ClientesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.loading = true;
    this.warrantiesService.listarGarantias().subscribe({
      next: (data) => {
        console.log('🔍 Respuesta de garantías:', data);
        this.garantias = this.normalizarGarantias(data);
        this.garantiasFiltradas = [...this.garantias];
        this.obtenerClientes();
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Error al listar garantías:', error);
        this.errorMessage = 'Error al cargar las garantías';
        this.loading = false;
      }
    });
  }

  obtenerClientes(): void {
    this.clientesService.getClients().subscribe({
      next: (clientes) => {
        clientes.forEach(cliente => {
          const id = cliente.id || cliente._id;
          if (id) {
            this.clientesMap.set(id, `${cliente.name} ${cliente.lastName || ''}`.trim());
          }
        });
      },
      error: () => {
        console.warn('No se pudieron cargar los clientes');
      }
    });
  }

  aplicarFiltros(): void {
    this.garantiasFiltradas = this.garantias.filter(garantia => {
      const matchStatus = this.statusFiltro === '' || garantia.status?.toUpperCase() === this.statusFiltro.toUpperCase();
      const term = this.searchTerm.trim().toLowerCase();

      const matchSearch = term === '' || [
        garantia.id,
        garantia.orderId,
        garantia.status,
        garantia.description,
        garantia.observations,
        this.obtenerNombreCliente(garantia.clientId)
      ].some(value => value?.toLowerCase().includes(term));

      return matchStatus && matchSearch;
    });
  }

  limpiarFiltros(): void {
    this.statusFiltro = '';
    this.searchTerm = '';
    this.garantiasFiltradas = [...this.garantias];
  }

  obtenerNombreCliente(clientId?: string): string {
    if (!clientId) {
      return 'Cliente no asignado';
    }
    return this.clientesMap.get(clientId) || 'Cliente no encontrado';
  }

  getStatusBadge(status?: string): string {
    switch (status?.toUpperCase()) {
      case 'OPEN':
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700';
      case 'ATTENDED':
        return 'bg-blue-100 text-blue-700';
      case 'CLOSED':
        return 'bg-green-100 text-green-700';
      case 'EXPIRED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  }

  getTotalGarantias(): number {
    return this.garantias.length;
  }

  getGarantiasPorEstado(estado: string): number {
    return this.garantias.filter(g => g.status?.toUpperCase() === estado.toUpperCase()).length;
  }

  verDetalle(id?: string): void {
    if (id) {
      this.router.navigate(['/garantias/detalle', id]);
    }
  }

  editarGarantia(id?: string): void {
    if (id) {
      this.router.navigate(['/garantias/editar', id]);
    }
  }

  atenderGarantia(id?: string): void {
    if (id) {
      this.router.navigate(['/garantias/detalle', id], { queryParams: { mode: 'attend' } });
    }
  }

  cerrarGarantia(id?: string): void {
    if (id) {
      this.router.navigate(['/garantias/detalle', id], { queryParams: { mode: 'close' } });
    }
  }

  verificarGarantiasVencidas(): void {
    this.loading = true;
    this.warrantiesService.verificarGarantiasVencidas().subscribe({
      next: () => {
        this.successMessage = 'Garantías vencidas verificadas correctamente ✅';
        this.errorMessage = '';
        this.cargarDatos();
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      error: () => {
        this.errorMessage = 'Error al verificar las garantías vencidas ❌';
        this.successMessage = '';
        this.loading = false;
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    });
  }

  private normalizarGarantias(respuesta: unknown): Warranty[] {
    if (!respuesta) {
      return [];
    }

    if (Array.isArray(respuesta)) {
      return respuesta;
    }

    const posibleObjeto = respuesta as Record<string, unknown>;
    const posiblesClaves = ['data', 'content', 'items', 'result', 'results', 'garantias'];

    for (const clave of posiblesClaves) {
      const valor = posibleObjeto?.[clave];
      if (Array.isArray(valor)) {
        return valor as Warranty[];
      }
    }

    return [];
  }
}

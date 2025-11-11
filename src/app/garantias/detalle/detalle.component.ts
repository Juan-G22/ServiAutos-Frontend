import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { WarrantiesService, Warranty } from '../../services/warranties.service';
import { TechniciansService, Technician } from '../../services/technicians.service';
import { ClientesService } from '../../services/clientes.service';

@Component({
  selector: 'app-detalle-garantia',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss']
})
export class DetalleGarantiaComponent implements OnInit {
  garantia: Warranty | null = null;
  garantiaId = '';
  loading = false;
  errorMessage = '';
  successMessage = '';

  tecnicos: Technician[] = [];
  tecnicoSeleccionado = '';
  observacionesAtencion = '';
  observacionesCierre = '';

  clientesMap = new Map<string, string>();
  modo: 'view' | 'attend' | 'close' = 'view';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private warrantiesService: WarrantiesService,
    private techniciansService: TechniciansService,
    private clientesService: ClientesService
  ) {}

  ngOnInit(): void {
    this.garantiaId = this.route.snapshot.paramMap.get('id') || '';
    this.modo = (this.route.snapshot.queryParamMap.get('mode') as 'attend' | 'close' | null) || 'view';

    if (!this.garantiaId) {
      this.errorMessage = 'ID de garantía inválido';
      return;
    }

    this.cargarClientes();
    this.cargarTecnicos();
    this.cargarGarantia();
  }

  cargarClientes(): void {
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

  cargarTecnicos(): void {
    this.techniciansService.listarTecnicosActivos().subscribe({
      next: (tecnicos) => {
        this.tecnicos = tecnicos || [];
      }
    });
  }

  cargarGarantia(): void {
    this.loading = true;
    this.warrantiesService.obtenerGarantiaPorId(this.garantiaId).subscribe({
      next: (garantia) => {
        this.garantia = garantia;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Error al cargar la garantía';
        this.loading = false;
      }
    });
  }

  obtenerNombreCliente(clientId?: string): string {
    if (!clientId) {
      return 'Cliente no asignado';
    }
    return this.clientesMap.get(clientId) || 'Cliente no encontrado';
  }

  atenderGarantia(): void {
    if (!this.garantia?.id) {
      return;
    }
    if (!this.tecnicoSeleccionado) {
      this.errorMessage = 'Selecciona un técnico para atender la garantía';
      return;
    }
    if (!this.observacionesAtencion.trim()) {
      this.errorMessage = 'Ingresa observaciones para registrar la atención';
      return;
    }

    this.loading = true;
    this.warrantiesService.atenderGarantia(this.garantia.id, this.tecnicoSeleccionado, this.observacionesAtencion).subscribe({
      next: (garantia) => {
        this.successMessage = 'Garantía atendida correctamente ✅';
        this.errorMessage = '';
        this.garantia = garantia;
        this.modo = 'view';
        this.loading = false;
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      error: () => {
        this.errorMessage = 'Error al atender la garantía ❌';
        this.loading = false;
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    });
  }

  cerrarGarantia(): void {
    if (!this.garantia?.id) {
      return;
    }
    if (!this.observacionesCierre.trim()) {
      this.errorMessage = 'Ingresa observaciones para cerrar la garantía';
      return;
    }

    this.loading = true;
    this.warrantiesService.cerrarGarantia(this.garantia.id, this.observacionesCierre).subscribe({
      next: (garantia) => {
        this.successMessage = 'Garantía cerrada con éxito ✅';
        this.errorMessage = '';
        this.garantia = garantia;
        this.modo = 'view';
        this.loading = false;
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      error: () => {
        this.errorMessage = 'Error al cerrar la garantía ❌';
        this.loading = false;
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    });
  }

  cambiarModo(nuevoModo: 'view' | 'attend' | 'close'): void {
    this.modo = nuevoModo;
    if (nuevoModo === 'attend') {
      this.observacionesAtencion = '';
    }
    if (nuevoModo === 'close') {
      this.observacionesCierre = '';
    }
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

  volver(): void {
    this.router.navigate(['/garantias']);
  }

  obtenerOrdenAsociada(): string {
    if (!this.garantia) {
      return 'Sin orden asociada';
    }

    return (
      (this.garantia as any).serviceOrderId ||
      this.garantia.orderId ||
      (this.garantia as any).order ||
      'Sin orden asociada'
    );
  }

  obtenerFechaFormateada(fecha?: string): string {
    if (!fecha) {
      return 'Sin definir';
    }

    const date = new Date(fecha);
    if (Number.isNaN(date.getTime())) {
      return fecha;
    }

    return date.toLocaleString('es-CO', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  }

  obtenerFechaExpiracion(): string {
    if (!this.garantia) {
      return 'Sin definir';
    }

    const posibleFecha =
      this.garantia.expirationDate ||
      (this.garantia as any).endDate ||
      (this.garantia as any).expiration ||
      null;

    return this.obtenerFechaFormateada(posibleFecha || undefined);
  }
}

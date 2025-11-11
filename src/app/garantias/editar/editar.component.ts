import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { WarrantiesService, UpdateWarrantyRequest, Warranty } from '../../services/warranties.service';
import { TechniciansService, Technician } from '../../services/technicians.service';
import { ClientesService } from '../../services/clientes.service';

@Component({
  selector: 'app-editar-garantia',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.scss']
})
export class EditarGarantiaComponent implements OnInit {
  garantiaId = '';
  garantiaOriginal: Warranty | null = null;
  payload: UpdateWarrantyRequest = {
    status: '',
    description: '',
    observations: '',
    technicianId: ''
  };

  tecnicos: Technician[] = [];
  clientesMap = new Map<string, string>();

  errorMessage = '';
  successMessage = '';
  loading = false;

  readonly estados = ['OPEN', 'ATTENDED', 'CLOSED', 'EXPIRED'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private warrantiesService: WarrantiesService,
    private techniciansService: TechniciansService,
    private clientesService: ClientesService
  ) {}

  ngOnInit(): void {
    this.garantiaId = this.route.snapshot.paramMap.get('id') || '';
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
      }
    });
  }

  cargarTecnicos(): void {
    this.techniciansService.listarTodosTecnicos().subscribe({
      next: (tecnicos) => (this.tecnicos = tecnicos || [])
    });
  }

  cargarGarantia(): void {
    this.loading = true;
    this.warrantiesService.obtenerGarantiaPorId(this.garantiaId).subscribe({
      next: (garantia) => {
        this.garantiaOriginal = garantia;
        this.payload = {
          status: garantia.status || '',
          description: garantia.description || '',
          observations: garantia.observations || '',
          technicianId: garantia.technicianId || ''
        };
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

  actualizarGarantia(): void {
    if (!this.garantiaId) {
      return;
    }

    this.loading = true;
    this.warrantiesService.actualizarGarantia(this.garantiaId, this.payload).subscribe({
      next: () => {
        this.successMessage = 'Garantía actualizada correctamente ✅';
        this.errorMessage = '';
        this.loading = false;
        setTimeout(() => {
          this.successMessage = '';
          this.router.navigate(['/garantias']);
        }, 2000);
      },
      error: () => {
        this.errorMessage = 'Error al actualizar la garantía ❌';
        this.successMessage = '';
        this.loading = false;
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/garantias']);
  }
}

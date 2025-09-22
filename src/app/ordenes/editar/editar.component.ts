import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Orden, OrdenesService } from '../../services/ordenes.service';

@Component({
  selector: 'app-editar-orden',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar.component.html'
})
export class EditarOrdenComponent implements OnInit {

  id!: string;                                // id de la orden (obligatorio)
  mode: 'edit' | 'attend' = 'edit';           // modo de pantalla
  loading = true;                             // para tu *ngIf="loading"
  errorMessage = '';                          // para mostrar errores

  // Usamos Partial para el formulario, y al guardar construimos un Orden completo
  form: Partial<Orden> = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ordenes: OrdenesService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';

    const qMode = (this.route.snapshot.queryParamMap.get('mode') ?? '').toLowerCase();
    if (qMode === 'attend') this.mode = 'attend';

    if (!this.id) {
      this.errorMessage = 'ID de la orden no válido.';
      this.loading = false;
      return;
    }

    this.ordenes.getById(this.id).subscribe({
      next: (o) => {
        // Prellenar formulario
        this.form = {
          clientId: o.clientId,
          vehicleId: o.vehicleId,
          diagnostic: o.diagnostic,
          assignedTechnician: o.assignedTechnician,
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
  }

  guardar(): void {
    if (!this.id) return;

    // Construimos un Orden COMPLETO (evita el error de Partial<Orden> en el build)
    const payload: Orden = {
      id: this.id,
      clientId: this.form.clientId || '',
      vehicleId: this.form.vehicleId || '',
      diagnostic: this.form.diagnostic || '',
      assignedTechnician: this.form.assignedTechnician || '',
      laborValue: this.form.laborValue ?? 0,
      dateService: this.form.dateService || new Date().toISOString(),
      status: this.mode === 'attend' ? 'FINALIZED' : (this.form.status || 'PENDING'),
      // opcionales
      clientName: this.form.clientName,
      vehiclePlate: this.form.vehiclePlate
    };

    // Validaciones mínimas sólo cuando atendemos
    if (this.mode === 'attend') {
      if (!payload.assignedTechnician || payload.assignedTechnician.trim().length === 0) {
        this.errorMessage = 'Completa el técnico asignado para atender la orden.';
        return;
      }
      if (payload.laborValue == null || Number(payload.laborValue) <= 0) {
        this.errorMessage = 'Ingresa un valor de mano de obra válido.';
        return;
      }
      if (!payload.dateService) {
        payload.dateService = new Date().toISOString();
      }
    }

    this.ordenes.updateOrden(this.id, payload).subscribe({
      next: () => this.router.navigate(['/ordenes/listar']),
      error: () => (this.errorMessage = 'Error guardando cambios')
    });
  }

  cancelar(): void {
    this.router.navigate(['/ordenes/listar']);
  }
}

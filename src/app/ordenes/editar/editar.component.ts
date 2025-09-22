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
  id!: string;
  mode: 'edit' | 'attend' = 'edit';

  // Usamos Partial para no exigir todos los campos
  form: Partial<Orden> = {};
  errorMessage = '';
  loading=true;

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
      return;
    }

    this.ordenes.getById(this.id).subscribe({
      next: (o) => {
        // Rellenamos el formulario con lo que viene del back
        this.form = {
          clientId: o.clientId,
          vehicleId: o.vehicleId,
          diagnostic: o.diagnostic,
          assignedTechnician: o.assignedTechnician,
          laborValue: o.laborValue,
          dateService: o.dateService,
          status: o.status
        };
        this.loading=false;
      },
      error: () => {this.errorMessage = 'No se pudo cargar la orden';this.loading=false}
    });
  }

  guardar(): void {
    if (!this.id) return;

    const payload: Partial<Orden> = { ...this.form };

    if (this.mode === 'attend') {
      // Forzamos estado finalizado y validaciones mínimas
      payload.status = 'FINALIZED';

      if (!payload.assignedTechnician || payload.assignedTechnician.trim().length === 0) {
        this.errorMessage = 'Completa el técnico asignado para atender la orden.';
        return;
      }
      if (payload.laborValue == null || Number(payload.laborValue) <= 0) {
        this.errorMessage = 'Ingresa un valor de mano de obra válido.';
        return;
      }
      // Fecha de atención (si quieres actualizarla al momento)
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

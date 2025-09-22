import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { OrdenesService, Orden } from '../../services/ordenes.service';

@Component({
  selector: 'app-listar-ordenes',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './listar.component.html'
})
export class ListarOrdenesComponent implements OnInit {
  ordenes: Orden[] = [];
  search: string = '';
  errorMessage = '';

  constructor(
    public router: Router, 
    private ordenesService: OrdenesService
  ) {}

  ngOnInit(): void {
    this.loadOrdenes();
  }

  loadOrdenes() {
    this.ordenesService.listar().subscribe({
      next: (data: Orden[]) => (this.ordenes = data),
      error: () => (this.errorMessage = 'Error cargando órdenes')
    });
  }

  get ordenesFiltradas(): Orden[] {
    return this.ordenes.filter(o =>
      (o.diagnostic ?? '').toLowerCase().includes(this.search.toLowerCase())
    );
  }

  editarOrden(id: string | undefined) {
    if (!id) return;
    this.router.navigate(['/ordenes/editar', id]); // modo normal
  }

  atenderOrden(id: string | undefined) {
    if (!id) return;
    this.router.navigate(
      ['/ordenes/editar', id],
      { queryParams: { mode: 'attend' } }   // 👈 modo atender
    );
  }


  eliminarOrden(id: string | undefined) {
    if (!id) return;
    if (confirm('¿Seguro que deseas eliminar esta orden?')) {
      this.ordenesService.eliminar(id).subscribe({
        next: () => (this.ordenes = this.ordenes.filter(o => o.id !== id)),
        error: () => (this.errorMessage = 'Error eliminando orden')
      });
    }
  }
}
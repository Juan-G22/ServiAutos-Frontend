import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { InventarioService, SparePart } from '../../services/inventario.service';

@Component({
  selector: 'app-low-stock',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './low-stock.component.html',
  styleUrls: ['./low-stock.component.scss']
})
export class LowStockComponent implements OnInit {
  repuestosStockBajo: SparePart[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private inventarioService: InventarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarRepuestosStockBajo();
  }

  cargarRepuestosStockBajo(): void {
    this.loading = true;
    this.errorMessage = '';
    
    this.inventarioService.obtenerStockBajo().subscribe({
      next: (data) => {
        this.repuestosStockBajo = data;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar los repuestos con stock bajo';
        console.error('Error:', error);
        this.loading = false;
      }
    });
  }

  verDetalle(id: string | undefined): void {
    if (id) {
      this.router.navigate(['/inventario/editar', id]);
    }
  }

  irAStock(id: string | undefined): void {
    if (id) {
      this.router.navigate(['/inventario/stock'], { 
        queryParams: { repuestoId: id } 
      });
    }
  }

  getUrgenciaClass(repuesto: SparePart): string {
    const porcentaje = (repuesto.availableStock / repuesto.minimumStock) * 100;
    if (porcentaje <= 50) {
      return 'bg-red-100 border-red-500';
    } else if (porcentaje <= 100) {
      return 'bg-orange-100 border-orange-500';
    }
    return 'bg-yellow-100 border-yellow-500';
  }

  getUrgenciaIcono(repuesto: SparePart): string {
    const porcentaje = (repuesto.availableStock / repuesto.minimumStock) * 100;
    if (porcentaje <= 50) {
      return '🚨';
    } else if (porcentaje <= 100) {
      return '⚠️';
    }
    return '⚡';
  }

  getCantidadSugerida(repuesto: SparePart): number {
    // Sugerir comprar el doble del mínimo menos el disponible
    return Math.max(0, (repuesto.minimumStock * 2) - repuesto.availableStock);
  }

  getTotalUnidadesComprar(): number {
    return this.repuestosStockBajo.reduce((sum, r) => sum + this.getCantidadSugerida(r), 0);
  }

  getInversionEstimada(): number {
    return this.repuestosStockBajo.reduce((sum, r) => sum + (this.getCantidadSugerida(r) * r.unitValue), 0);
  }
}


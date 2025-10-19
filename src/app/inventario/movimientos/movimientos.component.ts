import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InventarioService, SparePart, StockMovement } from '../../services/inventario.service';

@Component({
  selector: 'app-movimientos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './movimientos.component.html',
  styleUrls: ['./movimientos.component.scss']
})
export class MovimientosComponent implements OnInit {
  movimientos: StockMovement[] = [];
  movimientosFiltrados: StockMovement[] = [];
  repuestos: SparePart[] = [];
  loading = false;
  errorMessage = '';

  // Filtros
  repuestoFiltro = '';
  tipoFiltro = '';

  constructor(private inventarioService: InventarioService) {}

  ngOnInit(): void {
    this.cargarMovimientos();
    this.cargarRepuestos();
  }

  cargarMovimientos(): void {
    this.loading = true;
    this.errorMessage = '';
    
    this.inventarioService.obtenerTodosMovimientos().subscribe({
      next: (data) => {
        this.movimientos = data.sort((a, b) => {
          return new Date(b.movementDate).getTime() - new Date(a.movementDate).getTime();
        });
        this.movimientosFiltrados = this.movimientos;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar los movimientos';
        console.error('Error:', error);
        this.loading = false;
      }
    });
  }

  cargarRepuestos(): void {
    this.inventarioService.listarTodosRepuestos().subscribe({
      next: (data) => {
        this.repuestos = data;
      },
      error: (error) => {
        console.error('Error al cargar repuestos:', error);
      }
    });
  }

  aplicarFiltros(): void {
    this.movimientosFiltrados = this.movimientos.filter(mov => {
      const matchRepuesto = this.repuestoFiltro === '' || 
        mov.sparePartId === this.repuestoFiltro;
      
      const matchTipo = this.tipoFiltro === '' || 
        mov.movementType === this.tipoFiltro;
      
      return matchRepuesto && matchTipo;
    });
  }

  limpiarFiltros(): void {
    this.repuestoFiltro = '';
    this.tipoFiltro = '';
    this.movimientosFiltrados = this.movimientos;
  }

  getTipoClass(tipo: string): string {
    switch (tipo) {
      case 'ADD':
        return 'bg-green-100 text-green-800';
      case 'REMOVE':
        return 'bg-red-100 text-red-800';
      case 'ADJUST':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getTipoIcon(tipo: string): string {
    switch (tipo) {
      case 'ADD':
        return '➕';
      case 'REMOVE':
        return '➖';
      case 'ADJUST':
        return '🔧';
      default:
        return '📦';
    }
  }

  getTipoNombre(tipo: string): string {
    switch (tipo) {
      case 'ADD':
        return 'Agregar';
      case 'REMOVE':
        return 'Remover';
      case 'ADJUST':
        return 'Ajustar';
      default:
        return tipo;
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Método para exponer Math.abs en el template
  abs(value: number): number {
    return Math.abs(value);
  }

  getMovimientosAdd(): number {
    return this.movimientosFiltrados.filter(m => m.movementType === 'ADD').length;
  }

  getMovimientosRemove(): number {
    return this.movimientosFiltrados.filter(m => m.movementType === 'REMOVE').length;
  }

  getMovimientosAdjust(): number {
    return this.movimientosFiltrados.filter(m => m.movementType === 'ADJUST').length;
  }
}


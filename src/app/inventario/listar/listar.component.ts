import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InventarioService, SparePart } from '../../services/inventario.service';

@Component({
  selector: 'app-listar-inventario',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.scss']
})
export class ListarInventarioComponent implements OnInit {
  repuestos: SparePart[] = [];
  repuestosFiltrados: SparePart[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';
  
  // Filtros
  searchTerm = '';
  categoriaFiltro = '';
  marcaFiltro = '';
  
  // Listas para filtros
  categorias: string[] = [];
  marcas: string[] = [];

  constructor(
    private inventarioService: InventarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarRepuestos();
  }

  cargarRepuestos(): void {
    this.loading = true;
    this.errorMessage = '';
    
    this.inventarioService.listarTodosRepuestos().subscribe({
      next: (data) => {
        this.repuestos = data;
        this.repuestosFiltrados = data;
        this.extraerFiltros();
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar los repuestos';
        console.error('Error:', error);
        this.loading = false;
      }
    });
  }

  extraerFiltros(): void {
    const categoriasSet = new Set(this.repuestos.map(r => r.category));
    const marcasSet = new Set(this.repuestos.map(r => r.brand));
    this.categorias = Array.from(categoriasSet).sort();
    this.marcas = Array.from(marcasSet).sort();
  }

  aplicarFiltros(): void {
    this.repuestosFiltrados = this.repuestos.filter(repuesto => {
      const matchSearch = this.searchTerm === '' || 
        repuesto.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        repuesto.partNumber.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchCategoria = this.categoriaFiltro === '' || 
        repuesto.category === this.categoriaFiltro;
      
      const matchMarca = this.marcaFiltro === '' || 
        repuesto.brand === this.marcaFiltro;
      
      return matchSearch && matchCategoria && matchMarca;
    });
  }

  limpiarFiltros(): void {
    this.searchTerm = '';
    this.categoriaFiltro = '';
    this.marcaFiltro = '';
    this.repuestosFiltrados = this.repuestos;
  }

  verDetalle(id: string | undefined): void {
    if (id) {
      this.router.navigate(['/inventario/editar', id]);
    }
  }

  eliminarRepuesto(id: string | undefined): void {
    if (!id) return;
    
    if (confirm('¿Está seguro de eliminar este repuesto?')) {
      this.inventarioService.eliminarRepuesto(id).subscribe({
        next: () => {
          this.successMessage = 'Repuesto eliminado con éxito';
          this.cargarRepuestos();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (error) => {
          this.errorMessage = 'Error al eliminar el repuesto';
          console.error('Error:', error);
          setTimeout(() => this.errorMessage = '', 3000);
        }
      });
    }
  }

  getStockClass(repuesto: SparePart): string {
    if (repuesto.availableStock <= repuesto.minimumStock) {
      return 'text-red-600 font-bold';
    } else if (repuesto.availableStock <= repuesto.minimumStock * 1.5) {
      return 'text-yellow-600 font-semibold';
    }
    return 'text-green-600';
  }

  getStockIcon(repuesto: SparePart): string {
    if (repuesto.availableStock <= repuesto.minimumStock) {
      return '⚠️';
    } else if (repuesto.availableStock <= repuesto.minimumStock * 1.5) {
      return '⚡';
    }
    return '✅';
  }

  getTotalStock(): number {
    return this.repuestosFiltrados.reduce((sum, r) => sum + r.availableStock, 0);
  }

  getValorTotalInventario(): number {
    return this.repuestosFiltrados.reduce((sum, r) => sum + (r.availableStock * r.unitValue), 0);
  }
}


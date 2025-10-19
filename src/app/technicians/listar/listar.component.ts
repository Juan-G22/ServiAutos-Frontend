import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TechniciansService, Technician } from '../../services/technicians.service';

@Component({
  selector: 'app-listar-technicians',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.scss']
})
export class ListarTechniciansComponent implements OnInit {
  tecnicos: Technician[] = [];
  tecnicosFiltrados: Technician[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';
  
  // Filtros
  searchTerm = '';
  filtroEstado: 'all' | 'active' | 'inactive' = 'all';
  especializacionFiltro = '';
  
  // Lista de especializaciones
  especializaciones: string[] = [];

  constructor(
    private techniciansService: TechniciansService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarTecnicos();
  }

  cargarTecnicos(): void {
    this.loading = true;
    this.errorMessage = '';
    
    this.techniciansService.listarTodosTecnicos().subscribe({
      next: (data) => {
        this.tecnicos = data;
        this.tecnicosFiltrados = data;
        this.extraerEspecializaciones();
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar los técnicos';
        console.error('Error:', error);
        this.loading = false;
      }
    });
  }

  extraerEspecializaciones(): void {
    const especializacionesSet = new Set(this.tecnicos.map(t => t.specialization));
    this.especializaciones = Array.from(especializacionesSet).sort();
  }

  aplicarFiltros(): void {
    this.tecnicosFiltrados = this.tecnicos.filter(tecnico => {
      const matchSearch = this.searchTerm === '' || 
        tecnico.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        tecnico.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchEstado = this.filtroEstado === 'all' || 
        (this.filtroEstado === 'active' && tecnico.isActive) ||
        (this.filtroEstado === 'inactive' && !tecnico.isActive);
      
      const matchEspecializacion = this.especializacionFiltro === '' || 
        tecnico.specialization === this.especializacionFiltro;
      
      return matchSearch && matchEstado && matchEspecializacion;
    });
  }

  limpiarFiltros(): void {
    this.searchTerm = '';
    this.filtroEstado = 'all';
    this.especializacionFiltro = '';
    this.tecnicosFiltrados = this.tecnicos;
  }

  verDetalle(id: string | undefined): void {
    if (id) {
      this.router.navigate(['/technicians/editar', id]);
    }
  }

  cambiarEstadoTecnico(tecnico: Technician): void {
    if (!tecnico.id) return;
    
    const accion = tecnico.isActive ? 'desactivar' : 'activar';
    if (!confirm(`¿Está seguro de ${accion} este técnico?`)) {
      return;
    }

    const operacion = tecnico.isActive 
      ? this.techniciansService.desactivarTecnico(tecnico.id)
      : this.techniciansService.activarTecnico(tecnico.id);

    operacion.subscribe({
      next: () => {
        this.successMessage = `Técnico ${accion === 'activar' ? 'activado' : 'desactivado'} con éxito`;
        this.cargarTecnicos();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        this.errorMessage = `Error al ${accion} el técnico`;
        console.error('Error:', error);
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }

  eliminarTecnico(id: string | undefined): void {
    if (!id) return;
    
    if (confirm('¿Está seguro de eliminar este técnico? Esta acción no se puede deshacer.')) {
      this.techniciansService.eliminarTecnico(id).subscribe({
        next: () => {
          this.successMessage = 'Técnico eliminado con éxito';
          this.cargarTecnicos();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (error) => {
          this.errorMessage = 'Error al eliminar el técnico';
          console.error('Error:', error);
          setTimeout(() => this.errorMessage = '', 3000);
        }
      });
    }
  }

  getEstadoClass(isActive: boolean | undefined): string {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  }

  getEstadoTexto(isActive: boolean | undefined): string {
    return isActive ? 'Activo' : 'Inactivo';
  }

  getTecnicosActivos(): number {
    return this.tecnicosFiltrados.filter(t => t.isActive).length;
  }

  getTecnicosInactivos(): number {
    return this.tecnicosFiltrados.filter(t => !t.isActive).length;
  }
}


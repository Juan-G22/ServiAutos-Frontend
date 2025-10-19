import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ClientesService } from '../../services/clientes.service';

@Component({
  selector: 'app-listar-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './listar.component.html'
})
export class ListarClientesComponent implements OnInit {
  clientes: any[] = [];
  searchTerm = '';
  errorMessage = '';
  successMessage = '';

  constructor(
    private clientesService: ClientesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadClientes();
  }

  loadClientes() {
    this.clientesService.getClients().subscribe({
      next: (data) => {
        this.clientes = data;
      },
      error: () => {
        this.errorMessage = 'Error cargando clientes';
      }
    });
  }

  get clientesFiltrados() {
    if (!this.searchTerm) {
      return this.clientes;
    }
    
    const term = this.searchTerm.toLowerCase();
    return this.clientes.filter(cliente =>
      cliente.name?.toLowerCase().includes(term) ||
      cliente.lastName?.toLowerCase().includes(term) ||
      cliente.document?.toLowerCase().includes(term) ||
      cliente.email?.toLowerCase().includes(term) ||
      cliente.phone?.toLowerCase().includes(term)
    );
  }

  getTotalClientes(): number {
    return this.clientes.length;
  }

  editarCliente(id: string) {
    this.router.navigate(['/clientes/editar', id]);
  }

  eliminarCliente(id: string) {
    if (confirm('¿Estás seguro de eliminar este cliente?')) {
      this.clientesService.deleteClient(id).subscribe({
        next: () => {
          this.clientes = this.clientes.filter(c => (c.id || c._id) !== id);
          this.successMessage = 'Cliente eliminado con éxito ✅';
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: () => {
          this.errorMessage = 'Error eliminando cliente ❌';
          setTimeout(() => this.errorMessage = '', 3000);
        }
      });
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ClientesService } from '../../services/clientes.service';

@Component({
  selector: 'app-listar-clientes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listar.component.html'
})
export class ListarClientesComponent implements OnInit {
  clientes: any[] = [];
  errorMessage = '';

  constructor(
    private clientesService: ClientesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadClientes();
  }

  loadClientes() {
    this.clientesService.getClients().subscribe({
      next: (data) => (this.clientes = data),
      error: () => (this.errorMessage = 'Error cargando clientes')
    });
  }

  editarCliente(id: string) {
    this.router.navigate(['/clientes/editar', id]); // 👈 aquí navega a la ruta de editar
  }

  eliminarCliente(id: string) {
    if (confirm('¿Seguro que deseas eliminar este cliente?')) {
      this.clientesService.deleteClient(id).subscribe({
        next: () => {
          this.clientes = this.clientes.filter(c => c.id !== id);
        },
        error: () => {
          this.errorMessage = 'Error eliminando cliente';
        }
      });
    }
  }
}

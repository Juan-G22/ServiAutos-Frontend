import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientesService } from '../../services/clientes.service';

@Component({
  selector: 'app-editar-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar.component.html'
})
export class EditarClienteComponent implements OnInit {
  cliente: any = {
    name: '',
    lastName: '',
    document: '',
    email: '',
    address: '',
    phone: ''
  };
  errorMessage = '';
  successMessage = '';
  id: string = '';

  constructor(
    private route: ActivatedRoute,
    private clientesService: ClientesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // obtener ID de la URL
    this.id = this.route.snapshot.paramMap.get('id') || '';

    // cargar cliente
    if (this.id) {
      this.clientesService.getClientById(this.id).subscribe({
        next: (data) => (this.cliente = data),
        error: () => (this.errorMessage = 'Error cargando cliente')
      });
    }
  }

  updateClient() {
    this.clientesService.updateClient(this.id, this.cliente).subscribe({
      next: () => {
        this.successMessage = 'Cliente actualizado con éxito';
        setTimeout(() => this.router.navigate(['/clientes']), 2000);
      },
      error: () => (this.errorMessage = 'Error actualizando cliente')
    });
  }
}

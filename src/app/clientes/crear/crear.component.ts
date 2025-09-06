import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ClientesService } from '../../services/clientes.service';

@Component({
  selector: 'app-crear-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear.component.html'
})
export class CrearClienteComponent {
  name = '';
  lastName = '';
  document = '';
  email = '';
  address = '';
  phone = '';

  successMessage = '';
  errorMessage = '';

  constructor(private clientesService: ClientesService, private router: Router) {}

  crearCliente() {
    const cliente = {
      name: this.name,
      lastName: this.lastName,
      document: this.document,
      email: this.email,
      address: this.address,
      phone: this.phone
    };

    this.clientesService.createClient(cliente).subscribe({
      next: () => {
        this.successMessage = 'Cliente creado con éxito ✅';
        this.errorMessage = '';
        setTimeout(() => this.router.navigate(['/clientes']), 1500);
      },
      error: () => {
        this.errorMessage = 'Error al crear el cliente ❌';
        this.successMessage = '';
      }
    });
  }
}

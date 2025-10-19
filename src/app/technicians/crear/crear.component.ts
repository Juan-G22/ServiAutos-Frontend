import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TechniciansService, Technician } from '../../services/technicians.service';

@Component({
  selector: 'app-crear-technician',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.scss']
})
export class CrearTechnicianComponent {
  tecnico: Technician = {
    name: '',
    email: '',
    phone: '',
    specialization: '',
    isActive: true
  };

  successMessage = '';
  errorMessage = '';
  loading = false;

  constructor(
    private techniciansService: TechniciansService,
    private router: Router
  ) {}

  crearTecnico(): void {
    if (!this.validarFormulario()) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.techniciansService.crearTecnico(this.tecnico).subscribe({
      next: () => {
        this.successMessage = 'Técnico creado con éxito ✅';
        setTimeout(() => {
          this.router.navigate(['/technicians']);
        }, 1500);
      },
      error: (error) => {
        this.errorMessage = 'Error al crear el técnico ❌';
        console.error('Error:', error);
        this.loading = false;
      }
    });
  }

  validarFormulario(): boolean {
    if (!this.tecnico.name.trim()) {
      this.errorMessage = 'El nombre es requerido';
      return false;
    }
    if (!this.tecnico.email.trim()) {
      this.errorMessage = 'El email es requerido';
      return false;
    }
    if (!this.isValidEmail(this.tecnico.email)) {
      this.errorMessage = 'El email no es válido';
      return false;
    }
    if (!this.tecnico.phone.trim()) {
      this.errorMessage = 'El teléfono es requerido';
      return false;
    }
    if (!this.tecnico.specialization.trim()) {
      this.errorMessage = 'La especialización es requerida';
      return false;
    }
    return true;
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  cancelar(): void {
    this.router.navigate(['/technicians']);
  }
}


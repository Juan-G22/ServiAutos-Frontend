import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TechniciansService, Technician } from '../../services/technicians.service';

@Component({
  selector: 'app-editar-technician',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.scss']
})
export class EditarTechnicianComponent implements OnInit {
  tecnico: Technician = {
    name: '',
    email: '',
    phone: '',
    specialization: '',
    isActive: true
  };

  tecnicoId: string = '';
  successMessage = '';
  errorMessage = '';
  loading = false;
  loadingData = true;

  constructor(
    private techniciansService: TechniciansService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.tecnicoId = this.route.snapshot.paramMap.get('id') || '';
    if (this.tecnicoId) {
      this.cargarTecnico();
    } else {
      this.errorMessage = 'ID de técnico no válido';
      this.loadingData = false;
    }
  }

  cargarTecnico(): void {
    this.techniciansService.obtenerTecnicoPorId(this.tecnicoId).subscribe({
      next: (data) => {
        this.tecnico = data;
        this.loadingData = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar el técnico';
        console.error('Error:', error);
        this.loadingData = false;
      }
    });
  }

  actualizarTecnico(): void {
    if (!this.validarFormulario()) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.techniciansService.actualizarTecnico(this.tecnicoId, this.tecnico).subscribe({
      next: () => {
        this.successMessage = 'Técnico actualizado con éxito ✅';
        setTimeout(() => {
          this.router.navigate(['/technicians']);
        }, 1500);
      },
      error: (error) => {
        this.errorMessage = 'Error al actualizar el técnico ❌';
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


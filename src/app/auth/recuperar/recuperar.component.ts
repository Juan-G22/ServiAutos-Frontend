// src/app/auth/recuperar/recuperar.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recuperar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recuperar.component.html',
  styleUrls: ['./recuperar.component.scss']
})
export class RecuperarComponent {
  email: string = '';
  code: string = '';
  newPassword: string = '';
  step: number = 1; // 1 = pedir código, 2 = ingresar código y nueva contraseña
  message: string = '';
  error: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  // Paso 1: solicitar código
  solicitarCodigo() {
    if (!this.email) {
      this.error = 'Debes ingresar un correo válido';
      return;
    }

    this.authService.forgotPassword(this.email).subscribe({
      next: (res) => {
        this.message = res.message || 'Código enviado a tu correo';
        this.error = '';
        this.step = 2;
      },
      error: (err) => {
        this.error = err.error?.message || 'Error solicitando código';
        this.message = '';
      }
    });
  }

  // Paso 2: resetear contraseña
  resetearPassword() {
    const payload = {
      email: this.email,
      code: this.code,
      newPassword: this.newPassword
    };

    this.authService.resetPassword(payload).subscribe({
      next: (res) => {
        this.message = res.message || 'Contraseña actualizada con éxito';
        this.error = '';
        // ⏳ redirigir al login después de 2 segundos
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al resetear contraseña';
        this.message = '';
      }
    });
  }

  // Volver al login
  volverAlLogin() {
    this.router.navigate(['/login']);
  }
}


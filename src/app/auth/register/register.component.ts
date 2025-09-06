// src/app/auth/register/register.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  // Datos de registro
  name: string = '';
  lastName: string = '';
  phone: string = '';
  address: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  // Verificación
  verificationCode: string = '';
  codeSent: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  // Paso 1: Solicitar registro
    requestSignup() {
      if (this.password !== this.confirmPassword) {
        this.errorMessage = 'Las contraseñas no coinciden';
        return;
      }

      const user = {
        name: this.name,
        lastName: this.lastName,
        phone: this.phone,
        address: this.address,
        email: this.email,
        password: this.password,
        //Formato 'yyyy-MM-ddTHH:mm:ss'
        registerDate: new Date().toISOString().slice(0, 19)
      };

      this.authService.signupRequest(user).subscribe({
        next: (res) => {
          if (!res.error) {
            this.codeSent = true;
            this.successMessage = 'Código enviado al correo. Por favor verifícalo.';
            this.errorMessage = '';
          } else {
            this.errorMessage = res.message;
          }
        },
        error: () => {
          this.errorMessage = 'Error solicitando el registro';
        }
      });
    }


  // Paso 2: Verificar código
  verifySignup() {
    this.authService.signupVerify(this.email, this.verificationCode).subscribe({
      next: (res) => {
        if (!res.error) {
          this.successMessage = 'Usuario creado exitosamente. Ahora puedes iniciar sesión.';
          this.errorMessage = '';
          setTimeout(() => this.router.navigate(['/login']), 2000);
        } else {
          this.errorMessage = res.message;
        }
      },
      error: () => {
        this.errorMessage = 'Código inválido o expirado';
      }
    });
  }


  volverAlLogin() {
    this.router.navigate(['/login']);
  }
}

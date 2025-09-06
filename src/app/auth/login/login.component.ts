// src/app/auth/login/login.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToRecuperar() {
    this.router.navigate(['/recuperar']);
  }

  login() {
    const credentials = { email: this.email, password: this.password };

    this.authService.login(credentials).subscribe({
      next: (res) => {
        if (!res.error) {
          // Guardar el token
          this.authService.setToken(res.data.token);

          // Guardar email y un "nombre" básico
          localStorage.setItem('userEmail', this.email);
          localStorage.setItem('userName', this.email.split('@')[0]);

          // Redirigir al dashboard
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = res.message;
        }
      },
      error: () => {
        this.errorMessage = 'Credenciales inválidas o error en el servidor';
      }
    });
  }
}

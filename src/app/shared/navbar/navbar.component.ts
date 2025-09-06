import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  userName: string = 'Usuario';

  constructor(private router: Router) {}

  ngOnInit(): void {
    //Se recupera nombre guardado en localStorage
    this.userName = localStorage.getItem('userName') || 'Usuario';
  }

  tokenExiste(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    // Limpiar datos de sesión
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');

    console.log('👋 Sesión cerrada');
    this.router.navigate(['/login']);
  }
}


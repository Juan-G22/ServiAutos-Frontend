import { Component, signal, computed } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.scss']
})
export class App {
  protected readonly title = signal('frontend-todotech');

  // Guarda la URL actual
  currentUrl = signal('');

  // Listado de rutas en las que NO queremos mostrar el navbar
  rutasSinNavbar = ['/login', '/register', '/recuperar-password', '/recuperar'];

  // Devuelve true si la URL actual está en la lista de rutas públicas
  esRutaSinNavbar = computed(() => this.rutasSinNavbar.some(r => this.currentUrl().startsWith(r)));

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.currentUrl.set(this.router.url);
    });
  }
}


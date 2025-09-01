import { Component } from '@angular/core';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  standalone: true,
  imports: [CommonModule]   
})
export class DashboardComponent {}

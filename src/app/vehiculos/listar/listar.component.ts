import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehiculosService, Vehiculo } from '../../services/vehiculos.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listar-vehiculos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.scss']
})
export class ListarVehiculosComponent implements OnInit {
  vehiculos: Vehiculo[] = [];
  search = '';

  constructor(private vehiculosService: VehiculosService, public router: Router) {}

  ngOnInit() {
    this.vehiculosService.getVehiculos().subscribe(data => (this.vehiculos = data));
  }

  get vehiculosFiltrados() {
    return this.vehiculos.filter(v =>
      v.licencePlate.toLowerCase().includes(this.search.toLowerCase()) ||
      v.brand.toLowerCase().includes(this.search.toLowerCase()) ||
      v.model.toLowerCase().includes(this.search.toLowerCase())
    );
  }

  editarVehiculo(id: string) {
    this.router.navigate(['/vehiculos/editar', id]);
  }

  eliminarVehiculo(id: string) {
    if (confirm('¿Seguro que deseas eliminar este vehículo?')) {
      this.vehiculosService.deleteVehiculo(id).subscribe(() => {
        this.vehiculos = this.vehiculos.filter(v => v.id !== id);
      });
    }
  }
}

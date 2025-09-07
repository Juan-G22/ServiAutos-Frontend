
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Orden {
  id?: string;
  clientId: string;
  vehicleId: string;
  diagnostic: string;
  assignedTechnician: string;
  laborValue: number;
  dateService: string;
  status: string;

  // Campos auxiliares para mostrar
  clientName?: string;
  vehiclePlate?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrdenesService {
  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Orden[]> {
    return this.http.get<Orden[]>(this.apiUrl);
  }

  getById(id: string): Observable<Orden> {
    return this.http.get<Orden>(`${this.apiUrl}/${id}`);
  }

  createOrden(orden: Orden): Observable<Orden> {
    return this.http.post<Orden>(this.apiUrl, orden);
  }

  updateOrden(id: string, orden: Orden): Observable<Orden> {
    return this.http.put<Orden>(`${this.apiUrl}/${id}`, orden);
  }

  eliminar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

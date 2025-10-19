import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Technician {
  id?: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  isActive?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TechniciansService {
  private apiUrl = `${environment.apiUrl}/technicians`;

  constructor(private http: HttpClient) {}

  // ===== Gestión de Técnicos =====

  crearTecnico(technician: Technician): Observable<Technician> {
    return this.http.post<Technician>(this.apiUrl, technician);
  }

  obtenerTecnicoPorId(id: string): Observable<Technician> {
    return this.http.get<Technician>(`${this.apiUrl}/${id}`);
  }

  listarTodosTecnicos(): Observable<Technician[]> {
    return this.http.get<Technician[]>(this.apiUrl);
  }

  listarTecnicosActivos(): Observable<Technician[]> {
    return this.http.get<Technician[]>(`${this.apiUrl}/active`);
  }

  buscarPorEspecializacion(specialization: string): Observable<Technician[]> {
    return this.http.get<Technician[]>(`${this.apiUrl}/specialization/${specialization}`);
  }

  actualizarTecnico(id: string, technician: Technician): Observable<Technician> {
    return this.http.put<Technician>(`${this.apiUrl}/${id}`, technician);
  }

  activarTecnico(id: string): Observable<Technician> {
    return this.http.put<Technician>(`${this.apiUrl}/${id}/activate`, null);
  }

  desactivarTecnico(id: string): Observable<Technician> {
    return this.http.put<Technician>(`${this.apiUrl}/${id}/deactivate`, null);
  }

  eliminarTecnico(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}


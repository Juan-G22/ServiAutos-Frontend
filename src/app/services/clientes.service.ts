// src/app/services/clientes.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  private apiUrl = 'https://serviautos-backend-production.up.railway.app/api/clients';

  constructor(private http: HttpClient) {}

  // Crear cliente
  createClient(cliente: any): Observable<any> {
    return this.http.post(this.apiUrl, cliente);
  }

  // Obtener todos
  getClients(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Obtener por id
  getClientById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Actualizar
  updateClient(id: string, cliente: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, cliente);
  }

  // Eliminar
  deleteClient(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

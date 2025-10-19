import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Orden {
  id?: string;
  clientId: string;
  vehicleId: string;
  diagnostic: string;
  assignedTechnicianId?: string;
  laborValue: number;
  dateService?: string;
  status?: string;
  sparePartsValue?: number;
  totalValue?: number;

  // Campos auxiliares para mostrar
  clientName?: string;
  vehiclePlate?: string;
  technicianName?: string;
  spareParts?: OrderSparePart[];
}

export interface OrderSparePart {
  sparePartId: string;
  sparePartName?: string;
  quantity: number;
  unitValue?: number;
  totalValue?: number;
}

export interface AddSparePartRequest {
  sparePartId: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrdenesService {
  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  // ===== Gestión Básica de Órdenes =====

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

  // ===== Gestión de Técnicos =====

  asignarTecnico(orderId: string, technicianId: string): Observable<Orden> {
    const params = new HttpParams().set('technicianId', technicianId);
    return this.http.put<Orden>(`${this.apiUrl}/${orderId}/attend`, null, { params });
  }

  // ===== Gestión de Repuestos =====

  agregarRepuesto(orderId: string, request: AddSparePartRequest): Observable<Orden> {
    return this.http.post<Orden>(`${this.apiUrl}/${orderId}/spare-parts`, request);
  }

  removerRepuesto(orderId: string, sparePartId: string): Observable<Orden> {
    return this.http.delete<Orden>(`${this.apiUrl}/${orderId}/spare-parts/${sparePartId}`);
  }

  // ===== Finalización =====

  finalizarOrden(orderId: string): Observable<Orden> {
    return this.http.put<Orden>(`${this.apiUrl}/${orderId}/finalize`, null);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface SparePart {
  id?: string;
  name: string;
  detail: string;
  category: string;
  brand: string;
  partNumber: string;
  unitValue: number;
  availableStock: number;
  minimumStock: number;
  location: string;
}

export interface StockMovement {
  id?: string;
  sparePartId: string;
  sparePartName?: string;
  movementType: string; // ADD, REMOVE, ADJUST
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  userId: string;
  userName?: string;
  movementDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  private apiUrl = `${environment.apiUrl}/inventory`;

  constructor(private http: HttpClient) {}

  // ===== Gestión de Repuestos =====
  
  crearRepuesto(sparePart: SparePart): Observable<SparePart> {
    return this.http.post<SparePart>(`${this.apiUrl}/spare-parts`, sparePart);
  }

  obtenerRepuestoPorId(id: string): Observable<SparePart> {
    return this.http.get<SparePart>(`${this.apiUrl}/spare-parts/${id}`);
  }

  listarTodosRepuestos(): Observable<SparePart[]> {
    return this.http.get<SparePart[]>(`${this.apiUrl}/spare-parts`);
  }

  buscarPorCategoria(category: string): Observable<SparePart[]> {
    return this.http.get<SparePart[]>(`${this.apiUrl}/spare-parts/category/${category}`);
  }

  buscarPorMarca(brand: string): Observable<SparePart[]> {
    return this.http.get<SparePart[]>(`${this.apiUrl}/spare-parts/brand/${brand}`);
  }

  obtenerStockBajo(): Observable<SparePart[]> {
    return this.http.get<SparePart[]>(`${this.apiUrl}/spare-parts/low-stock`);
  }

  buscarPorNombre(name: string): Observable<SparePart[]> {
    const params = new HttpParams().set('name', name);
    return this.http.get<SparePart[]>(`${this.apiUrl}/spare-parts/search`, { params });
  }

  actualizarRepuesto(id: string, sparePart: SparePart): Observable<SparePart> {
    return this.http.put<SparePart>(`${this.apiUrl}/spare-parts/${id}`, sparePart);
  }

  eliminarRepuesto(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/spare-parts/${id}`);
  }

  // ===== Gestión de Stock =====

  agregarStock(id: string, quantity: number, reason: string, userId: string): Observable<SparePart> {
    const params = new HttpParams()
      .set('quantity', quantity.toString())
      .set('reason', reason)
      .set('userId', userId);
    return this.http.post<SparePart>(`${this.apiUrl}/spare-parts/${id}/add-stock`, null, { params });
  }

  removerStock(id: string, quantity: number, reason: string, userId: string): Observable<SparePart> {
    const params = new HttpParams()
      .set('quantity', quantity.toString())
      .set('reason', reason)
      .set('userId', userId);
    return this.http.post<SparePart>(`${this.apiUrl}/spare-parts/${id}/remove-stock`, null, { params });
  }

  ajustarStock(id: string, newQuantity: number, reason: string, userId: string): Observable<SparePart> {
    const params = new HttpParams()
      .set('newQuantity', newQuantity.toString())
      .set('reason', reason)
      .set('userId', userId);
    return this.http.post<SparePart>(`${this.apiUrl}/spare-parts/${id}/adjust-stock`, null, { params });
  }

  // ===== Historial de Movimientos =====

  obtenerMovimientosRepuesto(id: string): Observable<StockMovement[]> {
    return this.http.get<StockMovement[]>(`${this.apiUrl}/spare-parts/${id}/movements`);
  }

  obtenerTodosMovimientos(): Observable<StockMovement[]> {
    return this.http.get<StockMovement[]>(`${this.apiUrl}/movements`);
  }
}


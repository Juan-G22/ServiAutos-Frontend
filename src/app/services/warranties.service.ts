import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Warranty {
  id?: string;
  orderId: string;
  clientId?: string;
  status: string;
  description?: string;
  observations?: string;
  technicianId?: string;
  technicianName?: string;
  startDate?: string;
  endDate?: string;
  expirationDate?: string;
  active?: boolean;
  orderCode?: string;
}

export interface UpdateWarrantyRequest {
  status?: string;
  description?: string;
  observations?: string;
  technicianId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class WarrantiesService {
  private apiUrl = `${environment.apiUrl}/warranties`;

  constructor(private http: HttpClient) {}

  listarGarantias(): Observable<Warranty[]> {
    return this.http
      .get<unknown>(this.apiUrl)
      .pipe(map(respuesta => this.extraerArreglo<Warranty>(respuesta)));
  }

  obtenerGarantiaPorId(id: string): Observable<Warranty> {
    return this.http
      .get<unknown>(`${this.apiUrl}/${id}`)
      .pipe(map(respuesta => this.extraerObjeto<Warranty>(respuesta)));
  }

  obtenerGarantiaPorOrden(orderId: string): Observable<Warranty> {
    return this.http
      .get<unknown>(`${this.apiUrl}/order/${orderId}`)
      .pipe(map(respuesta => this.extraerObjeto<Warranty>(respuesta)));
  }

  listarGarantiasPorCliente(clientId: string): Observable<Warranty[]> {
    return this.http
      .get<unknown>(`${this.apiUrl}/client/${clientId}`)
      .pipe(map(respuesta => this.extraerArreglo<Warranty>(respuesta)));
  }

  listarGarantiasPorEstado(status: string): Observable<Warranty[]> {
    return this.http
      .get<unknown>(`${this.apiUrl}/status/${status}`)
      .pipe(map(respuesta => this.extraerArreglo<Warranty>(respuesta)));
  }

  listarGarantiasActivas(): Observable<Warranty[]> {
    return this.http
      .get<unknown>(`${this.apiUrl}/active`)
      .pipe(map(respuesta => this.extraerArreglo<Warranty>(respuesta)));
  }

  listarGarantiasVencidas(): Observable<Warranty[]> {
    return this.http
      .get<unknown>(`${this.apiUrl}/expired`)
      .pipe(map(respuesta => this.extraerArreglo<Warranty>(respuesta)));
  }

  actualizarGarantia(id: string, payload: UpdateWarrantyRequest): Observable<Warranty> {
    return this.http
      .put<unknown>(`${this.apiUrl}/${id}`, payload)
      .pipe(map(respuesta => this.extraerObjeto<Warranty>(respuesta)));
  }

  atenderGarantia(id: string, technicianId: string, observations: string): Observable<Warranty> {
    const params = new HttpParams()
      .set('technicianId', technicianId)
      .set('observations', observations);
    return this.http
      .put<unknown>(`${this.apiUrl}/${id}/attend`, null, { params })
      .pipe(map(respuesta => this.extraerObjeto<Warranty>(respuesta)));
  }

  cerrarGarantia(id: string, observations: string): Observable<Warranty> {
    const params = new HttpParams().set('observations', observations);
    return this.http
      .put<unknown>(`${this.apiUrl}/${id}/close`, null, { params })
      .pipe(map(respuesta => this.extraerObjeto<Warranty>(respuesta)));
  }

  verificarGarantiasVencidas(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/check-expired`, null);
  }

  private extraerArreglo<T>(respuesta: unknown): T[] {
    if (Array.isArray(respuesta)) {
      return respuesta as T[];
    }

    if (respuesta && typeof respuesta === 'object') {
      const objeto = respuesta as Record<string, unknown>;
      const clavesPosibles = ['data', 'content', 'items', 'results', 'garantias', 'list', 'value'];

      for (const clave of clavesPosibles) {
        const valor = objeto[clave];
        if (Array.isArray(valor)) {
          return valor as T[];
        }
      }
    }

    return [];
  }

  private extraerObjeto<T>(respuesta: unknown): T {
    if (respuesta && typeof respuesta === 'object') {
      const objeto = respuesta as Record<string, unknown>;
      const clavesPosibles = ['data', 'content', 'item', 'result', 'garantia', 'value'];

      for (const clave of clavesPosibles) {
        if (objeto[clave] !== undefined) {
          return objeto[clave] as T;
        }
      }
    }

    return respuesta as T;
  }
}

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Cliente {
  id: number;
  nombre: string;
  correo: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  private clientes: Cliente[] = [
    { id: 1, nombre: 'Juan Pérez', correo: 'juan@example.com' },
    { id: 2, nombre: 'María López', correo: 'maria@example.com' }
  ];

  constructor() {}

  listar(): Observable<Cliente[]> {
    return of(this.clientes);
  }

  crear(cliente: Cliente): Observable<Cliente> {
    cliente.id = this.clientes.length + 1;
    this.clientes.push(cliente);
    return of(cliente);
  }

  buscarPorId(id: number): Observable<Cliente | undefined> {
    return of(this.clientes.find(c => c.id === id));
  }
}


import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  // LOGIN
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  // REGISTRO
  signupRequest(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup/request`, user);
  }

  signupVerify(email: string, code: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup/verify?email=${email}&code=${code}`, {});
  }

  // OLVIDÉ CONTRASEÑA
  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password?email=${email}`, {});
  }

  // RESETEAR CONTRASEÑA
  resetPassword(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, data);
  }


  // Guardar token en localStorage
  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  // Obtener el ID del usuario desde el token JWT
  getUserId(): string | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    try {
      // Decodificar el token JWT (sin validar la firma)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const payload = JSON.parse(jsonPayload);
      // Intentar obtener el ID del usuario del payload
      // Puede estar en diferentes campos dependiendo del backend
      return payload.userId || payload.sub || payload.id || null;
    } catch (e) {
      console.error('Error al decodificar el token:', e);
      return null;
    }
  }
}

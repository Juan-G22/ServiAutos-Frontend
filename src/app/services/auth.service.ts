
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/auth'; 

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
}

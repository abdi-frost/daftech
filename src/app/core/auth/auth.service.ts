import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthResponse } from './auth.model'
import { LoginAction } from '../state/app.state';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // private baseUrl = "http://localhost:3000"
  private baseUrl = "https://daftech-api-abdi.up.railway.app"

  constructor(private http: HttpClient) {}

  login(loginData: LoginAction): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, loginData);
  }

  logout(): void {
    // Clear token from local storage
    localStorage.removeItem('token');
  }
    
}

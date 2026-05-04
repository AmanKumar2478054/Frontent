import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../core/models/user'
import { Observable } from 'rxjs';
import { AuthResponse } from '../core/models/AuthResponse'
import { loginUser } from '../core/models/loginUser';
@Injectable({
  providedIn: 'root',
})

export class AuthService {
 private baseUrl = 'http://localhost:8082/api/auth';

 
  constructor(private http: HttpClient) {}

  registerUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/register`, user);
  }
  loginUser(user: loginUser): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, user);
  }
   saveToken(token: string) {
    localStorage.setItem('token', token);
  }
 
  getToken(): string | null {
    return localStorage.getItem('token');
  }
 
  logout() {
    localStorage.removeItem('token');
  }
 
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

}
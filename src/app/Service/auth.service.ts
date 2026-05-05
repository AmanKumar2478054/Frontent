import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../core/models/user'
import { Observable } from 'rxjs';
import { AuthResponse } from '../core/models/AuthResponse'
import { loginUser } from '../core/models/loginUser';
import { UserDetails } from '../core/models/user-details';
@Injectable({
  providedIn: 'root',
})

export class AuthService {
 private baseUrl = 'http://localhost:8082/api/auth';
 private userBaseUrl = 'http://localhost:8082/api/users';

 
  constructor(private http: HttpClient) {}

  registerUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/register`, user);
  }
  loginUser(user: loginUser): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, user);
  }
  getUserByEmail(email: string): Observable<UserDetails> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
    });
    return this.http.get<UserDetails>(`${this.userBaseUrl}/username/${email}`, { headers });
  }
   saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  saveRole(role: string) {
    localStorage.setItem('role', role);
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }
 
  getToken(): string | null {
    return localStorage.getItem('token');
  }
 
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }
 
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  hasRole(expectedRole: string): boolean {
    return this.getRole() === expectedRole;
  }

}
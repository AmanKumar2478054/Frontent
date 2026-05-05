import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CitizenReport, CitizenReportCreateRequest } from '../core/models/citizen-report';
import { Feedback, FeedbackCreateRequest } from '../core/models/feedback';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class CitizenService {
  private baseUrl = 'http://localhost:8082/api';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
    });
  }

  getMyReports(): Observable<CitizenReport[]> {
    return this.http.get<CitizenReport[]>(`${this.baseUrl}/citizen`, {
      headers: this.getAuthHeaders(),
    });
  }

  createReport(payload: CitizenReportCreateRequest): Observable<CitizenReport> {
    return this.http.post<CitizenReport>(`${this.baseUrl}/citizen`, payload, {
      headers: this.getAuthHeaders(),
    });
  }

  getMyFeedbacks(): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(`${this.baseUrl}/feedback`, {
      headers: this.getAuthHeaders(),
    });
  }

  createFeedback(payload: FeedbackCreateRequest): Observable<Feedback> {
    return this.http.post<Feedback>(`${this.baseUrl}/feedback`, payload, {
      headers: this.getAuthHeaders(),
    });
  }
}

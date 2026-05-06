import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CitizenReport, CitizenReportCreateRequest } from '../core/models/citizen-report';
import { Feedback, FeedbackCreateRequest } from '../core/models/feedback';

@Injectable({
  providedIn: 'root',
})
export class CitizenService {
  private baseUrl = 'http://localhost:8082/api';

  constructor(private http: HttpClient) {}

  getMyReports(): Observable<CitizenReport[]> {
    return this.http.get<CitizenReport[]>(`${this.baseUrl}/citizen`);
  }

  createReport(payload: CitizenReportCreateRequest): Observable<CitizenReport> {
    return this.http.post<CitizenReport>(`${this.baseUrl}/citizen`, payload);
  }

  getMyFeedbacks(): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(`${this.baseUrl}/feedback`);
  }

  createFeedback(payload: FeedbackCreateRequest): Observable<Feedback> {
    return this.http.post<Feedback>(`${this.baseUrl}/feedback`, payload);
  }
}

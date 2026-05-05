import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { ProjectResponseDto, ResourceResponseDto } from './project.service';

export interface ComplianceRecordCreateRequest {
  entityId: number;
  entityType: string;
  result: string;
  date: string;
  notes: string;
}

export interface ComplianceRecordResponse {
  complianceId: number;
  entityId: number;
  entityType: string;
  officerId: number;
  result: string;
  date: string;
  notes: string;
}

@Injectable({
  providedIn: 'root',
})
export class ComplianceService {
  private complianceBaseUrl = 'http://localhost:8082/api/compliance';
  private projectsBaseUrl = 'http://localhost:8082/api/projects';
  private resourcesBaseUrl = 'http://localhost:8082/api/resources';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
    });
  }

  getAllProjects(): Observable<ProjectResponseDto[]> {
    return this.http.get<ProjectResponseDto[]>(this.projectsBaseUrl, { headers: this.getAuthHeaders() });
  }

  getResourcesByProject(projectId: number): Observable<ResourceResponseDto[]> {
    return this.http.get<ResourceResponseDto[]>(`${this.resourcesBaseUrl}?projectId=${projectId}`, {
      headers: this.getAuthHeaders(),
    });
  }

  createComplianceRecord(payload: ComplianceRecordCreateRequest): Observable<ComplianceRecordResponse> {
    return this.http.post<ComplianceRecordResponse>(this.complianceBaseUrl, payload, { headers: this.getAuthHeaders() });
  }

  getMyComplianceRecords(): Observable<ComplianceRecordResponse[]> {
    return this.http.get<ComplianceRecordResponse[]>(`${this.complianceBaseUrl}/mine`, { headers: this.getAuthHeaders() });
  }
}

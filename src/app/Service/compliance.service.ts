import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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

  constructor(private http: HttpClient) {}

  getAllProjects(): Observable<ProjectResponseDto[]> {
    return this.http.get<ProjectResponseDto[]>(this.projectsBaseUrl);
  }

  getResourcesByProject(projectId: number): Observable<ResourceResponseDto[]> {
    return this.http.get<ResourceResponseDto[]>(`${this.resourcesBaseUrl}?projectId=${projectId}`);
  }

  createComplianceRecord(payload: ComplianceRecordCreateRequest): Observable<ComplianceRecordResponse> {
    return this.http.post<ComplianceRecordResponse>(this.complianceBaseUrl, payload);
  }

  getMyComplianceRecords(): Observable<ComplianceRecordResponse[]> {
    console.log('[ComplianceService] GET /mine called');
    return this.http.get<ComplianceRecordResponse[]>(`${this.complianceBaseUrl}/mine`);
  }
}

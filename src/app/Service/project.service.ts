import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ImpactRequestDto,
  ImpactResponseDto,
  MilestoneRequestDto,
  MilestoneResponseDto,
  ProjectRequestDto,
  ProjectResponseDto,
  ResourceCreateRequestDto,
  ResourceResponseDto,
} from '../interfaces/project-api.interface';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private projectBaseUrl = 'http://localhost:8082/api/projects';
  private resourceBaseUrl = 'http://localhost:8082/api/resources';

  constructor(private http: HttpClient) {}

  getProjects(): Observable<ProjectResponseDto[]> {
    return this.http.get<ProjectResponseDto[]>(this.projectBaseUrl);
  }

  createProject(payload: ProjectRequestDto): Observable<ProjectResponseDto> {
    return this.http.post<ProjectResponseDto>(this.projectBaseUrl, payload);
  }

  getMilestonesByProject(projectId: number): Observable<MilestoneResponseDto[]> {
    return this.http.get<MilestoneResponseDto[]>(`${this.projectBaseUrl}/${projectId}/milestones`);
  }

  createMilestone(payload: MilestoneRequestDto): Observable<MilestoneResponseDto> {
    return this.http.post<MilestoneResponseDto>(`${this.projectBaseUrl}/milestones`, payload);
  }

  getImpactsByProject(projectId: number): Observable<ImpactResponseDto[]> {
    return this.http.get<ImpactResponseDto[]>(`${this.projectBaseUrl}/${projectId}/impacts`);
  }

  createImpact(payload: ImpactRequestDto): Observable<ImpactResponseDto> {
    return this.http.post<ImpactResponseDto>(`${this.projectBaseUrl}/impacts`, payload);
  }

  getResources(projectId: number): Observable<ResourceResponseDto[]> {
    return this.http.get<ResourceResponseDto[]>(`${this.resourceBaseUrl}?projectId=${projectId}`);
  }

  createResource(payload: ResourceCreateRequestDto): Observable<ResourceResponseDto> {
    return this.http.post<ResourceResponseDto>(this.resourceBaseUrl, payload);
  }
}

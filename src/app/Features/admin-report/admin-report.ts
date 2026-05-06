import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, finalize, forkJoin, Observable, of, tap, timeout } from 'rxjs';
import { AuthService } from '../../Service/auth.service';
import { CitizenReport } from '../../core/models/citizen-report';
import { Feedback } from '../../core/models/feedback';
import { ProjectResponseDto, ResourceResponseDto } from '../../Service/project.service';
import { ComplianceRecordResponse } from '../../Service/compliance.service';
import { TopNavbar } from '../../core/components/top-navbar/top-navbar';

interface ChartItem {
  label: string;
  value: number;
  color: string;
}

interface SummaryTile {
  label: string;
  value: string;
  caption: string;
}

interface UserResponse {
  role: string;
}

@Component({
  selector: 'app-admin-report',
  standalone: true,
  imports: [CommonModule, TopNavbar],
  templateUrl: './admin-report.html',
  styleUrl: './admin-report.css',
})
export class AdminReport implements OnInit {
  readonly baseUrl = 'http://localhost:8082/api';
  loading = true;
  generatedAt = '';
  maxChartValue = 1;
  chartItems: ChartItem[] = [];
  reportStatusItems: ChartItem[] = [];
  resourceTypeItems: ChartItem[] = [];
  feedbackCategoryItems: ChartItem[] = [];
  summaryTiles: SummaryTile[] = [];
  loadError = '';

  constructor(private http: HttpClient, private authService: AuthService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadReport();
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({ Authorization: token ? `Bearer ${token}` : '' });
  }

  loadReport(): void {
    const headers = this.getAuthHeaders();
    this.loading = true;
    this.loadError = '';
    console.log('[AdminReport] Starting report generation...');

    const safeRequest = <T>(label: string, request$: Observable<T>, fallback: T): Observable<T> =>
      request$.pipe(
        timeout(10000),
        tap(() => console.log(`[AdminReport] ${label} loaded successfully`)),
        catchError((error: unknown) => {
          console.error(`[AdminReport] ${label} failed`, error);
          return of(fallback);
        })
      );

    forkJoin({
      reports: safeRequest('reports', this.http.get<CitizenReport[]>(`${this.baseUrl}/citizen/all`, { headers }), [] as CitizenReport[]),
      feedbacks: safeRequest('feedbacks', this.http.get<Feedback[]>(`${this.baseUrl}/feedback/all`, { headers }), [] as Feedback[]),
      users: safeRequest('users', this.http.get<UserResponse[]>(`${this.baseUrl}/users`, { headers }), [] as UserResponse[]),
      projects: safeRequest('projects', this.http.get<ProjectResponseDto[]>(`${this.baseUrl}/projects`, { headers }), [] as ProjectResponseDto[]),
      resources: safeRequest('resources', this.http.get<ResourceResponseDto[]>(`${this.baseUrl}/resources`, { headers }), [] as ResourceResponseDto[]),
      complianceRecords: safeRequest(
        'complianceRecords',
        this.http.get<ComplianceRecordResponse[]>(`${this.baseUrl}/compliance`, { headers }),
        [] as ComplianceRecordResponse[]
      ),
    }).pipe(
      finalize(() => {
        this.loading = false;
        console.log('[AdminReport] Report generation finished');
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: ({
        reports,
        feedbacks,
        users,
        projects,
        resources,
        complianceRecords,
      }: {
        reports: CitizenReport[];
        feedbacks: Feedback[];
        users: UserResponse[];
        projects: ProjectResponseDto[];
        resources: ResourceResponseDto[];
        complianceRecords: ComplianceRecordResponse[];
      }) => {
        const citizensCount = (users ?? []).filter((user: UserResponse) => (user.role ?? '').toUpperCase().includes('CITIZEN')).length;
        const totalResourceCapacity = (resources ?? []).reduce(
          (sum: number, resource: ResourceResponseDto) => sum + Number(resource.capacity ?? 0),
          0
        );
        this.summaryTiles = [
          { label: 'Total Citizens', value: citizensCount.toString(), caption: 'Registered citizen accounts' },
          { label: 'Total Reports', value: (reports?.length ?? 0).toString(), caption: 'All citizen issue reports' },
          { label: 'Total Feedback', value: (feedbacks?.length ?? 0).toString(), caption: 'Citizen feedback submissions' },
          { label: 'Resource Capacity', value: totalResourceCapacity.toLocaleString(), caption: 'Aggregated resource capacity' },
        ];
        this.chartItems = [
          { label: 'Projects', value: projects?.length ?? 0, color: 'from-blue-500 to-blue-700' },
          { label: 'Resources', value: resources?.length ?? 0, color: 'from-emerald-500 to-emerald-700' },
          { label: 'Compliance Records', value: complianceRecords?.length ?? 0, color: 'from-purple-500 to-purple-700' },
        ];
        this.reportStatusItems = this.buildDistribution(
          reports ?? [],
          (report: CitizenReport) => report.status,
          ['from-rose-500 to-rose-700', 'from-amber-500 to-amber-700', 'from-cyan-500 to-cyan-700', 'from-lime-500 to-lime-700']
        );
        this.resourceTypeItems = this.buildDistribution(
          resources ?? [],
          (resource: ResourceResponseDto) => resource.type,
          ['from-indigo-500 to-indigo-700', 'from-sky-500 to-sky-700', 'from-teal-500 to-teal-700', 'from-fuchsia-500 to-fuchsia-700']
        );
        this.feedbackCategoryItems = this.buildDistribution(
          feedbacks ?? [],
          (feedback: Feedback) => feedback.category,
          ['from-emerald-500 to-emerald-700', 'from-orange-500 to-orange-700', 'from-violet-500 to-violet-700', 'from-blue-500 to-blue-700']
        );
        this.maxChartValue = Math.max(
          1,
          ...this.chartItems.map((item) => item.value),
          ...this.reportStatusItems.map((item) => item.value),
          ...this.resourceTypeItems.map((item) => item.value),
          ...this.feedbackCategoryItems.map((item) => item.value)
        );
        this.generatedAt = new Date().toLocaleString();
        console.log('[AdminReport] Chart data prepared', {
          chartItems: this.chartItems,
          reportStatusItems: this.reportStatusItems,
          resourceTypeItems: this.resourceTypeItems,
          feedbackCategoryItems: this.feedbackCategoryItems,
          summaryTiles: this.summaryTiles,
        });
        this.cdr.detectChanges();
      },
      error: (error: unknown) => {
        console.error('Failed to generate admin report', error);
        this.loadError = 'Report generation failed. Please verify API services are running.';
        this.summaryTiles = [
          { label: 'Total Citizens', value: '0', caption: 'Registered citizen accounts' },
          { label: 'Total Reports', value: '0', caption: 'All citizen issue reports' },
          { label: 'Total Feedback', value: '0', caption: 'Citizen feedback submissions' },
          { label: 'Resource Capacity', value: '0', caption: 'Aggregated resource capacity' },
        ];
        this.cdr.detectChanges();
      },
    });
  }

  getBarWidth(value: number): number {
    return Math.max(10, Math.round((value / this.maxChartValue) * 100));
  }

  private buildDistribution<T>(items: T[], extractor: (item: T) => string, palette: string[]): ChartItem[] {
    const grouped: Record<string, number> = {};
    items.forEach((item: T) => {
      const key = (extractor(item) || 'Unknown').toString();
      grouped[key] = (grouped[key] ?? 0) + 1;
    });
    return Object.entries(grouped)
      .sort((a, b) => b[1] - a[1])
      .map(([label, value], index) => ({
        label,
        value,
        color: palette[index % palette.length],
      }));
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../Service/auth.service';
import { CitizenReport } from '../../core/models/citizen-report';
import { Feedback } from '../../core/models/feedback';
import { ProjectResponseDto, ResourceResponseDto } from '../../interfaces/project-api.interface';
import { ComplianceRecordResponse } from '../../interfaces/compliance-api.interface';
import {
  AdminChartItem,
  AdminDashboardUser,
  AdminStatCard,
  AdminSummaryTile,
} from '../../interfaces/admin-view.interface';
import { TopNavbar } from '../../core/components/top-navbar/top-navbar';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, TopNavbar],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit {
  adminName = 'Admin User';
  loading = true;
  readonly baseUrl = 'http://localhost:8082/api';

  stats: AdminStatCard[] = [
    { label: 'Total Reports', value: 0, icon: '📋' },
    { label: 'Total Citizens', value: 0, icon: '👥' },
    { label: 'Total Projects', value: 0, icon: '🏗️' },
    { label: 'Compliance Records', value: 0, icon: '✅' },
  ];

  recentReports: CitizenReport[] = [];
  recentFeedback: Feedback[] = [];
  chartItems: ChartItem[] = [];
  maxChartValue = 0;
  reportStatusItems: AdminChartItem[] = [];
  resourceTypeItems: AdminChartItem[] = [];
  feedbackCategoryItems: AdminChartItem[] = [];
  summaryTiles: AdminSummaryTile[] = [];
  generatedAt = '';

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
    });
  }

  loadDashboard(): void {
    this.loading = true;
    const headers = this.getAuthHeaders();

    forkJoin({
      reports: this.http.get<CitizenReport[]>(`${this.baseUrl}/citizen/all`, { headers }),
      feedbacks: this.http.get<Feedback[]>(`${this.baseUrl}/feedback/all`, { headers }),
      users: this.http.get<AdminDashboardUser[]>(`${this.baseUrl}/users`, { headers }),
      projects: this.http.get<ProjectResponseDto[]>(`${this.baseUrl}/projects`, { headers }),
      resources: this.http.get<ResourceResponseDto[]>(`${this.baseUrl}/resources`, { headers }),
      complianceRecords: this.http.get<ComplianceRecordResponse[]>(`${this.baseUrl}/compliance`, { headers }),
    }).subscribe({
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
        users: AdminDashboardUser[];
        projects: ProjectResponseDto[];
        resources: ResourceResponseDto[];
        complianceRecords: ComplianceRecordResponse[];
      }) => {
        const sortedReports = [...(reports ?? [])].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        const sortedFeedbacks = [...(feedbacks ?? [])].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        const citizensCount = (users ?? []).filter((user: AdminDashboardUser) =>
          (user.role ?? '').toUpperCase().includes('CITIZEN')
        ).length;

        this.recentReports = sortedReports.slice(0, 4);
        this.recentFeedback = sortedFeedbacks.slice(0, 3);
        this.stats = [
          { label: 'Total Reports', value: reports?.length ?? 0, icon: '📋' },
          { label: 'Total Citizens', value: citizensCount, icon: '👥' },
          { label: 'Total Projects', value: projects?.length ?? 0, icon: '🏗️' },
          { label: 'Compliance Records', value: complianceRecords?.length ?? 0, icon: '✅' },
        ];
        this.chartItems = [
          { label: 'Projects', value: projects?.length ?? 0, color: 'from-blue-500 to-blue-700' },
          { label: 'Resources', value: resources?.length ?? 0, color: 'from-emerald-500 to-emerald-700' },
          { label: 'Compliance Records', value: complianceRecords?.length ?? 0, color: 'from-purple-500 to-purple-700' },
        ];
        this.maxChartValue = Math.max(1, ...this.chartItems.map((item) => item.value));
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
        const totalResourceCapacity = (resources ?? []).reduce((sum, resource) => sum + Number(resource.capacity ?? 0), 0);
        this.summaryTiles = [
          {
            label: 'Total Resource Capacity',
            value: totalResourceCapacity.toLocaleString(),
            caption: `${resources?.length ?? 0} resources tracked`,
          },
          {
            label: 'Open Reports',
            value: this.countByStatus(reports ?? [], ['OPEN', 'PENDING']).toString(),
            caption: 'Needs admin attention',
          },
          {
            label: 'Feedback Inflow',
            value: (feedbacks?.length ?? 0).toString(),
            caption: 'Citizen feedback submissions',
          },
          {
            label: 'Compliance Coverage',
            value: `${projects?.length ? Math.round(((complianceRecords?.length ?? 0) / projects.length) * 100) : 0}%`,
            caption: 'Records vs projects',
          },
        ];
        this.generatedAt = new Date().toLocaleString();
        this.loading = false;
      },
      error: (error: unknown) => {
        console.error('Failed to load admin dashboard data', error);
        this.loading = false;
      },
    });
  }

  showGeneratedReport(): void {
    this.router.navigate(['/admin/report']);
  }

  getBarWidth(value: number): number {
    return Math.max(10, Math.round((value / this.maxChartValue) * 100));
  }

  private buildDistribution<T>(items: T[], extractor: (item: T) => string, palette: string[]): AdminChartItem[] {
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

  private countByStatus(reports: CitizenReport[], statuses: string[]): number {
    return reports.filter((report: CitizenReport) =>
      statuses.includes((report.status ?? '').toUpperCase())
    ).length;
  }

  logout(): void {
    this.authService.logout();
  }
}

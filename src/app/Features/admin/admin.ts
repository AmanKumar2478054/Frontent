import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
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

  /** ✅ FIXED */
  chartItems: AdminChartItem[] = [];

  maxChartValue = 0;
  reportStatusItems: AdminChartItem[] = [];
  resourceTypeItems: AdminChartItem[] = [];
  feedbackCategoryItems: AdminChartItem[] = [];
  summaryTiles: AdminSummaryTile[] = [];
  generatedAt = '';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

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
      next: ({ reports, feedbacks, users, projects, resources, complianceRecords }) => {
        const sortedReports = [...reports].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        const sortedFeedbacks = [...feedbacks].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        const citizensCount = users.filter(u =>
          (u.role ?? '').toUpperCase().includes('CITIZEN')
        ).length;

        this.recentReports = sortedReports.slice(0, 4);
        this.recentFeedback = sortedFeedbacks.slice(0, 3);

        this.stats = [
          { label: 'Total Reports', value: reports.length, icon: '📋' },
          { label: 'Total Citizens', value: citizensCount, icon: '👥' },
          { label: 'Total Projects', value: projects.length, icon: '🏗️' },
          { label: 'Compliance Records', value: complianceRecords.length, icon: '✅' },
        ];

        this.chartItems = [
          { label: 'Projects', value: projects.length, color: 'from-blue-500 to-blue-700' },
          { label: 'Resources', value: resources.length, color: 'from-emerald-500 to-emerald-700' },
          { label: 'Compliance Records', value: complianceRecords.length, color: 'from-purple-500 to-purple-700' },
        ];

        this.maxChartValue = Math.max(1, ...this.chartItems.map(i => i.value));

        this.generatedAt = new Date().toLocaleString();
        this.loading = false;
      },
      error: err => {
        console.error('Failed to load admin dashboard data', err);
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

  logout(): void {
    this.authService.logout();
  }
}
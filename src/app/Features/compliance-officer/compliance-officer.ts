import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../Service/auth.service';
import {
  ComplianceRecordCreateRequest,
  ComplianceRecordResponse,
  ComplianceService,
} from '../../Service/compliance.service';
import { ProjectResponseDto, ResourceResponseDto } from '../../Service/project.service';

@Component({
  selector: 'app-compliance-officer',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './compliance-officer.html',
  styleUrl: './compliance-officer.css',
})
export class ComplianceOfficer implements OnInit {
  projects: ProjectResponseDto[] = [];
  resources: ResourceResponseDto[] = [];
  myComplianceRecords: ComplianceRecordResponse[] = [];
  selectedProject: ProjectResponseDto | null = null;

  showComplianceModal = false;
  complianceForm: FormGroup;
  targetEntityType: 'Project' | 'Resource' = 'Project';
  targetEntityId: number | null = null;
  activeTab: 'projects' | 'records' = 'projects';

  constructor(
    private complianceService: ComplianceService,
    private authService: AuthService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.complianceForm = this.fb.group({
      result: ['', [Validators.required, Validators.minLength(2)]],
      date: ['', Validators.required],
      notes: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  ngOnInit(): void {
    this.loadProjects();
    this.loadMyComplianceRecords();
  }

  loadProjects(): void {
    this.complianceService.getAllProjects().subscribe({
      next: (projects: ProjectResponseDto[]) => {
        this.projects = projects;
        this.cdr.detectChanges();
      },
      error: (error: unknown) => {
        console.error('Failed to load projects', error);
        this.projects = [];
        this.cdr.detectChanges();
      },
    });
  }

  selectProject(project: ProjectResponseDto): void {
    this.selectedProject = project;
    this.complianceService.getResourcesByProject(project.projectId).subscribe({
      next: (resources: ResourceResponseDto[]) => {
        this.resources = resources;
        this.cdr.detectChanges();
      },
      error: (error: unknown) => {
        console.error('Failed to load resources', error);
        this.resources = [];
        this.cdr.detectChanges();
      },
    });
  }

  openCreateComplianceForProject(projectId: number): void {
    this.targetEntityType = 'Project';
    this.targetEntityId = projectId;
    this.showComplianceModal = true;
    this.complianceForm.reset({
      result: '',
      date: new Date().toISOString().slice(0, 16),
      notes: '',
    });
  }

  openCreateComplianceForResource(resourceId: number): void {
    this.targetEntityType = 'Resource';
    this.targetEntityId = resourceId;
    this.showComplianceModal = true;
    this.complianceForm.reset({
      result: '',
      date: new Date().toISOString().slice(0, 16),
      notes: '',
    });
  }

  closeComplianceModal(): void {
    this.showComplianceModal = false;
    this.targetEntityId = null;
  }

  createCompliance(): void {
    if (!this.complianceForm.valid || this.targetEntityId === null) {
      return;
    }

    const payload: ComplianceRecordCreateRequest = {
      entityId: this.targetEntityId,
      entityType: this.targetEntityType,
      result: this.complianceForm.value.result,
      date: this.complianceForm.value.date,
      notes: this.complianceForm.value.notes,
    };
    console.log('[ComplianceOfficer] Creating compliance payload:', payload);

    this.complianceService.createComplianceRecord(payload).subscribe({
      next: (createdRecord: ComplianceRecordResponse) => {
        console.log('[ComplianceOfficer] Created compliance record response:', createdRecord);
        this.closeComplianceModal();
        this.loadMyComplianceRecords();
      },
      error: (error: unknown) => {
        console.error('Failed to create compliance record', error);
        alert('Failed to create compliance record');
      },
    });
  }

  loadMyComplianceRecords(): void {
    console.log('[ComplianceOfficer] Fetching my compliance records...');
    this.complianceService.getMyComplianceRecords().subscribe({
      next: (records: ComplianceRecordResponse[]) => {
        console.log('[ComplianceOfficer] My compliance records response:', records);
        this.myComplianceRecords = records;
        this.cdr.detectChanges();
      },
      error: (error: unknown) => {
        console.error('Failed to load my compliance records', error);
        this.myComplianceRecords = [];
        this.cdr.detectChanges();
      },
    });
  }

  clearSelectedProject(): void {
    this.selectedProject = null;
    this.resources = [];
  }

  logout(): void {
    this.authService.logout();
  }
}

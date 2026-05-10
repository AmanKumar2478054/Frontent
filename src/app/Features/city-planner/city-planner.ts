import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { catchError, forkJoin, map, Observable, of } from 'rxjs';
import { TopNavbar } from '../../core/components/top-navbar/top-navbar';
import { ProjectService } from '../../Service/project.service';
import {
  ImpactResponseDto,
  MilestoneResponseDto,
  ProjectResponseDto,
  ResourceResponseDto,
} from '../../interfaces/project-api.interface';
import { ToastService } from '../../core/services/toast.service';
import {
  CityPlannerMilestone,
  CityPlannerMilestoneStatus,
  CityPlannerProject,
  CityPlannerProjectStatus,
} from '../../interfaces/city-planner-view.interface';

@Component({
  selector: 'app-city-planner',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, TopNavbar],
  templateUrl: './city-planner.html',
  styleUrl: './city-planner.css',
})
export class CityPlanner implements OnInit {
  projects: CityPlannerProject[] = [];
  projectForm!: FormGroup;
  resourceForm!: FormGroup;
  milestoneForm!: FormGroup;
  impactForm!: FormGroup;

  showProjectModal = false;
  showResourceModal = false;
  showMilestoneModal = false;
  showImpactModal = false;

  selectedProject: CityPlannerProject | null = null;
  activeTab: 'overview' | 'resources' | 'milestones' | 'impact' = 'overview';

  projectStats = {
    total: 0,
    active: 0,
    completed: 0,
    totalBudget: 0,
  };

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private cdr: ChangeDetectorRef,
    private toast: ToastService
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.loadProjects();
  }

  initializeForms(): void {
    this.projectForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      budget: ['', [Validators.required, Validators.min(1000)]],
      status: ['PLANNED', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });

    this.resourceForm = this.fb.group({
      type: ['', [Validators.required, Validators.minLength(2)]],
      location: ['', [Validators.required, Validators.minLength(3)]],
      capacity: ['', [Validators.required, Validators.min(0)]],
      status: ['AVAILABLE', Validators.required],
    });

    this.milestoneForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      milestoneDate: ['', Validators.required],
      status: ['PENDING', Validators.required],
    });

    this.impactForm = this.fb.group({
      impact: ['', [Validators.required, Validators.minLength(10)]],
      recordedDate: ['', Validators.required],
      status: ['DRAFT', Validators.required],
    });
  }

  loadProjects(): void {
    this.projectService.getProjects().subscribe({
      next: (projects: ProjectResponseDto[]) => {
        if (projects.length === 0) {
          this.projects = [];
          this.updateProjectStats();
          this.cdr.detectChanges();
          return;
        }

        const projectLoaders: Observable<CityPlannerProject>[] = projects.map((project: ProjectResponseDto) =>
          this.enrichProjectCardData(project)
        );

        forkJoin(projectLoaders).subscribe({
          next: (enrichedProjects: CityPlannerProject[]) => {
            this.projects = enrichedProjects;
            this.updateProjectStats();
            this.cdr.detectChanges();
          },
          error: (error: unknown) => {
            console.error('Failed to enrich project cards', error);
            this.projects = projects.map((project: ProjectResponseDto) => this.mapProject(project));
            this.updateProjectStats();
            this.cdr.detectChanges();
          },
        });
      },
      error: (error: unknown) => {
        console.error('Failed to load projects', error);
        this.projects = [];
        this.cdr.detectChanges();
      },
    });
  }

  private mapProject(project: ProjectResponseDto): CityPlannerProject {
    return {
      id: project.projectId,
      name: project.title,
      description: project.description,
      category: 'N/A',
      budget: Number(project.budget ?? 0),
      status: project.status as CityPlannerProjectStatus,
      startDate: project.startDate,
      endDate: project.endDate,
      impact: '',
      milestones: [],
      resources: [],
      progress: 0,
    };
  }

  private enrichProjectCardData(projectDto: ProjectResponseDto): Observable<CityPlannerProject> {
    const baseProject = this.mapProject(projectDto);
    const projectId = projectDto.projectId;

    return forkJoin({
      milestones: this.projectService.getMilestonesByProject(projectId).pipe(catchError(() => of([] as MilestoneResponseDto[]))),
      resources: this.projectService.getResources(projectId).pipe(catchError(() => of([] as ResourceResponseDto[]))),
      impacts: this.projectService.getImpactsByProject(projectId).pipe(catchError(() => of([] as ImpactResponseDto[]))),
    }).pipe(
      map(
        ({
          milestones,
          resources,
          impacts,
        }: {
          milestones: MilestoneResponseDto[];
          resources: ResourceResponseDto[];
          impacts: ImpactResponseDto[];
        }) => {
        const mappedMilestones = milestones.map((m: MilestoneResponseDto) => ({
          id: m.milestoneId,
          name: m.title,
          date: m.milestoneDate,
          status: m.status as CityPlannerMilestoneStatus,
        }));
        const mappedResources = resources.map((r: ResourceResponseDto) => ({
          id: r.resourceId,
          name: r.location,
          type: r.type,
          quantity: r.capacity,
          allocation: r.status,
        }));
        const latestImpact = impacts[impacts.length - 1];
        const statement = latestImpact?.metricsJson?.['statement'];
        const impactText =
          typeof statement === 'string'
            ? statement
            : latestImpact
              ? JSON.stringify(latestImpact.metricsJson)
              : '';
        const completedMilestones = mappedMilestones.filter(
          (milestone: CityPlannerMilestone) => milestone.status === 'MET'
        ).length;
        const progress =
          mappedMilestones.length > 0 ? Math.round((completedMilestones / mappedMilestones.length) * 100) : 0;

        return {
          ...baseProject,
          milestones: mappedMilestones,
          resources: mappedResources,
          impact: impactText,
          progress,
        };
      })
    );
  }

  updateProjectStats(): void {
    this.projectStats = {
      total: this.projects.length,
      active: this.projects.filter(p => p.status === 'ACTIVE').length,
      completed: this.projects.filter(p => p.status === 'COMPLETED').length,
      totalBudget: this.projects.reduce((sum, p) => sum + p.budget, 0),
    };
  }

  openProjectModal(): void {
    this.projectForm.reset();
    this.showProjectModal = true;
  }

  closeProjectModal(): void {
    this.showProjectModal = false;
    this.projectForm.reset();
  }

  createProject(): void {
    if (this.projectForm.valid) {
      this.projectService.createProject(this.projectForm.value).subscribe({
        next: (response: ProjectResponseDto) => {
          this.projects.push(this.mapProject(response));
          this.updateProjectStats();
          this.closeProjectModal();
          this.toast.success('Your project has been created successfully!');
        },
        error: (error: unknown) => {
          console.error('Failed to create project', error);
          this.toast.error('Failed to create project.');
        },
      });
    }
  }

  selectProject(project: CityPlannerProject): void {
    this.selectedProject = project;
    this.activeTab = 'overview';
    this.loadProjectDetails(project.id);
  }

  closeProjectDetails(): void {
    this.selectedProject = null;
  }

  private loadProjectDetails(projectId: number): void {
    this.loadProjectMilestones(projectId);
    this.loadProjectResources(projectId);
    this.loadProjectImpacts(projectId);
  }

  private loadProjectMilestones(projectId: number): void {
    this.projectService.getMilestonesByProject(projectId).subscribe({
      next: (milestones: MilestoneResponseDto[]) => {
        if (!this.selectedProject || this.selectedProject.id !== projectId) return;
        this.selectedProject.milestones = milestones.map((m) => ({
          id: m.milestoneId,
          name: m.title,
          date: m.milestoneDate,
          status: m.status as CityPlannerMilestoneStatus,
        }));
        this.updateProjectProgress();
      },
      error: (error: unknown) => console.error('Failed to load milestones', error),
    });
  }

  private loadProjectResources(projectId: number): void {
    this.projectService.getResources(projectId).subscribe({
      next: (resources: ResourceResponseDto[]) => {
        if (!this.selectedProject || this.selectedProject.id !== projectId) return;
        this.selectedProject.resources = resources.map((r) => ({
          id: r.resourceId,
          name: r.location,
          type: r.type,
          quantity: r.capacity,
          allocation: r.status,
        }));
      },
      error: (error: unknown) => console.error('Failed to load resources', error),
    });
  }

  private loadProjectImpacts(projectId: number): void {
    this.projectService.getImpactsByProject(projectId).subscribe({
      next: (impacts: ImpactResponseDto[]) => {
        if (!this.selectedProject || this.selectedProject.id !== projectId) return;
        const latestImpact = impacts[impacts.length - 1];
        if (!latestImpact) {
          this.selectedProject.impact = '';
          return;
        }
        const statement = latestImpact.metricsJson?.['statement'];
        this.selectedProject.impact = typeof statement === 'string' ? statement : JSON.stringify(latestImpact.metricsJson);
      },
      error: (error: unknown) => console.error('Failed to load impacts', error),
    });
  }

  openResourceModal(): void {
    if (this.selectedProject) {
      this.resourceForm.reset();
      this.showResourceModal = true;
    }
  }

  closeResourceModal(): void {
    this.showResourceModal = false;
    this.resourceForm.reset();
  }

  addResource(): void {
    if (this.resourceForm.valid && this.selectedProject) {
      const payload = {
        projectId: this.selectedProject.id,
        ...this.resourceForm.value,
      };
      this.projectService.createResource(payload).subscribe({
        next: () => {
          this.loadProjectResources(this.selectedProject!.id);
          this.closeResourceModal();
          this.toast.success('Your resource has been added successfully!');
        },
        error: (error: unknown) => {
          console.error('Failed to add resource', error);
          this.toast.error('Failed to add resource.');
        },
      });
    }
  }

  deleteResource(resourceId: number): void {
    if (this.selectedProject) {
      this.selectedProject.resources = this.selectedProject.resources.filter(r => r.id !== resourceId);
    }
  }

  openMilestoneModal(): void {
    if (this.selectedProject) {
      this.milestoneForm.reset();
      this.showMilestoneModal = true;
    }
  }

  closeMilestoneModal(): void {
    this.showMilestoneModal = false;
    this.milestoneForm.reset();
  }

  addMilestone(): void {
    if (this.milestoneForm.valid && this.selectedProject) {
      const payload = {
        projectId: this.selectedProject.id,
        ...this.milestoneForm.value,
      };
      this.projectService.createMilestone(payload).subscribe({
        next: () => {
          this.loadProjectMilestones(this.selectedProject!.id);
          this.closeMilestoneModal();
          this.toast.success('Your milestone has been added successfully!');
        },
        error: (error: unknown) => {
          console.error('Failed to add milestone', error);
          this.toast.error('Failed to add milestone.');
        },
      });
    }
  }

  deleteMilestone(milestoneId: number): void {
    if (this.selectedProject) {
      this.selectedProject.milestones = this.selectedProject.milestones.filter(m => m.id !== milestoneId);
      this.updateProjectProgress();
    }
  }

  updateMilestoneStatus(milestoneId: number, status: string): void {
    if (this.selectedProject) {
      const milestone = this.selectedProject.milestones.find(m => m.id === milestoneId);
      if (milestone) {
        milestone.status = status as CityPlannerMilestoneStatus;
        this.updateProjectProgress();
      }
    }
  }

  openImpactModal(): void {
    if (this.selectedProject) {
      this.impactForm.patchValue({
        impact: this.selectedProject.impact,
        recordedDate: new Date().toISOString().slice(0, 10),
        status: 'DRAFT',
      });
      this.showImpactModal = true;
    }
  }

  closeImpactModal(): void {
    this.showImpactModal = false;
  }

  setImpact(): void {
    if (this.impactForm.valid && this.selectedProject) {
      const payload = {
        projectId: this.selectedProject.id,
        metricsJson: { statement: this.impactForm.value.impact },
        recordedDate: this.impactForm.value.recordedDate,
        status: this.impactForm.value.status,
      };
      this.projectService.createImpact(payload).subscribe({
        next: () => {
          this.selectedProject!.impact = this.impactForm.value.impact;
          this.closeImpactModal();
          this.toast.success('Your project impact has been saved successfully!');
        },
        error: (error: unknown) => {
          console.error('Failed to set impact', error);
          this.toast.error('Failed to save impact.');
        },
      });
    }
  }

  updateProjectProgress(): void {
    if (this.selectedProject && this.selectedProject.milestones.length > 0) {
      const completed = this.selectedProject.milestones.filter(m => m.status === 'MET').length;
      this.selectedProject.progress = Math.round((completed / this.selectedProject.milestones.length) * 100);
    }
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'Active': 'bg-green-100 text-green-800',
      'ACTIVE': 'bg-green-100 text-green-800',
      'PLANNED': 'bg-blue-100 text-blue-800',
      'COMPLETED': 'bg-purple-100 text-purple-800',
      'ON_HOLD': 'bg-yellow-100 text-yellow-800',
      'CANCELLED': 'bg-red-100 text-red-800',
      'PENDING': 'bg-gray-100 text-gray-800',
      'MET': 'bg-green-100 text-green-800',
      'MISSED': 'bg-red-100 text-red-800',
      'DEFERRED': 'bg-yellow-100 text-yellow-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  }

  getResourceTypeIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'Budget': '💰',
      'Personnel': '👥',
      'Equipment': '⚙️',
      'Materials': '📦',
    };
    return icons[type] || '📋';
  }

}

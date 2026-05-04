import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface Milestone {
  id: string;
  name: string;
  date: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
}

interface Resource {
  id: string;
  name: string;
  type: 'Budget' | 'Personnel' | 'Equipment' | 'Materials';
  quantity: number;
  allocation: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  category: string;
  budget: number;
  status: 'Planning' | 'Active' | 'On Hold' | 'Completed';
  startDate: string;
  endDate: string;
  impact: string;
  milestones: Milestone[];
  resources: Resource[];
  progress: number;
}

@Component({
  selector: 'app-city-planner',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './city-planner.html',
  styleUrl: './city-planner.css',
})
export class CityPlanner {
  projects: Project[] = [];
  projectForm!: FormGroup;
  resourceForm!: FormGroup;
  milestoneForm!: FormGroup;
  impactForm!: FormGroup;

  showProjectModal = false;
  showResourceModal = false;
  showMilestoneModal = false;
  showImpactModal = false;

  selectedProject: Project | null = null;
  activeTab: 'overview' | 'resources' | 'milestones' | 'impact' = 'overview';

  projectStats = {
    total: 0,
    active: 0,
    completed: 0,
    totalBudget: 0,
  };

  constructor(private fb: FormBuilder) {
    this.initializeForms();
    this.loadSampleData();
  }

  initializeForms(): void {
    this.projectForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', Validators.required],
      budget: ['', [Validators.required, Validators.min(1000)]],
      status: ['Planning', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });

    this.resourceForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      type: ['Budget', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      allocation: ['', Validators.required],
    });

    this.milestoneForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      date: ['', Validators.required],
      status: ['Not Started', Validators.required],
    });

    this.impactForm = this.fb.group({
      impact: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  loadSampleData(): void {
    this.projects = [
      {
        id: '1',
        name: 'Urban Green Space Initiative',
        description: 'Create new parks and green spaces across the city',
        category: 'Environment',
        budget: 500000,
        status: 'Active',
        startDate: '2026-01-15',
        endDate: '2026-12-31',
        impact: 'Increase green space by 40%, improve air quality',
        milestones: [
          { id: '1', name: 'Site Selection', date: '2026-02-28', status: 'Completed' },
          { id: '2', name: 'Design Planning', date: '2026-04-30', status: 'In Progress' },
          { id: '3', name: 'Construction', date: '2026-08-31', status: 'Not Started' },
        ],
        resources: [
          { id: '1', name: 'Budget Allocation', type: 'Budget', quantity: 500000, allocation: '100%' },
          { id: '2', name: 'Engineering Team', type: 'Personnel', quantity: 15, allocation: '80%' },
        ],
        progress: 35,
      },
    ];
    this.updateProjectStats();
  }

  updateProjectStats(): void {
    this.projectStats = {
      total: this.projects.length,
      active: this.projects.filter(p => p.status === 'Active').length,
      completed: this.projects.filter(p => p.status === 'Completed').length,
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
      const newProject: Project = {
        id: Date.now().toString(),
        ...this.projectForm.value,
        impact: '',
        milestones: [],
        resources: [],
        progress: 0,
      };
      this.projects.push(newProject);
      this.updateProjectStats();
      this.closeProjectModal();
    }
  }

  selectProject(project: Project): void {
    this.selectedProject = project;
    this.activeTab = 'overview';
  }

  closeProjectDetails(): void {
    this.selectedProject = null;
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
      const newResource: Resource = {
        id: Date.now().toString(),
        ...this.resourceForm.value,
      };
      this.selectedProject.resources.push(newResource);
      this.closeResourceModal();
    }
  }

  deleteResource(resourceId: string): void {
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
      const newMilestone: Milestone = {
        id: Date.now().toString(),
        ...this.milestoneForm.value,
      };
      this.selectedProject.milestones.push(newMilestone);
      this.updateProjectProgress();
      this.closeMilestoneModal();
    }
  }

  deleteMilestone(milestoneId: string): void {
    if (this.selectedProject) {
      this.selectedProject.milestones = this.selectedProject.milestones.filter(m => m.id !== milestoneId);
      this.updateProjectProgress();
    }
  }

  updateMilestoneStatus(milestoneId: string, status: string): void {
    if (this.selectedProject) {
      const milestone = this.selectedProject.milestones.find(m => m.id === milestoneId);
      if (milestone) {
        milestone.status = status as 'Not Started' | 'In Progress' | 'Completed';
        this.updateProjectProgress();
      }
    }
  }

  openImpactModal(): void {
    if (this.selectedProject) {
      this.impactForm.patchValue({ impact: this.selectedProject.impact });
      this.showImpactModal = true;
    }
  }

  closeImpactModal(): void {
    this.showImpactModal = false;
  }

  setImpact(): void {
    if (this.impactForm.valid && this.selectedProject) {
      this.selectedProject.impact = this.impactForm.value.impact;
      this.closeImpactModal();
    }
  }

  updateProjectProgress(): void {
    if (this.selectedProject && this.selectedProject.milestones.length > 0) {
      const completed = this.selectedProject.milestones.filter(m => m.status === 'Completed').length;
      this.selectedProject.progress = Math.round((completed / this.selectedProject.milestones.length) * 100);
    }
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'Active': 'bg-green-100 text-green-800',
      'Planning': 'bg-blue-100 text-blue-800',
      'Completed': 'bg-purple-100 text-purple-800',
      'On Hold': 'bg-yellow-100 text-yellow-800',
      'In Progress': 'bg-cyan-100 text-cyan-800',
      'Not Started': 'bg-gray-100 text-gray-800',
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

export type CityPlannerMilestoneStatus = 'PENDING' | 'MET' | 'MISSED' | 'DEFERRED';

export interface CityPlannerMilestone {
  id: number;
  name: string;
  date: string;
  status: CityPlannerMilestoneStatus;
}

export interface CityPlannerResource {
  id: number;
  name: string;
  type: string;
  quantity: number;
  allocation: string;
}

export type CityPlannerProjectStatus = 'PLANNED' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';

export interface CityPlannerProject {
  id: number;
  name: string;
  description: string;
  category: string;
  budget: number;
  status: CityPlannerProjectStatus;
  startDate: string;
  endDate: string;
  impact: string;
  milestones: CityPlannerMilestone[];
  resources: CityPlannerResource[];
  progress: number;
}

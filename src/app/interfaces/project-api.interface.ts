export interface ProjectRequestDto {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  budget: number;
  status: 'PLANNED' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';
}

export interface ProjectResponseDto extends ProjectRequestDto {
  projectId: number;
  createdBy: number;
}

export interface ResourceCreateRequestDto {
  projectId: number;
  type: string;
  location: string;
  capacity: number;
  status: string;
}

export interface ResourceResponseDto extends ResourceCreateRequestDto {
  resourceId: number;
}

export interface MilestoneRequestDto {
  projectId: number;
  title: string;
  milestoneDate: string;
  status: 'PENDING' | 'MET' | 'MISSED' | 'DEFERRED';
}

export interface MilestoneResponseDto extends MilestoneRequestDto {
  milestoneId: number;
}

export interface ImpactRequestDto {
  projectId: number;
  metricsJson: Record<string, unknown>;
  recordedDate: string;
  status: 'DRAFT' | 'SUBMITTED' | 'VERIFIED';
}

export interface ImpactResponseDto extends ImpactRequestDto {
  impactId: number;
}

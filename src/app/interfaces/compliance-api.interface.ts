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

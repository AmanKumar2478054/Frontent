export interface CitizenReport {
  reportId: number;
  citizenId: number;
  type: string;
  location: string;
  date: string;
  status: string;
}

export interface CitizenReportCreateRequest {
  type: string;
  location: string;
  status: string;
}

export interface AdminChartItem {
  label: string;
  value: number;
  color: string;
  hint?: string;
}

export interface AdminSummaryTile {
  label: string;
  value: string;
  caption: string;
}

/** Minimal user shape used by the sustainability / admin report endpoint. */
export interface AdminReportUserSnippet {
  role: string;
}

export interface AdminDashboardUser {
  userId: number;
  name: string;
  email: string;
  role: string;
  status?: string;
}

export interface AdminStatCard {
  label: string;
  value: number;
  icon: string;
}

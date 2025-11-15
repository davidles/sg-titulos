export interface DashboardMenuOption {
  id: number;
  name: string | null;
  description: string | null;
}

export interface DashboardRequestSummary {
  idRequest: number;
  requestTypeName: string | null;
  generatedAt: string | null;
  statusName: string | null;
  statusDescription: string | null;
  nextAction: string;
  requestTypeId: number | null;
  academicProgramName: string | null;
  facultyName: string | null;
  planName: string | null;
}

export interface DashboardData {
  menuOptions: DashboardMenuOption[];
  requests: DashboardRequestSummary[];
}

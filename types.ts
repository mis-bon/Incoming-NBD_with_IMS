
export interface ReportData {
  totalLeads: number;
  connectedLeads: number;
  interestedLeads: number;
  clientConverted: number;
  firstPhase: number;
  secondPhase: number;
  thirdPhase: number;
}

export interface DashboardData {
  yesterday: ReportData;
  week: ReportData;
  month: ReportData;
}

export interface InventoryItem {
  tool: string;
  brand: string;
  availableStock: number;
  sold: number;
}

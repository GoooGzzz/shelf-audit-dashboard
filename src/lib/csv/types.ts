// src/lib/csv/types.ts

export interface AuditRow {
  week: string;
  day: string;
  empCode: string;
  empName: string;
  title: string;
  shopCode: string;
  shopName: string;
  avTotal: number | null;
  refTotal: number | null;
  wmTotal: number | null;
  avBrands: number[];
  refBrands: number[];
  wmBrands: number[];
  avSum: number;
  refSum: number;
  wmSum: number;
}

export interface RawAuditRow {
  'Sub Div.': string;
  'Job': string;
  'Code': string;
  'Name': string;
  'DATE ': string;
  'Shop Code': string;
  'Shop Name': string;
  'Area': string;
  'Governorate': string;
  'District': string;
  'Comment ': string;
  'Check': string;
}

export interface Violation {
  type: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  employee: string;
  empCode: string;
  title: string;
  shop?: string;
  shopCode?: string;
  week?: string;
  day?: string;
  message: string;
  zScore?: string;
  affectedWeeks?: number;
  trend?: string;
  consistency?: string;
  pattern?: string;
  shopsCount?: number;
  auditorsCount?: number;
  entriesCount?: number;
}

export interface EmployeeScore {
  code: string;
  name: string;
  title: string;
  critical: number;
  high: number;
  medium: number;
  total: number;
  issues: Record<string, number>;
}

export interface Stats {
  totalAudits: number;
  criticalViolations: number;
  highViolations: number;
  mediumViolations: number;
  affectedEmployees: number;
  titleGroups: Record<string, any>;
  employeeScores: EmployeeScore[];
  issueDistribution: Array<{ name: string; value: number }>;
  weeklyTrend: Array<any>;
  severityDistribution?: Array<{ name: string; value: number; color: string }>;
}

export interface AIInsight {
  type: string;
  icon: string;
  title: string;
  value: string;
  status: string;
  description: string;
}
// src/lib/csv/types.ts
export interface AuditRow {
  employeeName: string;
  totalAV: number;     // Notice the different property names
  totalRef: number;
  totalWM: number;
}

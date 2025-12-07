// src/lib/csv/types.ts

// Shelf Audit Row (main dashboard)
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

// Route Map Row (optional future feature)
export interface RouteMapRow {
  date: string;
  empCode: string;
  empName: string;
  shopCode: string;
  shopName: string;
  latitude: string;
  longitude: string;
  visitTime: string;
}
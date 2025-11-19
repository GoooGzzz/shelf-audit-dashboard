// src/lib/csv/types.ts

// The expected final structure for the dashboard components
export interface AuditRow {
  employeeName: string;
  totalAV: number;     // Assuming 'total available' (total entries/audits)
  totalRef: number;    // Assuming 'total pass/reference' (total checks that passed)
  totalWM: number;     // Assuming 'total warning/mismatch' (total checks that failed)
}

// NEW: Structure for the raw data directly from 'CE IR - OR Route Map W44.csv'
export interface RawAuditRow {
  'Sub Div.': string;
  'Job': string;
  'Code': string;
  'Name': string;
  'DATE ': string; // Note the trailing space from the CSV header
  'Shop Code': string;
  'Shop Name': string;
  'Area': string;
  'Governorate': string;
  'District': string;
  'Comment ': string; // Note the trailing space from the CSV header
  'Check': string; // This is the crucial 'TRUE'/'FALSE' integrity check
}
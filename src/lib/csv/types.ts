// File: src/lib/csv/types.ts

// Existing AuditRow for legacy shelf audit (if needed)
export interface AuditRow {
  employeeName: string;
  totalAV: number;     // e.g., total AV issues
  totalRef: number;    // e.g., total Ref issues
  totalWM: number;     // e.g., total WM issues
}

// ⚠️ NEW INTERFACE FOR ROUTE MAP DATA
export interface RouteMapRow {
  "Sub Div.": string;
  "Job": string;
  "Code": string;
  "Name": string;
  "DATE ": string;       // Note the space in the column name
  "Shop Code": string;
  "Shop Name": string;
  "Area": string;
  "Governorate": string;
  "District": string;
  "Shop Code_Audited": string; // Mapping the repeated column for clarity
  "Shop Name_Audited": string; // Mapping the repeated column for clarity
  "Comment ": string;     // Note the space in the column name
  "Check": string;       // TRUE or FALSE validation result
}
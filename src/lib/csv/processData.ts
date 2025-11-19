// src/lib/csv/processData.ts

import { AuditRow, RawAuditRow } from "./types";

/**
 * Transforms and aggregates raw CSV data into the AuditRow structure for the dashboard.
 * @param rawData The array of raw data objects parsed directly from the CSV.
 * @returns An array of aggregated AuditRow objects.
 */
export const processData = (rawData: RawAuditRow[]): AuditRow[] => {
  if (!rawData || rawData.length === 0) {
    return [];
  }

  // 1. Group data by employee name (Name column)
  const employeeMap = rawData.reduce((acc, row) => {
    // Trim the name to handle potential leading/trailing spaces
    const employeeName = row['Name'].trim();

    // Check if the audit check passed (case-insensitive 'TRUE')
    const checkPassed = row['Check'].toUpperCase() === 'TRUE';

    if (!acc[employeeName]) {
      acc[employeeName] = {
        employeeName: employeeName,
        totalAV: 0,
        totalRef: 0,
        totalWM: 0,
      };
    }

    // 2. Aggregate the metrics
    acc[employeeName].totalAV += 1; // Total Audits (Available)

    if (checkPassed) {
      acc[employeeName].totalRef += 1; // Total Pass/Reference
    } else {
      acc[employeeName].totalWM += 1; // Total Fail/Warning/Mismatch
    }

    return acc;
  }, {} as Record<string, AuditRow>); // Record<string, AuditRow> helps type the accumulator

  // 3. Convert the map values back to an array
  return Object.values(employeeMap);
};
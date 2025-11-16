// src/lib/csv/parseCSV.ts
import Papa from 'papaparse'; // Import Papa explicitly

import { AuditRow } from "./types"; // Ensure AuditRow is imported from the correct path

export const parseCSV = (csvData: string): AuditRow[] => {
  try {
    const parsed = Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
    });
    return parsed.data as AuditRow[];
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error("Error parsing CSV: " + error.message);
    } else {
      // Fallback error handling for non-Error objects
      throw new Error("Unknown error while parsing CSV");
    }
  }
};

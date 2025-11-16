import { AuditRow } from "./types";
import Papa from "papaparse"; // Using PapaParse library to parse CSV

export const parseCSV = (csvText: string): AuditRow[] => {
  try {
    const parsed = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
    });

    if (parsed.errors.length > 0) {
      throw new Error("Malformed CSV data");
    }

    return parsed.data as AuditRow[];
  } catch (error) {
    throw new Error("Error parsing CSV: " + error.message);
  }
};

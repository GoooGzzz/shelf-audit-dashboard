// src/lib/parseCSV.ts
import Papa from 'papaparse';

export interface CSVRow {
  [key: string]: string;
}

export function parseCSV(content: string): CSVRow[] {
  return new Promise((resolve, reject) => {
    Papa.parse(content, {
      header: true,            // Use first row as keys
      skipEmptyLines: true,    // Skip empty lines
      dynamicTyping: false,    // Keep all values as strings (safer for audit data)
      complete: (result) => {
        if (result.errors.length > 0) {
          console.warn('CSV parsing warnings:', result.errors);
        }
        resolve(result.data as CSVRow[]);
      },
      error: (error) => {
        reject(new Error(`Failed to parse CSV: ${error.message}`));
      }
    });
  });
}
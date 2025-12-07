// src/lib/csv/parseCSV.ts
import Papa from 'papaparse';
import type { AuditRow } from './schema';

export class CSVParser {
  static parse(file: File): Promise<AuditRow[]> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        worker: true,
        complete: (results) => {
          if (results.errors.length) reject(results.errors);
          else resolve(results.data as AuditRow[]);
        },
        error: reject,
      });
    });
  }

  static unparse(rows: AuditRow[], filename = 'export.csv') {
    const csv = Papa.unparse(rows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
}
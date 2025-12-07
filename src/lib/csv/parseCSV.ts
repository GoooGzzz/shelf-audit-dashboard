// src/lib/csv/parseCSV.ts
import Papa from 'papaparse';
import type { AuditRow } from './schema';

export class CSVParser {
  static parse(file: File): Promise<AuditRow[]> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: false,                    // ← your CSV has no headers
        dynamicTyping: true,
        skipEmptyLines: true,
        worker: true,

        // Map columns by position: 0=sku, 1=location, 2=quantity
        complete: (results) => {
          if (results.errors.length) {
            reject(results.errors);
            return;
          }

          const rows = results.data as any[][];
          const mapped: AuditRow[] = rows.map(row => ({
            sku: String(row[0] ?? '').trim(),
            location: String(row[1] ?? '').trim(),
            quantity: Number(row[2]) || 0,
            price: row[3] ? Number(row[3]) : undefined,
            status: row[4] ? String(row[4]).trim() : undefined,
            date: row[5] ? String(row[5]).trim() : undefined,
          }));

          resolve(mapped);
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
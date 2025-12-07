// src/lib/csv/parseCSV.ts
import Papa from 'papaparse';
import type { AuditRow } from './schema';

export class CSVParser {
  static parse(file: File): Promise<AuditRow[]> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: false,           // ← THIS IS THE KEY FIX
        dynamicTyping: true,
        skipEmptyLines: true,
        worker: true,
        transformHeader: () => null, // ignore headers completely
        // Map columns by position: 0=sku, 1=location, 2=quantity, 3=price, 4=status, 5=date
        transform: (value, field) => {
          if (field === 0) return String(value).trim();        // sku
          if (field === 1) return String(value).trim();        // location
          if (field === 2) return Number(value) || 0;          // quantity
          if (field === 3) return value ? Number(value) : undefined; // price
          if (field === 4) return String(value).trim() || undefined;  // status
          if (field === 5) return String(value).trim() || undefined;  // date
          return value;
        },
        complete: (results) => {
          if (results.errors.length) reject(results.errors);
          else {
  // Convert array of arrays → objects with correct keys
            const mapped = results.data.map((row: any[]) => ({
              sku: row[0],
              location: row[1],
              quantity: Number(row[2]) || 0,
              price: row[3] ? Number(row[3]) : undefined,
              status: row[4],
              date: row[5],
            }));
            resolve(mapped as AuditRow[]);
          }
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
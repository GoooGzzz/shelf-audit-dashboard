// src/lib/csv/parseCSV.ts
import Papa from 'papaparse';
import { AuditRow } from './schema';

export class CSVParser {
  static parse(file: File): Promise<AuditRow[]> {
    return new Promise((resolve, reject) => {
      Papa.parse<AuditRow>(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        worker: true,
        transformHeader: (h) => h.trim().toLowerCase().replace(/\s+/g, '_'),
        transform: (value, header) => {
          if (typeof header !== 'string') return value;
          if (header.includes('price')) return Number(String(value).replace(/[$,]/g, '')) || 0;
          if (['yes', 'true', '1'].includes(String(value).toLowerCase())) return true;
          if (['no', 'false', '0'].includes(String(value).toLowerCase())) return false;
          return String(value).trim() || null;
        },
        complete: (results) => {
          if (results.errors.length) reject(results.errors);
          else resolve(results.data);
        },
        error: reject,
      });
    });
  }

  static unparse(rows: AuditRow[], filename = 'export.csv') {
    const csv = Papa.unparse(rows);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
}
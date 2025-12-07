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
        complete: (results) => resolve(results.data as AuditRow[]),
        error: reject,
      });
    });
  }
  static unparse(rows: AuditRow[]) {
    const csv = Papa.unparse(rows);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'export.csv';
    a.click();
  }
}

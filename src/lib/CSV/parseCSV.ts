// src/lib/csv/parseCSV.ts
import Papa, { ParseResult } from 'papaparse';
import { AuditRow } from './types'; // adjust path if needed

export type ParseOptions = {
  streaming?: boolean;
  worker?: boolean;
  onProgress?: (progress: number) => void;
};

/**
 * Unified CSV parser for the shelf-audit-dashboard
 * Handles file input, remote URL, string, streaming, cleaning, export
 */
export class CSVParser {
  static parse<T = AuditRow>(
    input: File | string,
    options: ParseOptions = {}
  ): Promise<T[]> {
    return new Promise((resolve, reject) => {
      const config = {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        worker: options.worker ?? true,
        delimiter: '', // auto-detect
        transformHeader: (h: string) => h.trim().toLowerCase().replace(/\s+/g, '_'),
        transform: (value: string, header: string | number) => {
          if (typeof header !== 'string') return value;
          // Clean common dirty data
          if (header.includes('price') || header.includes('amount'))
            return Number(String(value).replace(/[$,]/g, '')) || 0;
          if (['yes', 'true', '1'].includes(String(value).toLowerCase())) return true;
          if (['no', 'false', '0'].includes(String(value).toLowerCase())) return false;
          return String(value).trim() || null;
        },
        chunk: options.streaming
          ? (results: ParseResult<T>) => {
              options.onProgress?.(results.meta.cursor ? results.meta.cursor / (input instanceof File ? input.size : 1) : 0);
            }
          : undefined,
        complete: (results: ParseResult<T>) => {
          if (results.errors.length) reject(results.errors);
          else resolve(results.data);
        },
        error: (err: Error) => reject(err),
      };

      if (typeof input === 'string' && input.startsWith('http')) {
        // Remote URL
        fetch(input)
          .then(r => r.text())
          .then(text => Papa.parse<T>(text, config));
      } else {
        Papa.parse<T>(input, config);
      }
    });
  }

  // Export rows back to downloadable CSV
  static unparse(rows: any[], filename = 'audit-export.csv') {
    const csv = Papa.unparse(rows, { quotes: true });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }
}
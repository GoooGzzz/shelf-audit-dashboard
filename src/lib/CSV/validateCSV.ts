// src/lib/csv/validateCSV.ts
import { AuditRow } from './types';

export type ValidationError = {
  row: number;
  field?: string;
  message: string;
};

export class CSVValidator {
  static validate(rows: AuditRow[]): ValidationError[] {
    const errors: ValidationError[] = [];

    rows.forEach((row, index) => {
      const rowNum = index + 2; // +header +1-based

      // Required fields
      if (!row.sku?.trim()) errors.push({ row: rowNum, field: 'sku', message: 'SKU is required' });
      if (!row.location?.trim()) errors.push({ row: rowNum, field: 'location', message: 'Location is required' });
      if (row.quantity === undefined || row.quantity === null) errors.push({ row: rowNum, field: 'quantity', message: 'Quantity is required' });

      // Data types
      if (typeof row.quantity !== 'number' || row.quantity < 0)
        errors.push({ row: rowNum, field: 'quantity', message: 'Quantity must be non-negative number' });

      if (row.price !== undefined && typeof row.price !== 'number')
        errors.push({ row: rowNum, field: 'price', message: 'Price must be number' });

      // Custom business rules (add yours)
      if (row.status && !['in_stock', 'low_stock', 'out_of_stock'].includes(row.status))
        errors.push({ row: rowNum, field: 'status', message: 'Invalid status' });
    });

    return errors;
  }
}
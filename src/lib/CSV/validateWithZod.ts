// src/lib/csv/validateWithZod.ts
import { AuditRowSchema } from './schema';
import { z } from 'zod';

export type ValidationError = {
  row: number;
  field: string;
  message: string;
};

export const validateCSVRows = (rows: any[]): { valid: typeof AuditRowSchema._type[], errors: ValidationError[] } => {
  const valid: typeof AuditRowSchema._type[] = [];
  const errors: ValidationError[] = [];

  rows.forEach((row, idx) => {
    const result = AuditRowSchema.safeParse(row);
    if (result.success) {
      valid.push(result.data);
    } else {
      result.error.issues.forEach(issue => {
        errors.push({
          row: idx + 2,
          field: issue.path.join('.') || 'unknown',
          message: issue.message,
        });
      });
    }
  });

  return { valid, errors };
};
import { AuditRowSchema } from './schema';
import type { AuditRow } from './schema';

export const validateRows = (rows: any[]) => {
  const valid: AuditRow[] = [];
  const errors: { row: number; field: string; message: string }[] = [];

  rows.forEach((row, i) => {
    const result = AuditRowSchema.safeParse(row);
    if (result.success) {
      valid.push(result.data);
    } else {
      result.error.issues.forEach(issue => {
        errors.push({
          row: i + 2,
          field: issue.path.join('.') || 'unknown',
          message: issue.message,
        });
      });
    }
  });

  return { valid, errors };
};

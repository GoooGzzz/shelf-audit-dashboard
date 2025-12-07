// src/lib/csv/schema.ts
import { z } from 'zod';

// Strict ISO or common formats: YYYY-MM-DD, MM/DD/YYYY, DD-MM-YYYY
const DateString = z.string().refine((val) => {
  const trimmed = val.trim();
  if (!trimmed) return true; // optional
  return !isNaN(Date.parse(trimmed)) || /^\d{4}-\d{2}-\d{2}$/.test(trimmed);
}, { message: 'Invalid date format' });

// Optional: convert to Date object
const ParsedDate = DateString.optional().transform((val) => {
  if (!val?.trim()) return undefined;
  const d = new Date(val.trim());
  return isNaN(d.getTime()) ? undefined : d;
});

export const AuditRowSchema = z.object({
  sku: z.string().min(1, 'SKU required').trim(),
  location: z.string().min(1, 'Location required').trim(),
  quantity: z.number().int().min(0, 'Quantity ≥ 0'),
  price: z.number().optional(),
  status: z.enum(['in_stock', 'low_stock', 'out_of_stock']).optional(),
  date: ParsedDate, // now auto-parsed to Date | undefined
});

export type AuditRow = z.infer<typeof AuditRowSchema>;
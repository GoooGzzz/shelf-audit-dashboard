// src/lib/csv/schema.ts
import { z } from 'zod';

export const AuditRowSchema = z.object({
  sku: z.string().min(1, 'SKU required').trim(),
  location: z.string().min(1, 'Location required').trim(),
  quantity: z.number().int().min(0).max(10000, 'Quantity too high'),
  date: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid date'),
}).superRefine((data, ctx) => {
  if (rows.some(r => r.sku === data.sku)) ctx.addIssue({ path: ['sku'], message: 'Duplicate SKU' });
});

export type AuditRow = z.infer<typeof AuditRowSchema>;
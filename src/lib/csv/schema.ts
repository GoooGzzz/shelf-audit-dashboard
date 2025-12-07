// src/lib/csv/schema.ts
import { z } from 'zod';

export const AuditRowSchema = z.object({
  sku: z.string().min(1, 'SKU required'),
  location: z.string().min(1, 'Location required'),
  quantity: z.coerce.number().int().min(0),
  price: z.coerce.number().optional(),
  status: z.string().optional(),
  date: z.string().optional(),
});

export type AuditRow = z.infer<typeof AuditRowSchema>;
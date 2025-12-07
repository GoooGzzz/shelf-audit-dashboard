// src/lib/csv/schema.ts
import { z } from 'zod';

export const AuditRowSchema = z.object({
  sku: z.string().min(1, 'SKU required').trim(),
  location: z.string().min(1, 'Location required').trim(),
  quantity: z.number().int().min(0),
  price: z.number().optional(),
  status: z.enum(['in_stock', 'low_stock', 'out_of_stock']).optional(),
  date: z
    .string()
    .optional()
    .transform((val) => (val?.trim() ? new Date(val.trim()) : undefined))
    .refine((d) => !d || !isNaN(d!.getTime()), { message: 'Invalid date' }),
});

export type AuditRow = z.infer<typeof AuditRowSchema>;
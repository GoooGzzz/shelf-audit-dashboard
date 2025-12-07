import { z } from 'zod';

export const AuditRowSchema = z.object({
  sku: z.string().min(1),
  location: z.string().min(1),
  quantity: z.number().int().min(0),
  price: z.number().optional(),
  status: z.string().optional(),
  date: z.string().optional(),
});

export type AuditRow = z.infer<typeof AuditRowSchema>;

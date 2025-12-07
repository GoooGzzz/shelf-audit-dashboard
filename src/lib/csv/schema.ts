// src/lib/csv/schema.ts
import { z } from 'zod';

const flexibleSchema = z.object({
  // Accept any common variations
  sku: z.string().optional(),
  SKU: z.string().optional(),
  item: z.string().optional(),
  code: z.string().optional(),
  product: z.string().optional(),

  location: z.string().optional(),
  Location: z.string().optional(),
  store: z.string().optional(),
  warehouse: z.string().optional(),

  quantity: z.union([z.string(), z.number()]).optional(),
  qty: z.union([z.string(), z.number()]).optional(),
  count: z.union([z.string(), z.number()]).optional(),

  price: z.union([z.string(), z.number()]).optional(),
  status: z.string().optional(),
  date: z.string().optional(),
}).transform((data) => ({
  sku: data.sku ?? data.SKU ?? data.item ?? data.code ?? data.product ?? '',
  location: data.location ?? data.Location ?? data.store ?? data.warehouse ?? '',
  quantity: Number(data.quantity ?? data.qty ?? data.count ?? 0),
  price: data.price ? Number(data.price) : undefined,
  status: data.status,
  date: data.date,
}));

export const AuditRowSchema = flexibleSchema.refine(
  (d) => d.sku && d.location && !isNaN(d.quantity),
  { message: "Missing required fields after mapping" }
);

export type AuditRow = z.infer<typeof AuditRowSchema>;
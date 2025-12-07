// src/lib/csv/schema.ts
import { z } from 'zod';

export const AuditRowSchema = z.tuple([
  z.string().min(1, 'SKU missing'),           // column 0
  z.string().min(1, 'Location missing'),      // column 1  
  z.coerce.number().int().min(0),              // column 2 → quantity
]).or(
  // Fallback for any row with extra columns (ignore them)
  z.array(z.any()).min(3).transform(arr => ({
    sku: String(arr[0] ?? '').trim(),
    location: String(arr[1] ?? '').trim(),
    quantity: Number(arr[2]) || 0,
  }))
).transform(data => {
  // Normalize to object
  if (Array.isArray(data)) {
    return { sku: data[0], location: data[1], quantity: data[2] };
  }
  return data;
});

export type AuditRow = {
  sku: string;
  location: string;
  quantity: number;
};
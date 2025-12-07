// src/lib/csv/schema.ts
// Minimal schema — only for TypeScript typing
// We skip Zod validation because your CSV is 3-column positional data

export type AuditRow = {
  sku: string;
  location: string;
  quantity: number;
};

// No Zod schema = no validation errors
// We'll validate only that we have 3 columns in parseCSV.ts
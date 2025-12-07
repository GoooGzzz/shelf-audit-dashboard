'use client';

import { useState } from 'react';
import { CSVParser } from '@/lib/csv/parseCSV';
import { validateRows } from '@/lib/csv/validateWithZod';
import type { AuditRow } from '@/lib/csv/schema';

export default function Home() {
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [errors, setErrors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const parsed = await CSVParser.parse(file);
      const { valid, errors: validationErrors } = validateRows(parsed);
      setErrors(validationErrors);
      setRows(valid);
    } catch (err) {
      alert('Parse error: ' + JSON.stringify(err));
    }
    setLoading(false);
  };

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Shelf Audit Dashboard</h1>

      <input type="file" accept=".csv" onChange={handleFile} className="mb-6" />

      {loading && <p>Parsing...</p>}
      {errors.length > 0 && (
        <div className="bg-red-100 p-4 rounded mb-4">
          <strong>{errors.length} validation errors:</strong>
          <ul>{errors.map((e, i) => <li key={i}>Row {e.row} – {e.field}: {e.message}</li>)}</ul>
        </div>
      )}

      {rows.length > 0 && (
        <>
          <p className="text-green-600 font-bold">{rows.length} valid rows loaded</p>
          <button onClick={() => CSVParser.unparse(rows)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
            Export CSV
          </button>
        </>
      )}
    </main>
  );
}
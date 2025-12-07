'use client';

import { useState } from 'react';
import { CSVParser } from '@\/lib\/csv\/parseCSV';
import { validateRows } from '@\/lib\/csv\/validateWithZod';
import type { AuditRow } from '@\/lib\/csv\/schema';
import CSVCharts from '@/components/CSVCharts';

export default function Home() {
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [errors, setErrors] = useState<{ row: number; field: string; message: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setRows([]);
    setErrors([]);

    try {
      const parsed = await CSVParser.parse(file);
      const { valid, errors: validationErrors } = validateRows(parsed);
      setRows(valid);
      setErrors(validationErrors);
    } catch (err) {
      alert('Failed to parse CSV: ' + JSON.stringify(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Shelf Audit Dashboard</h1>

        <div className="bg-white p-8 rounded-xl shadow-lg mb-8">
          <label className="block text-lg font-semibold mb-4">Upload Audit CSV</label>
          <input
            type="file"
            accept=".csv"
            onChange={handleFile}
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-3 file:px-8 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700"
          />
        </div>

        {loading && <p className="text-blue-600 font-bold text-lg">Parsing and validating CSV...</p>}

        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-300 p-6 rounded-xl mb-8">
            <h3 className="text-xl font-bold text-red-800 mb-3">{errors.length} Validation Errors Found</h3>
            <ul className="text-sm text-red-700 space-y-1 max-h-60 overflow-y-auto">
              {errors.map((e, i) => (
                <li key={i}>• Row {e.row} — {e.field}: {e.message}</li>
              ))}
            </ul>
          </div>
        )}

        {rows.length > 0 && (
          <>
            <div className="bg-green-50 border border-green-400 p-6 rounded-xl mb-8 flex justify-between items-center">
              <p className="text-2xl font-bold text-green-800">
                {rows.length.toLocaleString()} valid rows loaded
              </p>
              <button
                onClick={() => CSVParser.unparse(rows, `shelf-audit-${new Date().toISOString().slice(0,10)}.csv`)}
                className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition"
              >
                Export Clean CSV
              </button>
            </div>

            <CSVCharts rows={rows} />
          </>
        )}
      </div>
    </main>
  );
}

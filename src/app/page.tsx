'use client';

import { useState, useMemo } from 'react';
import { CSVParser } from '@/lib/csv/parseCSV';
import { validateRows } from '@/lib/csv/validateWithZod';
import type { AuditRow } from '@/lib/csv/schema';
import CSVCharts from '@/components/CSVCharts';
import { Tooltip } from 'react-tooltip';
import { MagnifyingGlassIcon, ArrowDownTrayIcon } from '@heroicons/react/24/solid';

export default function Home() {
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [errors, setErrors] = useState<{ row: number; field: string; message: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [auditLogs, setAuditLogs] = useState<string[]>([]);
  const pageSize = 50;

  const addLog = (msg: string) => setAuditLogs(prev => [...prev, `${new Date().toISOString()}: ${msg}`]);

  const filteredRows = useMemo(() => rows.filter(r => r.sku.includes(search) || r.location.includes(search)), [rows, search]);
  const pagedErrors = errors.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    addLog(`Uploading ${file.name}`);
    try {
      const parsed = await CSVParser.parse(file);
      const { valid, errors: validationErrors } = validateRows(parsed);
      setRows(valid);
      setErrors(validationErrors);
      addLog(`Validated: ${valid.length} valid, ${validationErrors.length} errors`);
    } catch (err) {
      addLog(`Error: ${err}`);
      alert('Parse failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={`min-h-screen p-8 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 flex items-center gap-2">
          Shelf Audit Dashboard
          <button onClick={() => setDarkMode(!darkMode)} className="text-sm bg-gray-200 dark:bg-gray-700 p-1 rounded">Toggle Dark</button>
        </h1>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow mb-8">
          <label className="block text-lg font-semibold mb-4">Upload CSV</label>
          <input type="file" accept=".csv" onChange={handleFile} className="file:py-3 file:px-8 file:rounded-lg file:bg-blue-600 file:text-white hover:file:bg-blue-700" />
        </div>

        {loading && <div className="flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>}

        {errors.length > 0 && (
          <div className="bg-red-50 dark:bg-red-900 p-6 rounded-xl mb-8">
            <h3 className="font-bold text-red-800 dark:text-red-300">{errors.length} Errors</h3>
            <ul className="text-sm text-red-700 dark:text-red-200 overflow-y-auto max-h-60">
              {pagedErrors.map((e, i) => <li key={i} data-tooltip-id="error-tip">Row {e.row} — {e.field}: {e.message}</li>)}
            </ul>
            <div className="flex justify-between mt-4">
              <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1}>Prev</button>
              <span>Page {currentPage} / {Math.ceil(errors.length / pageSize)}</span>
              <button onClick={() => setCurrentPage(p => p+1)} disabled={currentPage * pageSize >= errors.length}>Next</button>
            </div>
            <Tooltip id="error-tip" content="Click to fix" />
          </div>
        )}

        {rows.length > 0 && (
          <>
            <div className="bg-green-50 dark:bg-green-900 p-6 rounded-xl mb-8 flex justify-between items-center">
              <p className="text-2xl font-bold text-green-800 dark:text-green-300">{rows.length.toLocaleString()} valid rows</p>
              <button onClick={() => CSVParser.unparse(rows, `audit-${new Date().toISOString().slice(0,10)}.csv`)} className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex gap-2">
                <ArrowDownTrayIcon className="h-5 w-5" /> Export
              </button>
            </div>

            <div className="mb-8">
              <input type="text" placeholder="Search by SKU or Location" value={search} onChange={e => setSearch(e.target.value)} className="p-2 border rounded w-full max-w-md flex gap-2 items-center" />
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
            </div>

            <CSVCharts rows={filteredRows} />

            <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
              <h3 className="text-xl font-bold mb-4">Audit Logs</h3>
              <ul className="text-sm overflow-y-auto max-h-60">
                {auditLogs.map((log, i) => <li key={i}>{log}</li>)}
              </ul>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
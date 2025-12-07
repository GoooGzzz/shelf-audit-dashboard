// src/components/UI/CSVUpload.tsx
'use client';

import { useState, ChangeEvent, useRef } from 'react';
import { parseCSV, CSVRow } from '@/lib/parseCSV';

interface CSVUploadProps {
  onParsedData: (data: CSVRow[]) => void;
  acceptTypes?: string; // e.g., ".csv" (default)
  maxFileSizeMB?: number; // optional limit
}

export default function CSVUpload({
  onParsedData,
  acceptTypes = '.csv',
  maxFileSizeMB = 10,
}: CSVUploadProps) {
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset state
    setError(null);
    setFileName(file.name);

    // File type check
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Invalid file type. Please upload a .csv file.');
      setFileName(null);
      return;
    }

    // File size check (optional)
    const maxSizeBytes = maxFileSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(`File too large. Please upload a file smaller than ${maxFileSizeMB} MB.`);
      setFileName(null);
      return;
    }

    setIsParsing(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const csvText = event.target?.result as string;
        const parsedData = await parseCSV(csvText);

        if (parsedData.length === 0) {
          setError('The CSV file is empty or contains no data rows.');
          setFileName(null);
          return;
        }

        onParsedData(parsedData);
      } catch (err) {
        console.error('CSV Parse Error:', err);
        setError('Failed to parse the CSV file. Please ensure it is properly formatted.');
        setFileName(null);
      } finally {
        setIsParsing(false);
        // Reset input so same file can be re-uploaded
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };

    reader.onerror = () => {
      setError('Unable to read the file. Please try again.');
      setIsParsing(false);
      setFileName(null);
    };

    reader.readAsText(file);
  };

  const handleClear = () => {
    setFileName(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="csv-upload w-full max-w-md">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Upload Shelf Audit Data (CSV)
      </label>

      <div className="flex flex-col gap-3">
        <div
          className={`flex items-center justify-between p-3 border rounded-md ${
            error
              ? 'border-red-300 bg-red-50'
              : isParsing
              ? 'border-blue-300 bg-blue-50'
              : 'border-gray-300'
          }`}
        >
          <div className="text-sm">
            {fileName ? (
              <span className="font-medium text-gray-800">{fileName}</span>
            ) : (
              <span className="text-gray-500">No file selected</span>
            )}
          </div>

          {fileName && !isParsing && !error && (
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={acceptTypes}
          onChange={handleFileChange}
          disabled={isParsing}
          className="hidden"
          id="csv-upload-input"
        />
        <label
          htmlFor="csv-upload-input"
          className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isParsing
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
          }`}
        >
          {isParsing ? 'Processing...' : 'Choose CSV File'}
        </label>

        {isParsing && (
          <p className="text-sm text-blue-600 flex items-center">
            <span className="animate-pulse">Parsing audit data...</span>
          </p>
        )}

        {error && (
          <div className="mt-2 p-2 text-sm text-red-700 bg-red-100 rounded">
            {error}
          </div>
        )}

        {!error && !isParsing && fileName && (
          <p className="text-sm text-green-700 mt-1">
            ✅ File ready for validation
          </p>
        )}
      </div>

      <p className="mt-2 text-xs text-gray-500">
        Supported format: UTF-8 CSV with headers. Fields containing commas or quotes must be enclosed in double quotes.
      </p>
    </div>
  );
}
// File: src/components/Dashboard/DataIntegrityDashboard.tsx

import React, { useState } from "react";
import Papa from "papaparse";

// Define the CSV row structure
interface CsvRow {
  name: string;
  value: number;
}

const DataIntegrityDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [csvData, setCsvData] = useState<CsvRow[]>([]);

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);

    Papa.parse(file, {
      complete: (result) => {
        setCsvData(result.data as CsvRow[]); // Assuming correct CSV structure
        setLoading(false);
      },
      header: true,
      skipEmptyLines: true,
    });
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleUpload} />
      {loading ? <p>Loading...</p> : <p>CSV Data Loaded</p>}
      <pre>{JSON.stringify(csvData, null, 2)}</pre>
    </div>
  );
};

export default DataIntegrityDashboard;

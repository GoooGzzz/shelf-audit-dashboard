import { CSVParser } from '@\/lib\/csv\/parseCSV';

<input
  type="file"
  accept=".csv"
  onChange={async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const rows = await CSVParser.parse<AuditRow>(file, { streaming: true });
      setRows(rows);
    }
  }}
/>

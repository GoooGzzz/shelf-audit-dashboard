import React, { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  Table, TableBody, TableCell, TableHead, TableRow, Paper, TableContainer,
  Card, CardContent, Typography, Grid, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';

// Parse raw CSV data (simplified for demo — use PapaParse in real app)
const parseData = (csvText) => {
  const lines = csvText.trim().split('\n').slice(2); // skip header rows
  return lines.map(line => {
    const cols = line.split(',');
    return {
      week: cols[0],
      day: cols[1],
      empCode: cols[2],
      empName: cols[3],
      shopCode: cols[5],
      shopName: cols[6],
      samsung: cols[7] === '' ? null : Number(cols[7]),
      lg: cols[8] === '' ? null : Number(cols[8]),
      fresh: cols[9] === '' ? null : Number(cols[9]),
      avTotal: cols.slice(10, 42).filter(c => c !== '').reduce((sum, v) => sum + Number(v), 0),
      refTotal: cols.slice(42, 72).filter(c => c !== '').reduce((sum, v) => sum + Number(v), 0),
      wmTotal: cols.slice(72, 98).filter(c => c !== '').reduce((sum, v) => sum + Number(v), 0),
    };
  }).filter(r => ['W44', 'W45'].includes(r.week));
};

// Replace with actual file content
const rawData = `Week#,Day#,Emp Code,... (your full CSV here)`;
const allRecords = parseData(rawData);

// Group by employee
const groupByEmployee = (records) => {
  const empMap = {};
  records.forEach(r => {
    const key = `${r.empCode}|${r.empName}`;
    if (!empMap[key]) empMap[key] = { records: [], empCode: r.empCode, empName: r.empName };
    empMap[key].records.push(r);
  });
  return Object.values(empMap).map(emp => {
    const total = emp.records.length;
    const missing = emp.records.filter(r => r.samsung === null).length;
    const duplicates = emp.records.filter((r, i, arr) => 
      i > 0 &&
      r.shopCode === arr[i-1].shopCode &&
      r.samsung === arr[i-1].samsung &&
      r.lg === arr[i-1].lg &&
      r.fresh === arr[i-1].fresh &&
      r.avTotal === arr[i-1].avTotal &&
      r.refTotal === arr[i-1].refTotal &&
      r.wmTotal === arr[i-1].wmTotal
    ).length;
    return {
      ...emp,
      missingRate: total ? (missing / total) : 0,
      duplicateRate: total ? (duplicates / total) : 0,
      total,
      missing,
      duplicates
    };
  });
};

// Group by store
const groupByStore = (records) => {
  const storeMap = {};
  records.forEach(r => {
    const key = `${r.shopCode} (${r.shopName})`;
    if (!storeMap[key]) storeMap[key] = [];
    storeMap[key].push(r);
  });
  return storeMap;
};

const employeeData = groupByEmployee(allRecords);
const storeGroups = groupByStore(allRecords);
const storeOptions = Object.keys(storeGroups);

export default function ShelfShareAuditDashboard() {
  const [selectedStore, setSelectedStore] = useState(storeOptions[0] || '');
  const [selectedDetail, setSelectedDetail] = useState(null); // {empCode, shopCode}

  const visibleRecords = selectedStore ? storeGroups[selectedStore] || [] : [];

  // Add audit flags
  const flaggedRecords = useMemo(() => 
    visibleRecords.map((r, i, arr) => {
      const prev = i > 0 ? arr[i - 1] : null;
      const isCopyPaste = prev &&
        r.shopCode === prev.shopCode &&
        r.samsung === prev.samsung &&
        r.lg === prev.lg &&
        r.fresh === prev.fresh &&
        r.avTotal === prev.avTotal &&
        r.refTotal === prev.refTotal &&
        r.wmTotal === prev.wmTotal;

      const isFaulty = r.samsung === null && (r.lg > 0 || r.fresh > 0);
      
      return { ...r, isCopyPaste, isFaulty };
    }), [visibleRecords]
  );

  const handleRowClick = (record) => {
    setSelectedDetail({
      empCode: record.empCode,
      shopCode: record.shopCode
    });
  };

  const detailRecords = selectedDetail
    ? allRecords.filter(r =>
        r.empCode === selectedDetail.empCode &&
        r.shopCode === selectedDetail.shopCode
      )
    : [];

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>Shelf Share Data Audit (W44–W45)</Typography>

      {/* Store Selector */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel id="store-select-label">Select Store</InputLabel>
        <Select
          labelId="store-select-label"
          value={selectedStore}
          label="Select Store"
          onChange={(e) => setSelectedStore(e.target.value)}
        >
          {storeOptions.map(store => (
            <MenuItem key={store} value={store}>{store}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Store Timeline Chart */}
      <Typography variant="h6" sx={{ mb: 2 }}>Timeline: {selectedStore}</Typography>
      <div style={{ width: '100%', height: 300, marginBottom: '24px' }}>
        <ResponsiveContainer>
          <BarChart data={flaggedRecords}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="samsung" name="Samsung" fill="#1976d2" />
            <Bar dataKey="lg" name="LG" fill="#4caf50" />
            <Bar dataKey="fresh" name="Fresh" fill="#ff9800" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Store Records Table */}
      <Typography variant="subtitle1">Store Records ({flaggedRecords.length})</Typography>
      <Paper sx={{ mb: 4 }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Day</TableCell>
                <TableCell>Emp</TableCell>
                <TableCell>Samsung</TableCell>
                <TableCell>LG</TableCell>
                <TableCell>Fresh</TableCell>
                <TableCell>Flag</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {flaggedRecords.map((r, i) => (
                <TableRow
                  key={i}
                  onClick={() => handleRowClick(r)}
                  sx={{
                    cursor: 'pointer',
                    backgroundColor: r.isFaulty ? '#ffebee' : r.isCopyPaste ? '#fff3e0' : 'inherit',
                    '&:hover': { backgroundColor: '#f5f5f5' }
                  }}
                >
                  <TableCell>{r.day}</TableCell>
                  <TableCell>{r.empName} ({r.empCode})</TableCell>
                  <TableCell>{r.samsung ?? '—'}</TableCell>
                  <TableCell>{r.lg ?? '—'}</TableCell>
                  <TableCell>{r.fresh ?? '—'}</TableCell>
                  <TableCell>
                    {r.isFaulty && 'Faulty Collection'}
                    {r.isCopyPaste && 'Suspect: Copy-Paste'}
                    {!r.isFaulty && !r.isCopyPaste && '—'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Employee Risk Summary */}
      <Typography variant="h6" sx={{ mb: 2 }}>High-Risk Employees</Typography>
      <Paper>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Emp Code</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Visits</TableCell>
                <TableCell>% Missing Samsung</TableCell>
                <TableCell>% Duplicates</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employeeData
                .filter(emp => emp.missingRate > 0.2 || emp.duplicateRate >= 0.5)
                .map(emp => (
                  <TableRow key={emp.empCode}>
                    <TableCell>{emp.empCode}</TableCell>
                    <TableCell>{emp.empName}</TableCell>
                    <TableCell>{emp.total}</TableCell>
                    <TableCell>{(emp.missingRate * 100).toFixed(1)}%</TableCell>
                    <TableCell>{(emp.duplicateRate * 100).toFixed(1)}%</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Drill-down Detail (if clicked) */}
      {selectedDetail && (
        <div style={{ marginTop: '32px' }}>
          <Typography variant="h6">
            Detail: {selectedDetail.empCode} @ {selectedDetail.shopCode}
          </Typography>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Day</TableCell>
                  <TableCell>Samsung</TableCell>
                  <TableCell>LG</TableCell>
                  <TableCell>Fresh</TableCell>
                  <TableCell>Flag</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {detailRecords.map((r, i) => {
                  const isCopy = i > 0 &&
                    r.samsung === detailRecords[i-1].samsung &&
                    r.lg === detailRecords[i-1].lg &&
                    r.fresh === detailRecords[i-1].fresh &&
                    r.avTotal === detailRecords[i-1].avTotal &&
                    r.refTotal === detailRecords[i-1].refTotal &&
                    r.wmTotal === detailRecords[i-1].wmTotal;
                  const isFaulty = r.samsung === null && (r.lg > 0 || r.fresh > 0);
                  return (
                    <TableRow key={i}>
                      <TableCell>{r.day}</TableCell>
                      <TableCell>{r.samsung ?? '—'}</TableCell>
                      <TableCell>{r.lg ?? '—'}</TableCell>
                      <TableCell>{r.fresh ?? '—'}</TableCell>
                      <TableCell>
                        {isFaulty && 'Faulty'}
                        {isCopy && 'Copy-Paste'}
                        {!isFaulty && !isCopy && '—'}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
    </div>
  );
}
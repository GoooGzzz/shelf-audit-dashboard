'use client';

import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { AlertOctagon, Copy, MapPin, FileWarning, Target, Users } from 'lucide-react';

// PASTE FULL CSV FROM FILE
const csvContent = `Week#,Day#,Emp Code,Emp Name,Title Name,Shop Code,Shop Name,Shelf Share,Shelf Share,Shelf Share,AV,AV,AV...
W43,10/21,A-1382,Ahmed Fathy Ahmed Abd El Mageed,Merchandiser,S-12725-001,Gresh Center (Ismailia),11,8,5,,2,,,4...
... (full CSV content as provided)
`;

// CSV PARSER — extracts AV, REF, WM from cols 7,8,9
function parseRawData(csv) {
  const lines = csv.trim().split('\n');
  const rows = lines.slice(1).map(line => line.split(','));
  return rows
    .filter(row => row.length > 9 && row[0].startsWith('W'))
    .map(row => ({
      week: row[0],
      day: row[1],
      empCode: row[2],
      empName: row[3],
      title: row[4],
      shopCode: row[5],
      shopName: row[6],
      av: row[7] === '' ? null : Number(row[7]),
      ref: row[8] === '' ? null : Number(row[8]),
      wm: row[9] === '' ? null : Number(row[9]),
      fullDate: new Date(`2025-${row[1].replace('/', '-')}`) // assumes 2025
    }));
}

const rawData = parseRawData(csvContent);

// FRAUD ANALYSIS ENGINE
const useFraudAnalysis = (data) => {
  return useMemo(() => {
    const results = {
      impossibleVisits: [],      // Same day, >1 shop
      duplicatePatterns: [],     // Identical (av,ref,wm) ≥3 times per shop
      missingDataPatterns: [],   // Strategic AV omission
      statisticalOutliers: [],   // AV far from mean
      tooConsistent: [],         // Zero variance in AV across visits
      geographicFlags: []        // Not implemented (needs lat/long)
    };

    // 1. IMPOSSIBLE VISITS: same day, multiple shops
    const visitsByEmpDay = {};
    data.forEach(r => {
      const key = `${r.empCode}-${r.day}`;
      if (!visitsByEmpDay[key]) visitsByEmpDay[key] = [];
      visitsByEmpDay[key].push(r);
    });
    Object.values(visitsByEmpDay).forEach(visits => {
      if (visits.length > 1 && new Set(visits.map(v => v.shopCode)).size > 1) {
        results.impossibleVisits.push({
          empCode: visits[0].empCode,
          empName: visits[0].empName,
          day: visits[0].day,
          shopCount: new Set(visits.map(v => v.shopCode)).size,
          severity: 'CRITICAL'
        });
      }
    });

    // 2. DUPLICATE PATTERNS (copy-paste)
    const shopVisitGroups = {};
    data.forEach(r => {
      const key = `${r.empCode}-${r.shopCode}`;
      if (!shopVisitGroups[key]) shopVisitGroups[key] = [];
      if (r.av !== null) shopVisitGroups[key].push(r);
    });
    Object.entries(shopVisitGroups).forEach(([key, visits]) => {
      if (visits.length >= 3) {
        const sigs = visits.map(v => `${v.av}-${v.ref}-${v.wm}`);
        const uniqueSigs = new Set(sigs);
        if (uniqueSigs.size === 1 && sigs[0] !== 'null-null-null') {
          results.duplicatePatterns.push({
            empCode: visits[0].empCode,
            empName: visits[0].empName,
            shopName: visits[0].shopName,
            pattern: sigs[0],
            count: visits.length,
            severity: 'HIGH'
          });
        }
      }
    });

    // 3. STRATEGIC MISSING DATA (AV null while REF/WM present)
    const missingPatterns = {};
    data.forEach(r => {
      if (!missingPatterns[r.empCode]) {
        missingPatterns[r.empCode] = { name: r.empName, total: 0, avMissing: 0 };
      }
      const rec = missingPatterns[r.empCode];
      rec.total++;
      if (r.av === null && (r.ref !== null || r.wm !== null)) rec.avMissing++;
    });
    Object.entries(missingPatterns).forEach(([code, rec]) => {
      if (rec.total >= 5 && rec.avMissing / rec.total > 0.4) {
        results.missingDataPatterns.push({
          empCode: code,
          empName: rec.name,
          missingRate: ((rec.avMissing / rec.total) * 100).toFixed(1),
          severity: 'MEDIUM'
        });
      }
    });

    // 4. STATISTICAL OUTLIERS (AV only)
    const avValid = data.filter(r => r.av !== null).map(r => r.av);
    if (avValid.length > 2) {
      const mean = avValid.reduce((a, b) => a + b, 0) / avValid.length;
      const variance = avValid.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / avValid.length;
      const stdDev = Math.sqrt(variance);
      if (stdDev > 0) {
        data.forEach(r => {
          if (r.av !== null && Math.abs(r.av - mean) > 2 * stdDev) {
            results.statisticalOutliers.push({
              empCode: r.empCode,
              empName: r.empName,
              shopName: r.shopName,
              av: r.av,
              zScore: ((r.av - mean) / stdDev).toFixed(2),
              severity: r.av > mean ? 'HIGH' : 'LOW'
            });
          }
        });
      }
    }

    // 5. TOO CONSISTENT (low variance + high value)
    Object.entries(shopVisitGroups).forEach(([key, visits]) => {
      if (visits.length >= 3) {
        const avs = visits.map(v => v.av).filter(v => v !== null);
        if (avs.length >= 3) {
          const meanAv = avs.reduce((a, b) => a + b, 0) / avs.length;
          const variance = avs.reduce((sum, val) => sum + Math.pow(val - meanAv, 2), 0) / avs.length;
          if (variance < 0.1 && meanAv >= 5) {
            results.tooConsistent.push({
              empCode: visits[0].empCode,
              empName: visits[0].empName,
              shopName: visits[0].shopName,
              avgAv: meanAv.toFixed(1),
              visits: avs.length,
              severity: 'MEDIUM'
            });
          }
        }
      }
    });

    return results;
  }, [data]);
};

// AGGREGATE RISK SCORE
const useFraudScores = (analysis) => {
  return useMemo(() => {
    const scoreMap = new Map();

    const addScore = (empCode, empName, points, reason) => {
      if (!scoreMap.has(empCode)) {
        scoreMap.set(empCode, { empCode, empName, score: 0, reasons: [] });
      }
      const rec = scoreMap.get(empCode);
      rec.score += points;
      rec.reasons.push(reason);
    };

    analysis.impossibleVisits.forEach(f => addScore(f.empCode, f.empName, 100, 'Impossible Visits'));
    analysis.duplicatePatterns.forEach(f => addScore(f.empCode, f.empName, 60, 'Copy-Paste Data'));
    analysis.missingDataPatterns.forEach(f => addScore(f.empCode, f.empName, 30, 'Strategic Missing AV'));
    analysis.tooConsistent.forEach(f => addScore(f.empCode, f.empName, 25, 'Suspicious Consistency'));
    analysis.statisticalOutliers.forEach(f => addScore(f.empCode, f.empName, 20, 'AV Outlier'));

    return Array.from(scoreMap.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }, [analysis]);
};

export default function SamsungFraudDetection() {
  const analysis = useFraudAnalysis(rawData);
  const scores = useFraudScores(analysis);
  const [tab, setTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'duplicates', label: 'Copy-Paste Fraud' },
    { id: 'impossible', label: 'Impossible Visits' },
    { id: 'missing', label: 'Missing Data' },
    { id: 'outliers', label: 'Outliers' }
  ];

  const renderTable = (items, columns) => (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="border-b border-gray-700">
          <tr>{columns.map(col => <th key={col.key} className="text-left p-3">{col.header}</th>)}</tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i} className="border-b border-gray-800 hover:bg-gray-900/50">
              {columns.map(col => <td key={col.key} className="p-3">{col.render ? col.render(item) : item[col.key]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
      {items.length === 0 && <p className="text-gray-500 p-4 text-center">No issues detected.</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <AlertOctagon className="text-red-500" /> Samsung Fraud Detection Dashboard
          </h1>
          <p className="text-gray-400">Weeks 43–45 • {rawData.length} records analyzed</p>
        </header>

        {/* Risk Score Top 10 */}
        <div className="bg-gray-900 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Users /> Top Fraud Risk Employees
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={scores}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="empName" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="score" fill="#ef4444">
                {scores.map((entry, i) => (
                  <Cell key={i} fill={entry.score > 80 ? '#dc2626' : entry.score > 50 ? '#f97316' : '#fbbf24'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {tabs.map(tabItem => (
            <button
              key={tabItem.id}
              onClick={() => setTab(tabItem.id)}
              className={`px-4 py-2 rounded whitespace-nowrap ${tab === tabItem.id ? 'bg-red-600' : 'bg-gray-800'}`}
            >
              {tabItem.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {tab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: 'Impossible Visits', value: analysis.impossibleVisits.length, icon: MapPin },
              { label: 'Copy-Paste Patterns', value: analysis.duplicatePatterns.length, icon: Copy },
              { label: 'Missing AV Data', value: analysis.missingDataPatterns.length, icon: FileWarning },
              { label: 'Statistical Outliers', value: analysis.statisticalOutliers.length, icon: Target }
            ].map((item, i) => (
              <div key={i} className="bg-gray-900 p-4 rounded-lg">
                <item.icon className="w-6 h-6 text-red-500 mb-2" />
                <p className="text-2xl font-bold">{item.value}</p>
                <p className="text-sm text-gray-400">{item.label}</p>
              </div>
            ))}
          </div>
        )}

        {tab === 'duplicates' && renderTable(analysis.duplicatePatterns, [
          { key: 'empName', header: 'Employee' },
          { key: 'shopName', header: 'Shop' },
          { key: 'pattern', header: 'Data Pattern (AV-REF-WM)' },
          { key: 'count', header: 'Repetitions' }
        ])}

        {tab === 'impossible' && renderTable(analysis.impossibleVisits, [
          { key: 'empName', header: 'Employee' },
          { key: 'day', header: 'Date' },
          { key: 'shopCount', header: 'Shops Visited' }
        ])}

        {tab === 'missing' && renderTable(analysis.missingDataPatterns, [
          { key: 'empName', header: 'Employee' },
          { key: 'missingRate', header: 'AV Missing Rate (%)' }
        ])}

        {tab === 'outliers' && renderTable(analysis.statisticalOutliers, [
          { key: 'empName', header: 'Employee' },
          { key: 'shopName', header: 'Shop' },
          { key: 'av', header: 'AV Value' },
          { key: 'zScore', header: 'Z-Score' }
        ])}

        <p className="text-xs text-gray-500 mt-8">
          Note: Geographic impossibility analysis requires store coordinates (not available in dataset).
        </p>
      </div>
    </div>
  );
}
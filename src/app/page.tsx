'use client';

import React, { useState, useMemo } from 'react';
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { motion } from 'framer-motion';
import { 
  TrendingDown, AlertTriangle, Award, Shield, Zap, ChevronRight,
  AlertOctagon, FileWarning, MapPin, Clock, Copy, Target, Users
} from 'lucide-react';

// Parse the full CSV data
const rawData = [
  { week: "W43", day: "10/21", empCode: "A-1382", empName: "Ahmed Fathy Ahmed Abd El Mageed", title: "Merchandiser", shopCode: "S-12725-001", shopName: "Gresh Center (Ismailia)", av: 11, ref: 8, wm: 5 },
  { week: "W43", day: "10/23", empCode: "A-1382", empName: "Ahmed Fathy Ahmed Abd El Mageed", title: "Merchandiser", shopCode: "S-12725-001", shopName: "Gresh Center (Ismailia)", av: 11, ref: 8, wm: 5 },
  { week: "W44", day: "10/25", empCode: "A-1382", empName: "Ahmed Fathy Ahmed Abd El Mageed", title: "Merchandiser", shopCode: "S-12725-001", shopName: "Gresh Center (Ismailia)", av: 11, ref: 8, wm: 5 },
  { week: "W44", day: "10/28", empCode: "A-1382", empName: "Ahmed Fathy Ahmed Abd El Mageed", title: "Merchandiser", shopCode: "S-12725-001", shopName: "Gresh Center (Ismailia)", av: 11, ref: 8, wm: 5 },
  { week: "W44", day: "10/30", empCode: "A-1382", empName: "Ahmed Fathy Ahmed Abd El Mageed", title: "Merchandiser", shopCode: "S-12725-001", shopName: "Gresh Center (Ismailia)", av: null, ref: 8, wm: 5 },
  { week: "W45", day: "11/2", empCode: "A-1382", empName: "Ahmed Fathy Ahmed Abd El Mageed", title: "Merchandiser", shopCode: "S-12725-001", shopName: "Gresh Center (Ismailia)", av: null, ref: 8, wm: 5 },
  { week: "W45", day: "11/6", empCode: "A-1382", empName: "Ahmed Fathy Ahmed Abd El Mageed", title: "Merchandiser", shopCode: "S-12725-001", shopName: "Gresh Center (Ismailia)", av: null, ref: 8, wm: 5 },
  { week: "W43", day: "10/20", empCode: "A-1888", empName: "Ahmed Ali Ahmed Abd El Mageed Ramadan", title: "Merchandiser", shopCode: "S-12677-001", shopName: "Abo Yousef (Talkha)", av: 4, ref: 11, wm: 6 },
  { week: "W43", day: "10/22", empCode: "A-1888", empName: "Ahmed Ali Ahmed Abd El Mageed Ramadan", title: "Merchandiser", shopCode: "S-12677-001", shopName: "Abo Yousef (Talkha)", av: 4, ref: 11, wm: 6 },
  { week: "W44", day: "10/27", empCode: "A-1888", empName: "Ahmed Ali Ahmed Abd El Mageed Ramadan", title: "Merchandiser", shopCode: "S-12677-001", shopName: "Abo Yousef (Talkha)", av: 4, ref: 12, wm: 6 },
  { week: "W44", day: "10/29", empCode: "A-1888", empName: "Ahmed Ali Ahmed Abd El Mageed Ramadan", title: "Merchandiser", shopCode: "S-12677-001", shopName: "Abo Yousef (Talkha)", av: null, ref: 12, wm: 6 },
  { week: "W45", day: "11/3", empCode: "A-1888", empName: "Ahmed Ali Ahmed Abd El Mageed Ramadan", title: "Merchandiser", shopCode: "S-12677-001", shopName: "Abo Yousef (Talkha)", av: null, ref: 12, wm: 6 },
  { week: "W45", day: "11/6", empCode: "A-1888", empName: "Ahmed Ali Ahmed Abd El Mageed Ramadan", title: "Merchandiser", shopCode: "S-12677-001", shopName: "Abo Yousef (Talkha)", av: null, ref: 12, wm: 6 },
  { week: "W43", day: "10/21", empCode: "A-2087", empName: "Ahmed Alaa El Deen Ahmed Abd El Aziz", title: "Merchandiser", shopCode: "S-12679-001", shopName: "Abo El Dahab (Bani Sweif)", av: 3, ref: 6, wm: 5 },
  { week: "W44", day: "10/25", empCode: "A-2087", empName: "Ahmed Alaa El Deen Ahmed Abd El Aziz", title: "Merchandiser", shopCode: "S-12679-001", shopName: "Abo El Dahab (Bani Sweif)", av: 3, ref: 10, wm: 3 },
  { week: "W44", day: "10/28", empCode: "A-2087", empName: "Ahmed Alaa El Deen Ahmed Abd El Aziz", title: "Merchandiser", shopCode: "S-12679-001", shopName: "Abo El Dahab (Bani Sweif)", av: 3, ref: 12, wm: 4 },
  { week: "W45", day: "11/2", empCode: "A-2087", empName: "Ahmed Alaa El Deen Ahmed Abd El Aziz", title: "Merchandiser", shopCode: "S-12679-001", shopName: "Abo El Dahab (Bani Sweif)", av: null, ref: 7, wm: 3 },
  { week: "W43", day: "10/20", empCode: "A-1382", empName: "Ahmed Fathy Ahmed Abd El Mageed", title: "Merchandiser", shopCode: "S-1003-001", shopName: "Emad El Den (Ismailia)", av: 21, ref: 12, wm: 8 },
  { week: "W44", day: "10/27", empCode: "A-1382", empName: "Ahmed Fathy Ahmed Abd El Mageed", title: "Merchandiser", shopCode: "S-1003-001", shopName: "Emad El Den (Ismailia)", av: 21, ref: 12, wm: 8 },
  { week: "W45", day: "11/4", empCode: "A-1382", empName: "Ahmed Fathy Ahmed Abd El Mageed", title: "Merchandiser", shopCode: "S-1003-001", shopName: "Emad El Den (Ismailia)", av: null, ref: 12, wm: 8 },
  { week: "W43", day: "10/20", empCode: "A-1382", empName: "Ahmed Fathy Ahmed Abd El Mageed", title: "Merchandiser", shopCode: "S-1021-001", shopName: "Grand Home", av: 19, ref: 19, wm: 10 },
  { week: "W43", day: "10/22", empCode: "A-1382", empName: "Ahmed Fathy Ahmed Abd El Mageed", title: "Merchandiser", shopCode: "S-1021-001", shopName: "Grand Home", av: 19, ref: 19, wm: 10 },
  { week: "W44", day: "10/27", empCode: "A-1382", empName: "Ahmed Fathy Ahmed Abd El Mageed", title: "Merchandiser", shopCode: "S-1021-001", shopName: "Grand Home", av: 19, ref: 19, wm: 10 },
  { week: "W44", day: "10/29", empCode: "A-1382", empName: "Ahmed Fathy Ahmed Abd El Mageed", title: "Merchandiser", shopCode: "S-1021-001", shopName: "Grand Home", av: null, ref: 19, wm: 10 },
  { week: "W45", day: "11/4", empCode: "A-1382", empName: "Ahmed Fathy Ahmed Abd El Mageed", title: "Merchandiser", shopCode: "S-1021-001", shopName: "Grand Home", av: null, ref: 19, wm: 10 },
  // Adding more diverse data for better detection
  { week: "W43", day: "10/20", empCode: "A-1835", empName: "Ahmed Mohamed Magdy Taha", title: "Supervisor", shopCode: "S-12735-001", shopName: "Awlad Abo Zied (Minya)", av: 3, ref: 6, wm: 2 },
  { week: "W45", day: "11/4", empCode: "A-1835", empName: "Ahmed Mohamed Magdy Taha", title: "Supervisor", shopCode: "S-12735-001", shopName: "Awlad Abo Zied (Minya)", av: null, ref: 3, wm: 2 },
  { week: "W43", day: "10/22", empCode: "A-2259", empName: "Ahmed Farouk Ahmed El Sayed", title: "Promoter", shopCode: "S-4682-093", shopName: "Raya (Tagmoa)", av: 52, ref: 3, wm: 3 },
  { week: "W43", day: "10/23", empCode: "A-2259", empName: "Ahmed Farouk Ahmed El Sayed", title: "Promoter", shopCode: "S-4682-093", shopName: "Raya (Tagmoa)", av: 52, ref: 3, wm: 3 },
  { week: "W43", day: "10/24", empCode: "A-2259", empName: "Ahmed Farouk Ahmed El Sayed", title: "Promoter", shopCode: "S-4682-093", shopName: "Raya (Tagmoa)", av: 52, ref: 3, wm: 3 },
  { week: "W44", day: "10/25", empCode: "A-2259", empName: "Ahmed Farouk Ahmed El Sayed", title: "Promoter", shopCode: "S-4682-093", shopName: "Raya (Tagmoa)", av: 52, ref: 3, wm: 3 },
];

export default function SamsungFraudDetection() {
  const [tab, setTab] = useState('fraud-overview');

  // FRAUD DETECTION ALGORITHMS
  const fraudAnalysis = useMemo(() => {
    const results = {
      duplicateData: [],
      impossibleVisits: [],
      suspiciousPatterns: [],
      dataConsistency: [],
      outliers: []
    };

    // 1. DUPLICATE/COPY-PASTE DETECTION
    const dataSignatures = new Map();
    rawData.forEach(row => {
      const signature = `${row.av}-${row.ref}-${row.wm}`;
      const key = `${row.empCode}-${row.shopCode}`;
      
      if (!dataSignatures.has(key)) {
        dataSignatures.set(key, { signatures: [], rows: [] });
      }
      dataSignatures.get(key).signatures.push(signature);
      dataSignatures.get(key).rows.push(row);
    });

    dataSignatures.forEach((value, key) => {
      const identicalCount = value.signatures.filter(s => s === value.signatures[0]).length;
      if (identicalCount >= 3 && identicalCount === value.signatures.length) {
        results.duplicateData.push({
          empCode: value.rows[0].empCode,
          empName: value.rows[0].empName,
          shopName: value.rows[0].shopName,
          pattern: value.signatures[0],
          occurrences: identicalCount,
          severity: 'HIGH'
        });
      }
    });

    // 2. IMPOSSIBLE MULTI-LOCATION VISITS (Same Day)
    const visitsByDay = new Map();
    rawData.forEach(row => {
      const key = `${row.empCode}-${row.day}`;
      if (!visitsByDay.has(key)) {
        visitsByDay.set(key, []);
      }
      visitsByDay.get(key).push(row);
    });

    visitsByDay.forEach((visits, key) => {
      if (visits.length > 1) {
        const uniqueLocations = new Set(visits.map(v => v.shopName)).size;
        if (uniqueLocations > 1) {
          results.impossibleVisits.push({
            empCode: visits[0].empCode,
            empName: visits[0].empName,
            day: visits[0].day,
            locations: visits.map(v => v.shopName),
            severity: 'CRITICAL'
          });
        }
      }
    });

    // 3. SUSPICIOUS NULL PATTERNS (Strategic Missing Data)
    const nullPatterns = new Map();
    rawData.forEach(row => {
      if (!nullPatterns.has(row.empCode)) {
        nullPatterns.set(row.empCode, { name: row.empName, nulls: 0, total: 0 });
      }
      const emp = nullPatterns.get(row.empCode);
      emp.total++;
      if (row.av === null) emp.nulls++;
    });

    nullPatterns.forEach((value, empCode) => {
      const nullRate = value.nulls / value.total;
      if (nullRate > 0.4 && value.total >= 5) {
        results.suspiciousPatterns.push({
          empCode,
          empName: value.name,
          nullRate: (nullRate * 100).toFixed(1),
          description: 'High rate of missing AV data',
          severity: 'MEDIUM'
        });
      }
    });

    // 4. STATISTICAL OUTLIERS
    const avValues = rawData.filter(r => r.av !== null).map(r => r.av);
    const mean = avValues.reduce((a, b) => a + b, 0) / avValues.length;
    const stdDev = Math.sqrt(avValues.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / avValues.length);
    
    rawData.forEach(row => {
      if (row.av !== null && Math.abs(row.av - mean) > 2 * stdDev) {
        results.outliers.push({
          empCode: row.empCode,
          empName: row.empName,
          shopName: row.shopName,
          av: row.av,
          deviation: ((row.av - mean) / stdDev).toFixed(2),
          severity: row.av > mean + 2 * stdDev ? 'HIGH' : 'LOW'
        });
      }
    });

    // 5. PERFECT CONSISTENCY (Too Perfect = Suspicious)
    const consistencyCheck = new Map();
    rawData.forEach(row => {
      const key = `${row.empCode}-${row.shopCode}`;
      if (!consistencyCheck.has(key)) {
        consistencyCheck.set(key, { values: [], info: row });
      }
      if (row.av !== null) {
        consistencyCheck.get(key).values.push(row.av);
      }
    });

    consistencyCheck.forEach((value, key) => {
      if (value.values.length >= 3) {
        const variance = value.values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / value.values.length;
        if (variance < 0.1 && value.values[0] > 5) {
          results.dataConsistency.push({
            empCode: value.info.empCode,
            empName: value.info.empName,
            shopName: value.info.shopName,
            avgValue: value.values[0],
            visits: value.values.length,
            description: 'Suspiciously consistent values',
            severity: 'MEDIUM'
          });
        }
      }
    });

    return results;
  }, []);

  const fraudScore = useMemo(() => {
    const scores = new Map();
    
    fraudAnalysis.duplicateData.forEach(f => {
      if (!scores.has(f.empCode)) scores.set(f.empCode, { name: f.empName, score: 0, issues: [] });
      scores.get(f.empCode).score += 50;
      scores.get(f.empCode).issues.push('Duplicate Data');
    });

    fraudAnalysis.impossibleVisits.forEach(f => {
      if (!scores.has(f.empCode)) scores.set(f.empCode, { name: f.empName, score: 0, issues: [] });
      scores.get(f.empCode).score += 100;
      scores.get(f.empCode).issues.push('Impossible Visits');
    });

    fraudAnalysis.suspiciousPatterns.forEach(f => {
      if (!scores.has(f.empCode)) scores.set(f.empCode, { name: f.empName, score: 0, issues: [] });
      scores.get(f.empCode).score += 30;
      scores.get(f.empCode).issues.push('Suspicious Patterns');
    });

    return Array.from(scores.entries())
      .map(([empCode, data]) => ({ empCode, ...data }))
      .sort((a, b) => b.score - a.score);
  }, [fraudAnalysis]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950 to-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-xl border-b-4 border-red-600">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <AlertOctagon className="w-12 h-12 text-red-500" />
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                  FRAUD DETECTION SYSTEM
                </h1>
                <p className="text-sm text-gray-400">Samsung CE Audit Intelligence</p>
              </div>
            </div>
            <div className="bg-red-600 px-6 py-3 rounded-xl">
              <p className="text-2xl font-bold">{fraudScore.length} SUSPECTS</p>
            </div>
          </div>
          
          <nav className="flex gap-2 mt-4 overflow-x-auto">
            {['fraud-overview', 'duplicates', 'impossible-visits', 'patterns', 'outliers'].map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-6 py-2 rounded-lg font-bold whitespace-nowrap ${tab === t ? 'bg-red-600' : 'bg-white/10'}`}
              >
                {t.toUpperCase().replace('-', ' ')}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* FRAUD OVERVIEW */}
        {tab === 'fraud-overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <motion.div className="bg-gradient-to-br from-red-900 to-red-700 rounded-2xl p-6 border-2 border-red-500">
                <Copy className="w-10 h-10 mb-2 text-red-300" />
                <p className="text-4xl font-black">{fraudAnalysis.duplicateData.length}</p>
                <p className="text-sm text-red-200">Duplicate Data Cases</p>
              </motion.div>
              
              <motion.div className="bg-gradient-to-br from-orange-900 to-orange-700 rounded-2xl p-6 border-2 border-orange-500">
                <MapPin className="w-10 h-10 mb-2 text-orange-300" />
                <p className="text-4xl font-black">{fraudAnalysis.impossibleVisits.length}</p>
                <p className="text-sm text-orange-200">Impossible Visits</p>
              </motion.div>
              
              <motion.div className="bg-gradient-to-br from-yellow-900 to-yellow-700 rounded-2xl p-6 border-2 border-yellow-500">
                <FileWarning className="w-10 h-10 mb-2 text-yellow-300" />
                <p className="text-4xl font-black">{fraudAnalysis.suspiciousPatterns.length}</p>
                <p className="text-sm text-yellow-200">Suspicious Patterns</p>
              </motion.div>
              
              <motion.div className="bg-gradient-to-br from-purple-900 to-purple-700 rounded-2xl p-6 border-2 border-purple-500">
                <Target className="w-10 h-10 mb-2 text-purple-300" />
                <p className="text-4xl font-black">{fraudAnalysis.outliers.length}</p>
                <p className="text-sm text-purple-200">Statistical Outliers</p>
              </motion.div>
            </div>

            <div className="bg-gradient-to-br from-black to-red-950 rounded-3xl p-8 border-4 border-red-600">
              <h2 className="text-3xl font-black mb-6 flex items-center gap-3">
                <Users className="w-8 h-8" />
                TOP FRAUD SUSPECTS (Risk Score)
              </h2>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={fraudScore.slice(0, 10)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={150} tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ background: '#000', border: '2px solid #ef4444' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload[0]) {
                        return (
                          <div className="bg-black border-2 border-red-500 p-4 rounded-lg">
                            <p className="font-bold">{payload[0].payload.name}</p>
                            <p className="text-red-400">Risk Score: {payload[0].value}</p>
                            <p className="text-sm text-gray-400">Issues: {payload[0].payload.issues.join(', ')}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="score" fill="#ef4444">
                    {fraudScore.slice(0, 10).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.score > 80 ? '#dc2626' : entry.score > 50 ? '#f97316' : '#fbbf24'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* DUPLICATE DATA TAB */}
        {tab === 'duplicates' && (
          <div className="bg-black/80 rounded-3xl p-8 border-2 border-red-500">
            <h2 className="text-3xl font-black mb-6 flex items-center gap-3">
              <Copy className="w-8 h-8 text-red-500" />
              COPY-PASTE FRAUD DETECTION
            </h2>
            <p className="text-gray-400 mb-6">Identical data repeated 3+ times = Copy/Paste fraud</p>
            <div className="space-y-4">
              {fraudAnalysis.duplicateData.map((fraud, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-red-900/30 rounded-xl p-6 border-2 border-red-500"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-2xl font-bold text-red-400">{fraud.empName}</p>
                      <p className="text-gray-400">{fraud.empCode} • {fraud.shopName}</p>
                      <p className="text-xl mt-2">Pattern: <span className="font-mono text-yellow-400">{fraud.pattern}</span></p>
                      <p className="text-sm text-red-300">Repeated {fraud.occurrences} times</p>
                    </div>
                    <div className="bg-red-600 px-4 py-2 rounded-lg">
                      <p className="font-bold">{fraud.severity}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* IMPOSSIBLE VISITS TAB */}
        {tab === 'impossible-visits' && (
          <div className="bg-black/80 rounded-3xl p-8 border-2 border-orange-500">
            <h2 className="text-3xl font-black mb-6 flex items-center gap-3">
              <MapPin className="w-8 h-8 text-orange-500" />
              IMPOSSIBLE MULTI-LOCATION VISITS
            </h2>
            <p className="text-gray-400 mb-6">Same person, multiple locations, same day = Physically impossible</p>
            <div className="space-y-4">
              {fraudAnalysis.impossibleVisits.map((fraud, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-orange-900/30 rounded-xl p-6 border-2 border-orange-500"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-2xl font-bold text-orange-400">{fraud.empName}</p>
                      <p className="text-gray-400">{fraud.empCode} • {fraud.day}</p>
                      <div className="mt-3">
                        <p className="text-sm text-gray-400 mb-2">Claimed visits to:</p>
                        {fraud.locations.map((loc, j) => (
                          <p key={j} className="text-lg ml-4 flex items-center gap-2">
                            <ChevronRight className="w-4 h-4" />
                            {loc}
                          </p>
                        ))}
                      </div>
                    </div>
                    <div className="bg-orange-600 px-4 py-2 rounded-lg">
                      <p className="font-bold">{fraud.severity}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* SUSPICIOUS PATTERNS TAB */}
        {tab === 'patterns' && (
          <div className="bg-black/80 rounded-3xl p-8 border-2 border-yellow-500">
            <h2 className="text-3xl font-black mb-6 flex items-center gap-3">
              <FileWarning className="w-8 h-8 text-yellow-500" />
              SUSPICIOUS PATTERNS
            </h2>
            <p className="text-gray-400 mb-6">Strategic data omissions and behavioral anomalies</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {fraudAnalysis.suspiciousPatterns.map((fraud, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-yellow-900/20 rounded-xl p-6 border-2 border-yellow-500"
                >
                  <p className="text-xl font-bold text-yellow-400">{fraud.empName}</p>
                  <p className="text-gray-400 text-sm">{fraud.empCode}</p>
                  <p className="text-3xl font-black text-red-400 mt-2">{fraud.nullRate}%</p>
                  <p className="text-sm text-gray-300">{fraud.description}</p>
                  <div className="mt-3 bg-yellow-600/30 px-3 py-1 rounded inline-block">
                    <p className="text-xs font-bold">{fraud.severity
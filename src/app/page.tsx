'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area,
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell, RadarChart, PolarGrid, PolarAngleAxis, 
  PolarRadiusAxis, Radar
} from 'recharts';

// Icon components
const AlertTriangle = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3.05h16.94a2 2 0 0 0 1.71-3.05L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const Users = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const Upload = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);

const CheckCircle = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const Shield = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const Zap = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

const Eye = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);

const TrendingUp = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 17"/><polyline points="17 6 23 6 23 12"/>
  </svg>
);

const DataIntegrityDashboard = () => {
  const [data, setData] = useState<any[]>([]);
  const [violations, setViolations] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [filteredViolations, setFilteredViolations] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [filterType, setFilterType] = useState('all');
  const [selectedTitle, setSelectedTitle] = useState('all');
  const [fileLoaded, setFileLoaded] = useState(false);
  const [loadMessage, setLoadMessage] = useState('');

  const parseCSV = (csvText: string) => {
    const lines = csvText.trim().split('\n');
    return lines.slice(2).map((line) => {
      const values = line.split(',');
      if (!values[0]) return null;

      const avBrands = values.slice(10, 39).map((v) => parseInt(v) || 0);
      const refBrands = values.slice(39, 63).map((v) => parseInt(v) || 0);
      const wmBrands = values.slice(63, 79).map((v) => parseInt(v) || 0);

      return {
        week: values[0],
        day: values[1],
        empCode: values[2],
        empName: values[3],
        title: values[4],
        shopCode: values[5],
        shopName: values[6],
        avTotal: parseInt(values[7]) || null,
        refTotal: parseInt(values[8]) || null,
        wmTotal: parseInt(values[9]) || null,
        avBrands,
        refBrands,
        wmBrands,
        avSum: avBrands.reduce((a, b) => a + b, 0),
        refSum: refBrands.reduce((a, b) => a + b, 0),
        wmSum: wmBrands.reduce((a, b) => a + b, 0),
      };
    }).filter(Boolean);
  };

  const detectViolations = (rows: any[]) => {
    const detected: any[] = [];
    const employeeMap: any = {};

    rows.forEach((row) => {
      if (!employeeMap[row.empCode]) {
        employeeMap[row.empCode] = [];
      }
      employeeMap[row.empCode].push(row);
    });

    rows.forEach((row) => {
      if (row.avTotal === null && (row.refTotal !== null || row.wmTotal !== null)) {
        detected.push({
          type: 'MISSING_AV_DATA',
          severity: 'HIGH',
          employee: row.empName,
          empCode: row.empCode,
          title: row.title,
          shop: row.shopName,
          week: row.week,
          day: row.day,
          message: `Missing AV data but REF=${row.refTotal}, WM=${row.wmTotal}`,
        });
      }
    });

    Object.keys(employeeMap).forEach((empCode) => {
      const entries = employeeMap[empCode];
      entries.forEach((entry: any, i: number) => {
        for (let j = i + 1; j < Math.min(i + 5, entries.length); j++) {
          const current = entries[i];
          const next = entries[j];

          if (
            current.shopCode === next.shopCode &&
            current.avTotal === next.avTotal &&
            current.refTotal === next.refTotal &&
            current.wmTotal === next.wmTotal
          ) {
            detected.push({
              type: 'COPY_PASTE_VIOLATION',
              severity: 'CRITICAL',
              employee: current.empName,
              empCode: current.empCode,
              title: current.title,
              shop: current.shopName,
              week: `${current.week} & ${next.week}`,
              day: current.day,
              message: `Identical data: AV=${current.avTotal}, REF=${current.refTotal}, WM=${current.wmTotal}`,
            });
            break;
          }
        }
      });
    });

    rows.forEach((row) => {
      if (row.avTotal === 0 && row.refTotal === 0 && row.wmTotal === 0) {
        detected.push({
          type: 'ALL_ZEROS_VIOLATION',
          severity: 'CRITICAL',
          employee: row.empName,
          empCode: row.empCode,
          title: row.title,
          shop: row.shopName,
          week: row.week,
          day: row.day,
          message: 'Suspicious: All shelf values = 0',
        });
      }
    });

    rows.forEach((row) => {
      if (row.avTotal !== null && Math.abs(row.avTotal - row.avSum) > 1) {
        detected.push({
          type: 'MATH_INCONSISTENCY',
          severity: 'HIGH',
          employee: row.empName,
          empCode: row.empCode,
          title: row.title,
          shop: row.shopName,
          week: row.week,
          day: row.day,
          message: `AV Total=${row.avTotal} ≠ brands (${row.avSum})`,
        });
      }
    });

    return detected;
  };

  const calculateStats = (rows: any[], violations: any[]) => {
    const titleGroups: any = {};
    const employeeScores: any = {};

    violations.forEach((v) => {
      if (!titleGroups[v.title]) {
        titleGroups[v.title] = { critical: 0, high: 0, total: 0 };
      }
      titleGroups[v.title][v.severity.toLowerCase()]++;
      titleGroups[v.title].total++;

      if (!employeeScores[v.empCode]) {
        employeeScores[v.empCode] = {
          name: v.employee,
          title: v.title,
          critical: 0,
          high: 0,
          total: 0,
          issues: {},
        };
      }
      employeeScores[v.empCode][v.severity.toLowerCase()]++;
      employeeScores[v.empCode].total++;
      employeeScores[v.empCode].issues[v.type] =
        (employeeScores[v.empCode].issues[v.type] || 0) + 1;
    });

    return {
      totalAudits: rows.length,
      criticalViolations: violations.filter((a: any) => a.severity === 'CRITICAL').length,
      highViolations: violations.filter((a: any) => a.severity === 'HIGH').length,
      affectedEmployees: new Set(violations.map((a: any) => a.empCode)).size,
      titleGroups,
      employeeScores: Object.entries(employeeScores)
        .map(([code, info]: [string, any]) => ({ code, ...(info as any) }))
        .sort((a: any, b: any) => b.total - a.total),
      issueDistribution: [
        { name: 'Copy-Paste', value: violations.filter((a: any) => a.type === 'COPY_PASTE_VIOLATION').length },
        { name: 'All-Zeros', value: violations.filter((a: any) => a.type === 'ALL_ZEROS_VIOLATION').length },
        { name: 'Missing AV', value: violations.filter((a: any) => a.type === 'MISSING_AV_DATA').length },
        { name: 'Math Error', value: violations.filter((a: any) => a.type === 'MATH_INCONSISTENCY').length },
      ],
      weeklyTrend: generateWeeklyTrend(violations),
    };
  };

  const generateWeeklyTrend = (violations: any[]) => {
    const trends: any = {};
    violations.forEach((v) => {
      if (!trends[v.week]) {
        trends[v.week] = { week: v.week, issues: 0 };
      }
      trends[v.week].issues++;
    });
    return Object.values(trends).sort((a: any, b: any) => a.week.localeCompare(b.week));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvContent = e.target?.result;
        if (typeof csvContent === 'string') {
          const parsed = parseCSV(csvContent);
          setData(parsed);

          const detected = detectViolations(parsed);
          setViolations(detected);
          setFilteredViolations(detected);

          const calculatedStats = calculateStats(parsed, detected);
          setStats(calculatedStats);

          setFileLoaded(true);
          setLoadMessage(`✅ Loaded ${parsed.length} records from ${file.name}`);
        }
      } catch (error) {
        setLoadMessage(`❌ Error: ${(error instanceof Error) ? error.message : 'Unknown error'}`);
      }
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    const sampleData: any[] = [
      {
        week: 'W43', day: '10/21', empCode: 'A-1382', empName: 'Ahmed Fathy', title: 'Merchandiser',
        shopCode: 'S-001', shopName: 'Gresh Center', avTotal: 11, refTotal: 8, wmTotal: 5,
        avBrands: [2,0,0,4,0,0,0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], avSum: 11,
        refBrands: [2,0,0,0,0,0,0,0,1,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0], refSum: 8,
        wmBrands: [2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], wmSum: 5,
      },
      {
        week: 'W44', day: '10/25', empCode: 'A-1382', empName: 'Ahmed Fathy', title: 'Merchandiser',
        shopCode: 'S-001', shopName: 'Gresh Center', avTotal: 11, refTotal: 8, wmTotal: 5,
        avBrands: [2,0,0,4,0,0,0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], avSum: 11,
        refBrands: [2,0,0,0,0,0,0,0,1,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0], refSum: 8,
        wmBrands: [2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], wmSum: 5,
      },
      {
        week: 'W43', day: '10/20', empCode: 'A-2259', empName: 'Ahmed Farouk', title: 'Promoter',
        shopCode: 'S-093', shopName: 'Raya', avTotal: 52, refTotal: 3, wmTotal: 3,
        avBrands: [28,16,2,0,0,0,0,0,0,0,0,0,3,0,2,0,0,1,0,0,0,3,0,0,0,0,0,0,0], avSum: 52,
        refBrands: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], refSum: 3,
        wmBrands: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], wmSum: 3,
      },
    ];

    setData(sampleData);
    const detected = detectViolations(sampleData);
    setViolations(detected);
    setFilteredViolations(detected);
    const calculatedStats = calculateStats(sampleData, detected);
    setStats(calculatedStats);
    setFileLoaded(true);
    setLoadMessage('📊 Sample data loaded');
  }, []);

  useEffect(() => {
    let filtered = violations;
    if (filterType !== 'all') {
      filtered = filtered.filter((a: any) => a.type === filterType);
    }
    if (selectedTitle !== 'all') {
      filtered = filtered.filter((a: any) => a.title === selectedTitle);
    }
    setFilteredViolations(filtered);
  }, [filterType, selectedTitle, violations]);

  const COLORS = ['#ef4444', '#f97316', '#eab308', '#3b82f6'];
  const severityColor: any = { CRITICAL: '#ef4444', HIGH: '#f59e0b' };
  const titleOptions = ['all', ...new Set(data.map((d: any) => d.title))];

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-900 text-white py-8 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-2">
            <Shield size={40} className="text-yellow-300 animate-pulse" />
            <h1 className="text-3xl sm:text-5xl font-bold">Samsung CE Audit</h1>
          </div>
          <p className="text-blue-100 text-base sm:text-lg">Advanced Data Integrity Validation System</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Section */}
        <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl p-6 sm:p-8 mb-8 border-2 border-blue-300 shadow-xl hover:shadow-2xl transition-all">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className="bg-blue-600 rounded-full p-4">
              <Upload size={32} className="text-white" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">📁 Upload CSV File</h3>
              <p className="text-gray-600 text-sm">Upload CE Shelf Share Data to detect integrity issues</p>
            </div>
            <label className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold cursor-pointer transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
              Choose File
              <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
          {loadMessage && (
            <div className="mt-4 flex items-center gap-2 text-sm font-semibold">
              {fileLoaded ? (
                <>
                  <CheckCircle size={20} className="text-green-600" />
                  <span className="text-green-700">{loadMessage}</span>
                </>
              ) : (
                <span className="text-blue-700">{loadMessage}</span>
              )}
            </div>
          )}
        </div>

        {/* Title Filter */}
        <div className="bg-white rounded-xl p-4 mb-8 shadow-lg border-l-4 border-blue-500">
          <label className="text-gray-700 font-bold mr-4 block sm:inline">👔 Filter by Title:</label>
          <select
            value={selectedTitle}
            onChange={(e) => setSelectedTitle(e.target.value)}
            className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 w-full sm:w-auto"
          >
            <option value="all">All Titles</option>
            {titleOptions.map((title: any) => (
              <option key={title} value={title}>
                {title === 'all' ? 'All' : title}
              </option>
            ))}
          </select>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Audits', value: stats.totalAudits, icon: Eye, color: 'blue', bg: 'from-blue-400 to-blue-600' },
            { label: 'Critical Issues', value: stats.criticalViolations, icon: AlertTriangle, color: 'red', bg: 'from-red-400 to-red-600' },
            { label: 'High Priority', value: stats.highViolations, icon: Zap, color: 'yellow', bg: 'from-yellow-400 to-yellow-600' },
            { label: 'Affected Employees', value: stats.affectedEmployees, icon: Users, color: 'purple', bg: 'from-purple-400 to-purple-600' },
          ].map((metric: any, idx: number) => {
            const Icon = metric.icon;
            return (
              <div
                key={idx}
                className={`bg-gradient-to-br ${metric.bg} rounded-xl p-6 text-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">{metric.label}</p>
                    <p className="text-3xl sm:text-4xl font-bold mt-2">{metric.value}</p>
                  </div>
                  <Icon size={32} className="opacity-50" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white rounded-xl p-3 shadow-lg border-b-4 border-blue-500">
          {['overview', 'employees', 'details', 'charts'].map((tab: string) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 sm:px-6 py-2 rounded-lg font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-red-500">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <AlertTriangle size={28} className="text-red-600" />
                🎯 Data Integrity Alerts
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: 'Repeated Identical Entries', desc: 'Suspicious copy-paste pattern', color: 'red' },
                  { title: 'All-Zero Submissions', desc: 'Unlikely zero-value reports', color: 'red' },
                  { title: 'Incomplete AV Data', desc: 'Missing key category values', color: 'yellow' },
                  { title: 'Arithmetic Mismatches', desc: 'Total ≠ sum of brands', color: 'yellow' },
                ].map((alert: any, idx: number) => (
                  <div key={idx} className={`bg-${alert.color}-50 rounded-lg p-4 border-l-4 border-${alert.color}-500`}>
                    <p className={`font-semibold text-${alert.color}-800`}>🔴 {alert.title}</p>
                    <p className="text-sm text-gray-600 mt-2">{alert.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">🏆 Top Employees</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.employeeScores?.slice(0, 6).map((emp: any, idx: number) => (
                  <div key={emp.code} className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg p-5 border-l-4 border-red-500 hover:shadow-lg transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <span className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">{idx + 1}</span>
                        <div>
                          <p className="font-bold text-gray-800 text-sm">{emp.name}</p>
                          <p className="text-xs text-gray-600">{emp.title}</p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-red-600">{emp.total}</span>
                    </div>
                    <div className="flex gap-2">
                      {emp.critical > 0 && <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">C: {emp.critical}</span>}
                      {emp.high > 0 && <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold">H: {emp.high}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Employees Tab */}
        {activeTab === 'employees' && (
          <div className="bg-white rounded-xl p-6 shadow-lg overflow-x-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 Employee Scores</h2>
            <table className="w-full text-left text-gray-700 text-sm">
              <thead className="bg-gradient-to-r from-blue-100 to-indigo-100 border-b-2 border-blue-300">
                <tr>
                  <th className="px-4 py-3 font-bold">Employee</th>
                  <th className="px-4 py-3 font-bold">Title</th>
                  <th className="px-4 py-3 font-bold text-center">C</th>
                  <th className="px-4 py-3 font-bold text-center">H</th>
                  <th className="px-4 py-3 font-bold text-center">Total</th>
                </tr>
              </thead>
              <tbody>
                {stats.employeeScores?.map((emp: any) => (
                  <tr key={emp.code} className="border-b hover:bg-blue-50 transition-colors">
                    <td className="px-4 py-3 font-semibold">{emp.name}</td>
                    <td className="px-4 py-3">{emp.title}</td>
                    <td className="px-4 py-3 text-center"><span className="bg-red-100 text-red-800 px-2 py-1 rounded font-bold">{emp.critical}</span></td>
                    <td className="px-4 py-3 text-center"><span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded font-bold">{emp.high}</span></td>
                    <td className="px-4 py-3 text-center"><span className="bg-red-600 text-white px-2 py-1 rounded font-bold">{emp.total}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Details Tab */}
        {activeTab === 'details' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <label className="text-gray-800 font-bold mr-4">Filter by Type:</label>
              <select
                value={filterType}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterType(e.target.value)}
                className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Issues ({violations.length})</option>
                <option value="COPY_PASTE_VIOLATION">Copy-Paste ({violations.filter((a: any) => a.type === 'COPY_PASTE_VIOLATION').length})</option>
                <option value="ALL_ZEROS_VIOLATION">All-Zeros ({violations.filter((a: any) => a.type === 'ALL_ZEROS_VIOLATION').length})</option>
                <option value="MISSING_AV_DATA">Missing AV ({violations.filter((a: any) => a.type === 'MISSING_AV_DATA').length})</option>
                <option value="MATH_INCONSISTENCY">Math Error ({violations.filter((a: any) => a.type === 'MATH_INCONSISTENCY').length})</option>
              </select>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredViolations.length > 0 ? (
                filteredViolations.map((violation: any, idx: number) => (
                  <div
                    key={idx}
                    className="bg-white rounded-lg p-4 border-l-4 shadow-md hover:shadow-lg transition-all"
                    style={{ borderColor: severityColor[violation.severity] }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-bold text-gray-800">{violation.type.replace(/_/g, ' ')}</p>
                        <p className="text-sm text-gray-600 mt-1">👤 {violation.employee} | 👔 {violation.title}</p>
                        <p className="text-sm text-gray-700">📍 {violation.shop} | 📅 {violation.week}</p>
                        <p className="text-sm text-blue-600 font-semibold mt-2">💡 {violation.message}</p>
                      </div>
                      <span style={{ backgroundColor: severityColor[violation.severity] }} className="text-white px-3 py-1 rounded text-xs font-bold whitespace-nowrap ml-4">
                        {violation.severity}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8 bg-gray-50 rounded-lg">✓ No issues found</p>
              )}
            </div>
          </div>
        )}

        {/* Charts Tab - Enhanced */}
        {activeTab === 'charts' && (
          <div className="space-y-6">
            {/* Row 1: Bar & Line Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-4">📊 Top 10 Employees</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.employeeScores?.slice(0, 10)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="code" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip contentStyle={{ backgroundColor: '#f3f4f6', border: '2px solid #3b82f6', borderRadius: '8px' }} />
                    <Bar dataKey="total" fill="#ef4444" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-4">📈 Weekly Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={stats.weeklyTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="week" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip contentStyle={{ backgroundColor: '#f3f4f6', border: '2px solid #3b82f6', borderRadius: '8px' }} />
                    <Line type="monotone" dataKey="issues" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Row 2: Pie & Area Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-4">🎯 Issue Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={stats.issueDistribution} cx="50%" cy="50%" labelLine={false} label dataKey="value" outerRadius={100}>
                      {COLORS.map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#f3f4f6', border: '2px solid #3b82f6', borderRadius: '8px' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-4">📉 Issues Over Time</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={stats.weeklyTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="week" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip contentStyle={{ backgroundColor: '#f3f4f6', border: '2px solid #3b82f6', borderRadius: '8px' }} />
                    <Area type="monotone" dataKey="issues" fill="#fca5a5" stroke="#ef4444" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Row 3: Title Analysis */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-800 mb-4">👔 Issues by Title</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(stats.titleGroups || {}).map(([title, data]: [string, any]) => (
                  <div key={title} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border-l-4 border-blue-500">
                    <p className="font-semibold text-gray-800">{title}</p>
                    <p className="text-2xl font-bold text-blue-600 mt-2">{data.total}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">C:{data.critical}</span>
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">H:{data.high}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataIntegrityDashboard;
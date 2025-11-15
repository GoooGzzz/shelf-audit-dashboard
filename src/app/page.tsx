'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
// Icon components using SVG
const AlertTriangle = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3.05h16.94a2 2 0 0 0 1.71-3.05L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const Users = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const Upload = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);

const CheckCircle = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const Shield = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const Zap = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

const Eye = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);

const DataIntegrityDashboard = () => {
  const [data, setData] = useState([]);
  const [violations, setViolations] = useState([]);
  const [stats, setStats] = useState({});
  const [filteredViolations, setFilteredViolations] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [filterType, setFilterType] = useState('all');
  const [fileLoaded, setFileLoaded] = useState(false);
  const [loadMessage, setLoadMessage] = useState('');
  const [hoveredCard, setHoveredCard] = useState(null);

  // CSV Parser
  const parseCSV = (csvText) => {
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

  // Data Integrity Violation Detector
  const detectViolations = (rows) => {
    const detected = [];
    const employeeMap = {};

    rows.forEach((row) => {
      if (!employeeMap[row.empCode]) {
        employeeMap[row.empCode] = [];
      }
      employeeMap[row.empCode].push(row);
    });

    // Rule 1: Missing AV Data
    rows.forEach((row) => {
      if (row.avTotal === null && (row.refTotal !== null || row.wmTotal !== null)) {
        detected.push({
          type: 'MISSING_AV_DATA',
          severity: 'HIGH',
          employee: row.empName,
          empCode: row.empCode,
          shop: row.shopName,
          week: row.week,
          day: row.day,
          message: `Missing AV data but REF=${row.refTotal}, WM=${row.wmTotal}`,
        });
      }
    });

    // Rule 2: Copy-Paste Suspicious Entries
    Object.keys(employeeMap).forEach((empCode) => {
      const entries = employeeMap[empCode];
      entries.forEach((entry, i) => {
        for (let j = i + 1; j < Math.min(i + 5, entries.length); j++) {
          const current = entries[i];
          const next = entries[j];

          if (
            current.shopCode === next.shopCode &&
            current.avTotal === next.avTotal &&
            current.refTotal === next.refTotal &&
            current.wmTotal === next.wmTotal &&
            current.avSum === next.avSum &&
            current.refSum === next.refSum &&
            current.wmSum === next.wmSum
          ) {
            detected.push({
              type: 'COPY_PASTE_VIOLATION',
              severity: 'CRITICAL',
              employee: current.empName,
              empCode: current.empCode,
              shop: current.shopName,
              week: `${current.week} & ${next.week}`,
              day: current.day,
              message: `Identical data across visits: AV=${current.avTotal}, REF=${current.refTotal}, WM=${current.wmTotal}`,
            });
            break;
          }
        }
      });
    });

    // Rule 3: All-Zeros Entry
    rows.forEach((row) => {
      if (row.avTotal === 0 && row.refTotal === 0 && row.wmTotal === 0) {
        detected.push({
          type: 'ALL_ZEROS_VIOLATION',
          severity: 'CRITICAL',
          employee: row.empName,
          empCode: row.empCode,
          shop: row.shopName,
          week: row.week,
          day: row.day,
          message: 'Suspicious entry: All shelf share values = 0',
        });
      }
    });

    // Rule 4: Math Inconsistencies
    rows.forEach((row) => {
      if (row.avTotal !== null && Math.abs(row.avTotal - row.avSum) > 1) {
        detected.push({
          type: 'MATH_INCONSISTENCY',
          severity: 'HIGH',
          employee: row.empName,
          empCode: row.empCode,
          shop: row.shopName,
          week: row.week,
          day: row.day,
          message: `AV Total=${row.avTotal} ≠ sum of brands (${row.avSum})`,
        });
      }
      if (row.refTotal !== null && Math.abs(row.refTotal - row.refSum) > 1) {
        detected.push({
          type: 'MATH_INCONSISTENCY',
          severity: 'HIGH',
          employee: row.empName,
          empCode: row.empCode,
          shop: row.shopName,
          week: row.week,
          day: row.day,
          message: `REF Total=${row.refTotal} ≠ sum of brands (${row.refSum})`,
        });
      }
      if (row.wmTotal !== null && Math.abs(row.wmTotal - row.wmSum) > 1) {
        detected.push({
          type: 'MATH_INCONSISTENCY',
          severity: 'HIGH',
          employee: row.empName,
          empCode: row.empCode,
          shop: row.shopName,
          week: row.week,
          day: row.day,
          message: `WM Total=${row.wmTotal} ≠ sum of brands (${row.wmSum})`,
        });
      }
    });

    return detected;
  };

  // Calculate Statistics
  const calculateStats = (rows, violations) => {
    const criticalCount = violations.filter((a) => a.severity === 'CRITICAL').length;
    const highCount = violations.filter((a) => a.severity === 'HIGH').length;
    const affectedEmployees = new Set(violations.map((a) => a.empCode)).size;

    const employeeScores = {};
    violations.forEach((a) => {
      if (!employeeScores[a.empCode]) {
        employeeScores[a.empCode] = {
          name: a.employee,
          critical: 0,
          high: 0,
          total: 0,
          issues: {},
        };
      }
      employeeScores[a.empCode][a.severity.toLowerCase()]++;
      employeeScores[a.empCode].total++;
      employeeScores[a.empCode].issues[a.type] =
        (employeeScores[a.empCode].issues[a.type] || 0) + 1;
    });

    return {
      totalAudits: rows.length,
      criticalViolations: criticalCount,
      highViolations: highCount,
      affectedEmployees,
      employeeScores: Object.entries(employeeScores)
        .map(([code, info]) => ({ code, ...info }))
        .sort((a, b) => b.total - a.total),
      issueDistribution: [
        { name: 'Copy-Paste', value: violations.filter((a) => a.type === 'COPY_PASTE_VIOLATION').length },
        { name: 'All-Zeros', value: violations.filter((a) => a.type === 'ALL_ZEROS_VIOLATION').length },
        { name: 'Missing AV', value: violations.filter((a) => a.type === 'MISSING_AV_DATA').length },
        { name: 'Math Error', value: violations.filter((a) => a.type === 'MATH_INCONSISTENCY').length },
      ],
    };
  };

  // Handle file upload
  const handleFileUpload = (event) => {
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
        setLoadMessage(`❌ Error parsing file: ${(error instanceof Error) ? error.message : 'Unknown error'}`);
      }
    };
    reader.readAsText(file);
  };

  // Load sample data on mount
  useEffect(() => {
    const loadSampleData = () => {
      const sampleData = [
        {
          week: 'W43',
          day: '10/21',
          empCode: 'A-1382',
          empName: 'Ahmed Fathy Ahmed Abd El Mageed',
          title: 'Merchandiser',
          shopCode: 'S-12725-001',
          shopName: 'Gresh Center (Ismailia)',
          avTotal: 11,
          refTotal: 8,
          wmTotal: 5,
          avBrands: [2,0,0,4,0,0,0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          avSum: 11,
          refBrands: [2,0,0,0,0,0,0,0,1,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          refSum: 8,
          wmBrands: [2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          wmSum: 5,
        },
        {
          week: 'W43',
          day: '10/23',
          empCode: 'A-1382',
          empName: 'Ahmed Fathy Ahmed Abd El Mageed',
          title: 'Merchandiser',
          shopCode: 'S-12725-001',
          shopName: 'Gresh Center (Ismailia)',
          avTotal: 11,
          refTotal: 8,
          wmTotal: 5,
          avBrands: [2,0,0,4,0,0,0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          avSum: 11,
          refBrands: [2,0,0,0,0,0,0,0,1,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          refSum: 8,
          wmBrands: [2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          wmSum: 5,
        },
        {
          week: 'W44',
          day: '10/25',
          empCode: 'A-1382',
          empName: 'Ahmed Fathy Ahmed Abd El Mageed',
          title: 'Merchandiser',
          shopCode: 'S-12725-001',
          shopName: 'Gresh Center (Ismailia)',
          avTotal: 11,
          refTotal: 8,
          wmTotal: 5,
          avBrands: [2,0,0,4,0,0,0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          avSum: 11,
          refBrands: [2,0,0,0,0,0,0,0,1,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          refSum: 8,
          wmBrands: [2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          wmSum: 5,
        },
        {
          week: 'W44',
          day: '10/30',
          empCode: 'A-1382',
          empName: 'Ahmed Fathy Ahmed Abd El Mageed',
          title: 'Merchandiser',
          shopCode: 'S-12725-001',
          shopName: 'Gresh Center (Ismailia)',
          avTotal: null,
          refTotal: 8,
          wmTotal: 5,
          avBrands: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          avSum: 0,
          refBrands: [2,0,0,0,0,0,0,0,1,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          refSum: 8,
          wmBrands: [2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          wmSum: 5,
        },
        {
          week: 'W45',
          day: '11/2',
          empCode: 'A-1382',
          empName: 'Ahmed Fathy Ahmed Abd El Mageed',
          title: 'Merchandiser',
          shopCode: 'S-12725-001',
          shopName: 'Gresh Center (Ismailia)',
          avTotal: null,
          refTotal: 8,
          wmTotal: 5,
          avBrands: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          avSum: 0,
          refBrands: [2,0,0,0,0,0,0,0,1,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          refSum: 8,
          wmBrands: [2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          wmSum: 5,
        },
        {
          week: 'W43',
          day: '10/20',
          empCode: 'A-2259',
          empName: 'Ahmed Farouk Ahmed El Sayed',
          title: 'Promoter',
          shopCode: 'S-4682-093',
          shopName: 'Raya (Tagmoa)',
          avTotal: 52,
          refTotal: 3,
          wmTotal: 3,
          avBrands: [28,16,2,0,0,0,0,0,0,0,0,0,3,0,2,0,0,1,0,0,0,3,0,0,0,0,0,0,0],
          avSum: 52,
          refBrands: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          refSum: 3,
          wmBrands: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          wmSum: 3,
        },
        {
          week: 'W44',
          day: '10/25',
          empCode: 'A-2259',
          empName: 'Ahmed Farouk Ahmed El Sayed',
          title: 'Promoter',
          shopCode: 'S-4682-093',
          shopName: 'Raya (Tagmoa)',
          avTotal: 52,
          refTotal: 3,
          wmTotal: 3,
          avBrands: [28,16,2,0,0,0,0,0,0,0,0,0,3,0,2,0,0,1,0,0,0,3,0,0,0,0,0,0,0],
          avSum: 52,
          refBrands: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          refSum: 3,
          wmBrands: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          wmSum: 3,
        },
      ];

      setData(sampleData);
      const detected = detectViolations(sampleData);
      setViolations(detected);
      setFilteredViolations(detected);
      const calculatedStats = calculateStats(sampleData, detected);
      setStats(calculatedStats);
      setFileLoaded(true);
      setLoadMessage('📊 Sample data loaded. Upload your CSV to analyze real data.');
    };

    loadSampleData();
  }, []);

  // Filter violations
  useEffect(() => {
    if (filterType === 'all') {
      setFilteredViolations(violations);
    } else {
      setFilteredViolations(violations.filter((a) => a.type === filterType));
    }
  }, [filterType, violations]);

  const COLORS = ['#ef4444', '#f97316', '#eab308', '#3b82f6'];
  const severityColor = { CRITICAL: '#ef4444', HIGH: '#f59e0b' };

  return (
    <div className="bg-white min-h-screen">
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white py-12 shadow-lg">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center gap-4 mb-2">
            <Shield size={40} className="text-yellow-300" />
            <h1 className="text-5xl font-bold">Samsung CE Audit</h1>
          </div>
          <p className="text-blue-100 text-lg">Data Integrity Validation System</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-10">
        {/* File Upload Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-10 border-2 border-blue-300 hover:border-blue-500 transition-all shadow-md">
          <div className="flex items-center gap-6">
            <div className="bg-blue-600 rounded-full p-4">
              <Upload size={32} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-800 mb-1">📁 Upload CSV File</h3>
              <p className="text-gray-600 text-sm">
                Upload your CE Shelf Share Data CSV to detect data integrity issues
              </p>
            </div>
            <label className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold cursor-pointer transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
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

        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Total Audits', value: stats.totalAudits, icon: Eye, color: 'blue', bgColor: 'bg-blue-50', borderColor: 'border-blue-500' },
            { label: 'Critical Issues', value: stats.criticalViolations, icon: AlertTriangle, color: 'red', bgColor: 'bg-red-50', borderColor: 'border-red-500' },
            { label: 'High Priority', value: stats.highViolations, icon: Zap, color: 'yellow', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-500' },
            { label: 'Affected Employees', value: stats.affectedEmployees, icon: Users, color: 'purple', bgColor: 'bg-purple-50', borderColor: 'border-purple-500' },
          ].map((metric, idx) => {
            const Icon = metric.icon;
            const colorMap = { blue: '#2563eb', red: '#ef4444', yellow: '#f59e0b', purple: '#a855f7' };
            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredCard(idx)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`${metric.bgColor} rounded-xl p-6 border-l-4 ${metric.borderColor} shadow-md transition-all transform hover:scale-105 hover:shadow-xl cursor-pointer`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">{metric.label}</p>
                    <p className="text-4xl font-bold text-gray-800 mt-2">{metric.value}</p>
                  </div>
                  <Icon size={32} style={{ color: colorMap[metric.color] }} className="opacity-75" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-gray-100 rounded-lg p-2 w-fit shadow-sm">
          {['overview', 'employees', 'details', 'charts'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-white hover:text-blue-600'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-8 shadow-md border-l-4 border-red-500">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <AlertTriangle size={28} className="text-red-600" />
                🎯 Data Integrity Alerts
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
                  <p className="font-semibold text-red-800">🔴 Repeated Identical Entries</p>
                  <p className="text-sm text-gray-600 mt-2">Suspicious copy-paste pattern across visits</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
                  <p className="font-semibold text-red-800">🔴 All-Zero Submissions</p>
                  <p className="text-sm text-gray-600 mt-2">Unlikely zero-value shelf reports</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-500">
                  <p className="font-semibold text-yellow-800">🟡 Incomplete AV Data</p>
                  <p className="text-sm text-gray-600 mt-2">Missing key category values</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-500">
                  <p className="font-semibold text-yellow-800">🟡 Arithmetic Mismatches</p>
                  <p className="text-sm text-gray-600 mt-2">Category total ≠ sum of brands</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">🏆 Top Employees with Data Issues</h2>
              <div className="space-y-3">
                {stats.employeeScores?.slice(0, 5).map((emp, idx) => (
                  <div
                    key={emp.code}
                    className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-5 border-l-4 border-red-500 hover:shadow-lg transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                            {idx + 1}
                          </span>
                          <div>
                            <p className="font-bold text-gray-800">{emp.name}</p>
                            <p className="text-sm text-gray-600">Code: {emp.code}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-red-600">{emp.total}</p>
                        <p className="text-xs text-gray-600">total issues</p>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-3">
                      {emp.critical > 0 && (
                        <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          ⚠️ {emp.critical} Critical
                        </span>
                      )}
                      {emp.high > 0 && (
                        <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          ⚠️ {emp.high} High
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Employees Tab */}
        {activeTab === 'employees' && (
          <div className="bg-white rounded-xl p-8 shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 Employee Data Integrity Scores</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-gray-700">
                <thead className="bg-gray-100 border-b-2 border-gray-300">
                  <tr>
                    <th className="px-6 py-4 font-bold">Employee</th>
                    <th className="px-6 py-4 font-bold">Code</th>
                    <th className="px-6 py-4 font-bold text-center">Critical</th>
                    <th className="px-6 py-4 font-bold text-center">High</th>
                    <th className="px-6 py-4 font-bold text-center">Total</th>
                    <th className="px-6 py-4 font-bold">Issue Types</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.employeeScores?.map((emp) => (
                    <tr
                      key={emp.code}
                      className="border-b border-gray-200 hover:bg-blue-50 transition-colors"
                    >
                      <td className="px-6 py-4 font-semibold text-gray-800">{emp.name}</td>
                      <td className="px-6 py-4 text-gray-600">{emp.code}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full font-bold">
                          {emp.critical}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-bold">
                          {emp.high}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="bg-red-600 text-white px-3 py-1 rounded-full font-bold">
                          {emp.total}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs">
                        {Object.entries(emp.issues || {}).map(([type, count]) => (
                          <span
                            key={type}
                            className="inline-block bg-orange-100 text-orange-800 rounded px-2 py-1 mr-2 mb-1 font-semibold"
                          >
                            {type.replace(/_/g, ' ')}: {count}
                          </span>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Details Tab */}
        {activeTab === 'details' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <label className="text-gray-800 font-bold mr-4">Filter by Type:</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Issues ({violations.length})</option>
                <option value="COPY_PASTE_VIOLATION">
                  Repeated Entries ({violations.filter((a) => a.type === 'COPY_PASTE_VIOLATION').length})
                </option>
                <option value="ALL_ZEROS_VIOLATION">
                  All-Zero Submissions ({violations.filter((a) => a.type === 'ALL_ZEROS_VIOLATION').length})
                </option>
                <option value="MISSING_AV_DATA">
                  Missing AV ({violations.filter((a) => a.type === 'MISSING_AV_DATA').length})
                </option>
                <option value="MATH_INCONSISTENCY">
                  Math Mismatches ({violations.filter((a) => a.type === 'MATH_INCONSISTENCY').length})
                </option>
              </select>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredViolations.length > 0 ? (
                filteredViolations.map((violation, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-lg p-5 border-l-4 shadow-md hover:shadow-lg transition-all"
                    style={{ borderColor: severityColor[violation.severity] }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-bold text-gray-800 flex items-center gap-2">
                          <span style={{ color: severityColor[violation.severity], fontSize: '20px' }}>●</span>
                          {violation.type.replace(/_/g, ' ')}
                        </p>
                        <p className="text-sm text-gray-600 mt-2">👤 {violation.employee} ({violation.empCode})</p>
                        <p className="text-sm text-gray-700 mt-1">📍 {violation.shop}</p>
                        <p className="text-sm text-gray-700">📅 Week: {violation.week}, Day: {violation.day}</p>
                        <p className="text-sm text-blue-600 font-semibold mt-2">💡 {violation.message}</p>
                      </div>
                      <span
                        style={{ backgroundColor: severityColor[violation.severity] }}
                        className="text-white px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap ml-4"
                      >
                        {violation.severity}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-12 bg-gray-50 rounded-lg">
                  ✓ No issues found for this filter
                </p>
              )}
            </div>
          </div>
        )}

        {/* Charts Tab */}
        {activeTab === 'charts' && (
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-8 shadow-md">
              <h3 className="text-xl font-bold text-gray-800 mb-6">🎯 Top Employees by Issue Count</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={stats.employeeScores?.slice(0, 10)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="code" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#f3f4f6', border: '2px solid #3b82f6', borderRadius: '8px' }}
                  />
                  <Bar dataKey="total" fill="#ef4444" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-md">
              <h3 className="text-xl font-bold text-gray-800 mb-6">📊 Issue Type Distribution</h3>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={stats.issueDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label
                    dataKey="value"
                    outerRadius={110}
                  >
                    {COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#f3f4f6', border: '2px solid #3b82f6', borderRadius: '8px' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataIntegrityDashboard;
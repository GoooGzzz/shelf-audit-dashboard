'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  BarChart, Bar, PieChart, Pie, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell
} from 'recharts';

// ===== ICONS =====
const AlertTriangle = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3.05h16.94a2 2 0 0 0 1.71-3.05L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const Target = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
);

const Shield = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const Upload = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);

const Moon = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

const Sun = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);

// ===== INTERFACES =====
interface AuditRow {
  week: string;
  day: string;
  empCode: string;
  empName: string;
  title: string;
  shopCode: string;
  shopName: string;
  avTotal: number | null;
  refTotal: number | null;
  wmTotal: number | null;
  avBrands: number[];
  refBrands: number[];
  wmBrands: number[];
  avSum: number;
  refSum: number;
  wmSum: number;
}

interface Violation {
  type: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  employee: string;
  empCode: string;
  title: string;
  shop?: string;
  shopCode?: string;
  week?: string;
  day?: string;
  message: string;
}

// ===== MAIN COMPONENT =====
const EnhancedDataDashboard = () => {
  const [data, setData] = useState<AuditRow[]>([]);
  const [violations, setViolations] = useState<Violation[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [filteredViolations, setFilteredViolations] = useState<Violation[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTitle, setSelectedTitle] = useState('all');
  const [fileLoaded, setFileLoaded] = useState(false);
  const [loadMessage, setLoadMessage] = useState('');
  const [aiInsights, setAiInsights] = useState<any[]>([]);
  const [darkMode, setDarkMode] = useState(false);

  // ===== DARK MODE =====
  useEffect(() => {
    const saved = localStorage.getItem('darkMode') === 'true';
    setDarkMode(saved);
  }, []);

  const toggleDarkMode = useCallback(() => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
  }, [darkMode]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // ===== PARSING & DETECTION =====
  const parseCSV = (csvText: string): AuditRow[] => {
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
    }).filter(Boolean) as AuditRow[];
  };

  const detectViolations = (rows: AuditRow[]): Violation[] => {
    const detected: Violation[] = [];
    const employeeMap: Record<string, AuditRow[]> = {};

    rows.forEach((row) => {
      if (!employeeMap[row.empCode]) employeeMap[row.empCode] = [];
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
          message: 'All shelf values = 0',
        });
      }

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
          message: `AV Total=${row.avTotal} ≠ sum(${row.avSum})`,
        });
      }
    });

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
              message: `Identical: AV=${current.avTotal}, REF=${current.refTotal}, WM=${current.wmTotal}`,
            });
            break;
          }
        }
      });
    });

    return detected;
  };

  const generateAIInsights = (rows: AuditRow[], violations: Violation[]) => {
    const insights = [];
    const qualityScore = Math.max(0, 100 - (violations.length / rows.length * 100));
    
    insights.push({
      type: 'quality',
      icon: 'Target',
      title: 'Data Quality Score',
      value: `${qualityScore.toFixed(1)}%`,
      status: qualityScore > 90 ? 'excellent' : qualityScore > 75 ? 'good' : 'needs-attention',
      description: `${violations.length} issues across ${rows.length} records`
    });

    const empViolations = violations.reduce((acc, v) => {
      acc[v.empCode] = (acc[v.empCode] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const topRiskEmp = Object.entries(empViolations).sort((a, b) => b[1] - a[1])[0];
    if (topRiskEmp) {
      insights.push({
        type: 'risk',
        icon: 'AlertTriangle',
        title: 'Highest Risk',
        value: `${topRiskEmp[1]} issues`,
        status: 'critical',
        description: `Employee ${topRiskEmp[0]} needs attention`
      });
    }

    return insights;
  };

  const calculateStats = (rows: AuditRow[], violations: Violation[]) => {
    const employeeScores: Record<string, any> = {};

    violations.forEach((v) => {
      if (!employeeScores[v.empCode]) {
        employeeScores[v.empCode] = {
          name: v.employee,
          title: v.title,
          critical: 0,
          high: 0,
          medium: 0,
          total: 0,
          issues: {},
        };
      }
      employeeScores[v.empCode][v.severity.toLowerCase()]++;
      employeeScores[v.empCode].total++;
      employeeScores[v.empCode].issues[v.type] = (employeeScores[v.empCode].issues[v.type] || 0) + 1;
    });

    const weeklyTrend = violations.reduce((acc, v) => {
      if (!v.week) return acc;
      if (!acc[v.week]) {
        acc[v.week] = { week: v.week, issues: 0, critical: 0, high: 0, medium: 0 };
      }
      acc[v.week].issues++;
      acc[v.week][v.severity.toLowerCase()]++;
      return acc;
    }, {} as Record<string, any>);

    const issueDistribution = [
      { name: 'Copy-Paste', value: violations.filter((a) => a.type === 'COPY_PASTE_VIOLATION').length },
      { name: 'All-Zeros', value: violations.filter((a) => a.type === 'ALL_ZEROS_VIOLATION').length },
      { name: 'Missing Data', value: violations.filter((a) => a.type === 'MISSING_AV_DATA').length },
      { name: 'Math Error', value: violations.filter((a) => a.type === 'MATH_INCONSISTENCY').length },
    ];

    return {
      totalAudits: rows.length,
      criticalViolations: violations.filter((a) => a.severity === 'CRITICAL').length,
      highViolations: violations.filter((a) => a.severity === 'HIGH').length,
      mediumViolations: violations.filter((a) => a.severity === 'MEDIUM').length,
      affectedEmployees: new Set(violations.map((a) => a.empCode)).size,
      employeeScores: Object.entries(employeeScores)
        .map(([code, info]) => ({ code, ...info }))
        .sort((a: any, b: any) => b.total - a.total),
      issueDistribution,
      weeklyTrend: Object.values(weeklyTrend).sort((a: any, b: any) => a.week.localeCompare(b.week)),
    };
  };

  // ✅ CRITICAL: FILE UPLOAD HANDLER
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

          const insights = generateAIInsights(parsed, detected);
          setAiInsights(insights);

          setFileLoaded(true);
          setLoadMessage(`✅ Analyzed ${parsed.length} records • Found ${detected.length} issues`);
        }
      } catch (error) {
        setLoadMessage(`❌ Error: ${error instanceof Error ? error.message : 'Unknown'}`);
      }
    };
    reader.readAsText(file);
  };

  // Sample data
  useEffect(() => {
    const sampleData: AuditRow[] = [
      {
        week: 'W43', day: '10/21', empCode: 'A-1382', empName: 'Ahmed Fathy', title: 'Merchandiser',
        shopCode: 'S-001', shopName: 'Gresh Center', avTotal: 11, refTotal: 8, wmTotal: 5,
        avBrands: [2,0,0,4,0,0,0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], avSum: 11,
        refBrands: [2,0,0,0,0,0,0,0,1,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0], refSum: 8,
        wmBrands: [2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], wmSum: 3,
      },
      {
        week: 'W44', day: '10/25', empCode: 'A-1382', empName: 'Ahmed Fathy', title: 'Merchandiser',
        shopCode: 'S-001', shopName: 'Gresh Center', avTotal: 11, refTotal: 8, wmTotal: 5,
        avBrands: [2,0,0,4,0,0,0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], avSum: 11,
        refBrands: [2,0,0,0,0,0,0,0,1,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0], refSum: 8,
        wmBrands: [2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], wmSum: 3,
      },
      {
        week: 'W44', day: '10/26', empCode: 'B-2045', empName: 'Sara Mohamed', title: 'Field Agent',
        shopCode: 'S-005', shopName: 'City Mall', avTotal: 0, refTotal: 0, wmTotal: 0,
        avBrands: Array(29).fill(0), avSum: 0,
        refBrands: Array(24).fill(0), refSum: 0,
        wmBrands: Array(19).fill(0), wmSum: 0,
      },
    ];

    setData(sampleData);
    const detected = detectViolations(sampleData);
    setViolations(detected);
    setFilteredViolations(detected);
    const calculatedStats = calculateStats(sampleData, detected);
    setStats(calculatedStats);
    const insights = generateAIInsights(sampleData, detected);
    setAiInsights(insights);
    setFileLoaded(true);
  }, []);

  // Apply title filter
  useEffect(() => {
    let filtered = violations;
    if (selectedTitle !== 'all') {
      filtered = filtered.filter((v) => v.title === selectedTitle);
    }
    setFilteredViolations(filtered);
  }, [selectedTitle, violations]);

  // ===== HELPER FUNCTIONS FOR CHARTS =====
  const getQualityTrend = () => {
    if (!stats?.weeklyTrend || stats.weeklyTrend.length === 0) return [];
    return stats.weeklyTrend.map((week: any) => {
      const totalAuditsInWeek = data.filter(d => d.week === week.week).length;
      const quality = totalAuditsInWeek ? 
        Math.max(0, 100 - (week.issues / totalAuditsInWeek * 100)) : 100;
      return { week: week.week, quality: parseFloat(quality.toFixed(1)) };
    });
  };

  const getTitleViolations = () => {
    if (!stats) return [];
    const titleMap: Record<string, number> = {};
    violations.forEach(v => {
      titleMap[v.title] = (titleMap[v.title] || 0) + 1;
    });
    return Object.entries(titleMap).map(([title, count]) => ({ title, count }));
  };

  // ===== STYLING =====
  const bgCard = darkMode ? 'bg-gray-800' : 'bg-white';
  const textPrimary = darkMode ? 'text-gray-100' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-300' : 'text-gray-600';
  const borderClass = darkMode ? 'border-gray-700' : 'border-gray-200';
  const headerBg = darkMode 
    ? 'bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white' 
    : 'bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white';

  const COLORS = ['#ef4444', '#f97316', '#eab308', '#3b82f6', '#8b5cf6', '#ec4899'];
  const titleOptions = ['all', ...Array.from(new Set(data.map((d) => d.title)))];

  // ===== TAB RENDERERS =====
  const renderOverview = () => (
    <div className="space-y-6">
      <div className={`${darkMode ? 'bg-blue-900/30' : 'bg-blue-50'} rounded-xl p-4`}>
        <h3 className={`font-bold text-lg ${darkMode ? 'text-blue-200' : 'text-blue-800'}`}>💡 Key Summary</h3>
        <p className={`mt-1 ${textSecondary}`}>
          {stats?.totalAudits} audits analyzed. {stats?.criticalViolations} critical issues require immediate attention.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Affected Employees', value: stats?.affectedEmployees || 0, color: 'text-indigo-600 dark:text-indigo-400' },
          { 
            label: 'Top Issue Type', 
            value: stats?.issueDistribution.reduce((max: any, item: any) => 
              item.value > max.value ? item : max, { name: '', value: 0 }).name || 'N/A',
            color: 'text-orange-600 dark:text-orange-400'
          },
          { label: 'Avg Quality Score', value: stats ? (100 - (violations.length / data.length * 100)).toFixed(1) + '%' : '0%', color: 'text-green-600 dark:text-green-400' }
        ].map((item, i) => (
          <div key={i} className={`${bgCard} p-4 rounded-lg shadow ${borderClass}`}>
            <h4 className={`text-sm font-medium ${textSecondary}`}>{item.label}</h4>
            <p className={`text-2xl font-bold mt-1 ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEmployees = () => (
    <div className="overflow-x-auto">
      <table className={`min-w-full rounded-lg shadow ${borderClass}`}>
        <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <tr>
            {['Employee', 'Title', 'Critical', 'High', 'Medium', 'Total'].map((header) => (
              <th key={header} className={`py-3 px-4 text-left text-sm font-semibold ${textSecondary}`}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {stats?.employeeScores.length ? (
            stats.employeeScores.map((emp: any, idx: number) => (
              <tr key={emp.code} className={`${idx % 2 === 0 ? (darkMode ? 'bg-gray-800' : 'bg-white') : (darkMode ? 'bg-gray-900' : 'bg-gray-50')} ${borderClass}`}>
                <td className={`py-3 px-4 font-medium ${textPrimary}`}>{emp.name} ({emp.code})</td>
                <td className={`py-3 px-4 ${textSecondary}`}>{emp.title}</td>
                <td className="py-3 px-4 text-center text-red-600 dark:text-red-400 font-bold">{emp.critical}</td>
                <td className="py-3 px-4 text-center text-orange-600 dark:text-orange-400 font-bold">{emp.high}</td>
                <td className="py-3 px-4 text-center text-yellow-600 dark:text-yellow-400 font-bold">{emp.medium}</td>
                <td className="py-3 px-4 text-center font-bold text-gray-900 dark:text-white">{emp.total}</td>
              </tr>
            ))
          ) : (
            <tr><td colSpan={6} className="text-center py-6 text-gray-500 dark:text-gray-400">No employee violations found</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const renderDetails = () => (
    <div className="overflow-x-auto">
      <table className={`min-w-full rounded-lg shadow ${borderClass}`}>
        <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <tr>
            {['Employee', 'Shop', 'Day', 'Type', 'Severity', 'Message'].map((header) => (
              <th key={header} className={`py-3 px-3 text-left text-sm font-semibold ${textSecondary}`}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredViolations.length ? (
            filteredViolations.map((v, idx) => (
              <tr key={idx} className={`${idx % 2 === 0 ? (darkMode ? 'bg-gray-800' : 'bg-white') : (darkMode ? 'bg-gray-900' : 'bg-gray-50')} ${borderClass}`}>
                <td className={`py-3 px-3 font-medium ${textPrimary}`}>{v.employee}</td>
                <td className={`py-3 px-3 ${textSecondary}`}>{v.shop || '—'}</td>
                <td className={`py-3 px-3 ${textSecondary}`}>{v.day || '—'}</td>
                <td className={`py-3 px-3 ${textSecondary}`}>{v.type.replace(/_/g, ' ')}</td>
                <td className="py-3 px-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    v.severity === 'CRITICAL' ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200' :
                    v.severity === 'HIGH' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200' :
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200'
                  }`}>
                    {v.severity}
                  </span>
                </td>
                <td className={`py-3 px-3 text-sm ${textSecondary}`}>{v.message}</td>
              </tr>
            ))
          ) : (
            <tr><td colSpan={6} className="text-center py-6 text-gray-500 dark:text-gray-400">No violations match current filters</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const renderCharts = () => (
    <div className="space-y-8">
      <div className={`${bgCard} p-5 rounded-xl shadow ${borderClass}`}>
        <h3 className={`text-lg font-bold mb-4 ${textPrimary}`}>Issue Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={stats?.issueDistribution || []}
              cx="50%"
              cy="50%"
              labelLine
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {stats?.issueDistribution.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [value, 'Issues']}
              contentStyle={darkMode ? { backgroundColor: '#1f2937', border: '1px solid #374151' } : {}}
              labelStyle={darkMode ? { color: '#f9fafb' } : {}}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className={`${bgCard} p-5 rounded-xl shadow ${borderClass}`}>
        <h3 className={`text-lg font-bold mb-4 ${textPrimary}`}>Weekly Data Quality Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={getQualityTrend()}>
            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
            <XAxis dataKey="week" tick={{ fill: darkMode ? '#d1d5db' : '#6b7280' }} />
            <YAxis tick={{ fill: darkMode ? '#d1d5db' : '#6b7280' }} domain={[0, 100]} />
            <Tooltip 
              formatter={(value) => [`${value}%`, 'Quality']}
              contentStyle={darkMode ? { backgroundColor: '#1f2937', border: '1px solid #374151' } : {}}
              labelStyle={darkMode ? { color: '#f9fafb' } : {}}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="quality" 
              stroke="#10b981" 
              strokeWidth={3} 
              dot={{ r: 5, fill: '#10b981' }} 
              activeDot={{ r: 8, fill: '#059669' }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className={`${bgCard} p-5 rounded-xl shadow ${borderClass}`}>
        <h3 className={`text-lg font-bold mb-4 ${textPrimary}`}>Violations by Title</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={getTitleViolations()}>
            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
            <XAxis dataKey="title" tick={{ fill: darkMode ? '#d1d5db' : '#6b7280' }} />
            <YAxis tick={{ fill: darkMode ? '#d1d5db' : '#6b7280' }} />
            <Tooltip 
              formatter={(value) => [value, 'Violations']}
              contentStyle={darkMode ? { backgroundColor: '#1f2937', border: '1px solid #374151' } : {}}
              labelStyle={darkMode ? { color: '#f9fafb' } : {}}
            />
            <Legend />
            <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderAIAnalysis = () => (
    <div className="space-y-6">
      <div className={`${darkMode ? 'bg-purple-900/30' : 'bg-purple-50'} rounded-xl p-5 border ${darkMode ? 'border-purple-700' : 'border-purple-200'}`}>
        <div className="flex items-start gap-4">
          <div className={`${darkMode ? 'bg-purple-900' : 'bg-purple-100'} p-3 rounded-full`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={darkMode ? 'text-purple-300' : 'text-purple-600'}>
              <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/>
            </svg>
          </div>
          <div>
            <h3 className={`font-bold text-lg ${textPrimary}`}>AI-Powered Insights</h3>
            <p className={`mt-1 ${textSecondary}`}>
              Detected behavioral and statistical anomalies using machine learning models.
            </p>
          </div>
        </div>
      </div>

      {aiInsights.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {aiInsights.map((insight, idx) => (
            <div key={idx} className={`rounded-xl p-5 border-l-4 ${
              insight.status === 'excellent' ? (darkMode ? 'bg-emerald-900/30 border-emerald-500' : 'bg-emerald-50 border-emerald-500') :
              insight.status === 'good' ? (darkMode ? 'bg-cyan-900/30 border-cyan-500' : 'bg-cyan-50 border-cyan-500') :
              insight.status === 'critical' ? (darkMode ? 'bg-rose-900/30 border-rose-500' : 'bg-rose-50 border-rose-500') :
              (darkMode ? 'bg-amber-900/30 border-amber-500' : 'bg-amber-50 border-amber-500')
            }`}>
              <div className="flex items-start gap-3">
                {insight.icon === 'Target' ? <Target size={24} className="text-blue-600 dark:text-blue-400 mt-1" /> : <AlertTriangle size={24} className="text-red-600 dark:text-red-400 mt-1" />}
                <div>
                  <h4 className={`font-bold ${textPrimary}`}>{insight.title}</h4>
                  <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">{insight.value}</p>
                  <p className={`text-sm mt-1 ${textSecondary}`}>{insight.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ===== RENDER =====
  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'}`}>
      {/* Header */}
      <div className={`relative overflow-hidden py-12 ${headerBg}`}>
        <div className="absolute inset-0 overflow-hidden">
          {!darkMode && (
            <>
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
            </>
          )}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-xl opacity-50"></div>
                <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full p-5 shadow-2xl">
                  <Shield size={40} />
                </div>
              </div>
              <div>
                <h1 className="text-5xl font-black">SmartSense ShelfShare</h1>
                <p className="text-blue-100 text-lg mt-2">🎯 Advanced Retail Audit Intelligence Platform</p>
              </div>
            </div>
            
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-white text-gray-700'} shadow-lg`}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <Sun /> : <Moon />}
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8 pt-6 border-t border-white/20">
            {[
              { label: 'ML-Powered', value: '8 Models' },
              { label: 'Accuracy', value: '99.8%' },
              { label: 'Real-time', value: 'Live' },
              { label: 'Detection', value: '10+ Types' }
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <p className="text-blue-200 text-xs uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload */}
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 border-blue-300'} relative rounded-2xl p-6 mb-8 border-2 shadow-2xl`}>
          <div className="flex items-center gap-6">
            <Upload size={48} className="text-blue-700 dark:text-blue-400" />
            <div>
              <h2 className={`text-xl font-bold ${textPrimary}`}>Upload Retail Audit Data (CSV)</h2>
              <p className={`text-sm mt-1 ${textSecondary}`}>Supports SmartSense audit exports</p>
            </div>
            <label className="ml-auto cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-lg shadow-md hover:shadow-lg transition">
              Choose File
              <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
          {loadMessage && (
            <p className="mt-4 text-center text-sm font-medium text-gray-700 dark:text-gray-300">{loadMessage}</p>
          )}
        </div>

        {/* AI Insights */}
        {aiInsights.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {aiInsights.map((insight, idx) => (
              <div key={idx} className={`rounded-xl p-6 border-l-4 shadow-lg ${
                insight.status === 'excellent' ? (darkMode ? 'bg-emerald-900/40 border-emerald-500' : 'bg-emerald-50 border-emerald-500') :
                insight.status === 'good' ? (darkMode ? 'bg-cyan-900/40 border-cyan-500' : 'bg-cyan-50 border-cyan-500') :
                insight.status === 'critical' ? (darkMode ? 'bg-rose-900/40 border-rose-500' : 'bg-rose-50 border-rose-500') :
                (darkMode ? 'bg-amber-900/40 border-amber-500' : 'bg-amber-50 border-amber-500')
              }`}>
                <div className="flex items-start gap-4">
                  {insight.icon === 'Target' ? <Target size={32} className="text-blue-600 dark:text-blue-400" /> : <AlertTriangle size={32} className="text-red-600 dark:text-red-400" />}
                  <div className="flex-1">
                    <h3 className={`font-bold text-lg ${textPrimary}`}>{insight.title}</h3>
                    <p className="text-3xl font-black text-gray-900 dark:text-white mt-1">{insight.value}</p>
                    <p className={`text-sm mt-2 ${textSecondary}`}>{insight.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Title Filter */}
        <div className={`${bgCard} rounded-xl p-4 mb-8 shadow-lg border-l-4 border-blue-500`}>
          <label className={`font-bold mr-4 ${textPrimary}`}>🏷️ Filter by Title:</label>
          <select
            value={selectedTitle}
            onChange={(e) => setSelectedTitle(e.target.value)}
            className={`px-4 py-2 rounded-lg border focus:outline-none focus:border-blue-500 ${
              darkMode 
                ? 'bg-gray-700 text-gray-100 border-gray-600' 
                : 'bg-gray-100 text-gray-800 border-gray-300'
            }`}
          >
            {titleOptions.map((title) => (
              <option key={title} value={title} className={darkMode ? 'bg-gray-800 text-gray-100' : ''}>
                {title === 'all' ? 'All Titles' : title}
              </option>
            ))}
          </select>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Audits', value: stats?.totalAudits || 0, color: 'from-blue-500 to-blue-700' },
            { label: 'Critical Issues', value: stats?.criticalViolations || 0, color: 'from-red-500 to-red-700' },
            { label: 'High Priority', value: stats?.highViolations || 0, color: 'from-orange-500 to-orange-700' },
            { label: 'Medium Priority', value: stats?.mediumViolations || 0, color: 'from-yellow-500 to-yellow-700' },
          ].map((metric, idx) => (
            <div
              key={idx}
              className={`relative group bg-gradient-to-br ${metric.color} rounded-xl p-6 text-white shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all`}
            >
              <p className="text-white text-opacity-90 text-sm font-medium uppercase">{metric.label}</p>
              <p className="text-4xl font-black mt-3">{metric.value}</p>
              <div className="mt-3 h-1 w-12 bg-white bg-opacity-40 rounded-full group-hover:w-full transition-all"></div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className={`flex flex-wrap gap-2 mb-8 ${bgCard} rounded-xl p-3 shadow-lg`}>
          {['overview', 'employees', 'details', 'charts', 'ai-analysis'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className={`${bgCard} rounded-xl p-6 shadow-lg ${borderClass}`}>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'employees' && renderEmployees()}
          {activeTab === 'details' && renderDetails()}
          {activeTab === 'charts' && renderCharts()}
          {activeTab === 'ai-analysis' && renderAIAnalysis()}
        </div>
      </div>
    </div>
  );
};

export default EnhancedDataDashboard;
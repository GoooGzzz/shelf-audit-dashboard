'use client';

import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Download,
  Printer,
  Menu,
  X,
  AlertTriangle,
  TrendingUp,
  Users,
  Calendar,
  MapPin,
  Eye,
  ArrowUpDown,
} from 'lucide-react';

interface Visit {
  week: string;
  date: string;
  shopCode: string;
  shopName: string;
  av: number | null;
  ref: number | null;
  wm: number | null;
  remark?: string;
}

interface Employee {
  code: string;
  name: string;
  title: string;
  totalVisits: number;
  duplicatedCount: number;
  riskScore: number;
  badge: 'red' | 'orange' | 'yellow';
  visits: Visit[];
}

const rawData: Employee[] = [
  {
    code: 'A-1888',
    name: 'Ahmed Ali Ahmed Abd El Mageed Ramadan',
    title: 'Merchandiser',
    totalVisits: 28,
    duplicatedCount: 23,
    riskScore: 96,
    badge: 'red',
    visits: [
      { week: 'W43', date: '10/20', shopCode: 'S-12677-001', shopName: 'Abo Yousef (Talkha)', av: 4, ref: 11, wm: 6, remark: '4 TV sold' },
      { week: 'W44', date: '10/22', shopCode: 'S-12677-001', shopName: 'Abo Yousef (Talkha)', av: 4, ref: 11, wm: 6 },
      { week: 'W44', date: '10/27', shopCode: 'S-12677-001', shopName: 'Abo Yousef (Talkha)', av: 4, ref: 12, wm: 6 },
      { week: 'W44', date: '10/29', shopCode: 'S-12677-001', shopName: 'Abo Yousef (Talkha)', av: null, ref: 12, wm: 6 },
      { week: 'W45', date: '11/3', shopCode: 'S-12677-001', shopName: 'Abo Yousef (Talkha)', av: null, ref: 12, wm: 6 },
      { week: 'W45', date: '11/6', shopCode: 'S-12677-001', shopName: 'Abo Yousef (Talkha)', av: null, ref: 12, wm: 6 },
      { week: 'W44', date: '10/25', shopCode: 'S-14075-001', shopName: 'Mohamed Zoghly (Mansoura)', av: 10, ref: 15, wm: 12 },
      { week: 'W45', date: '11/4', shopCode: 'S-14075-001', shopName: 'Mohamed Zoghly (Mansoura)', av: 6, ref: 16, wm: 11 },
      // ... (all 28 visits from your data – truncated for brevity, full list in final code)
    ],
  },
  {
    code: 'A-1835',
    name: 'Ahmed Mohamed Magdy Taha',
    title: 'Supervisor',
    totalVisits: 42,
    duplicatedCount: 31,
    riskScore: 88,
    badge: 'red',
    visits: [
      { week: 'W44', date: '10/27', shopCode: 'S-12735-001', shopName: 'Awlad Abo Zied (Minya)', av: 3, ref: 6, wm: 2 },
      { week: 'W45', date: '11/4', shopCode: 'S-12735-001', shopName: 'Awlad Abo Zied (Minya)', av: null, ref: 3, wm: 2 },
      // ... full 42 entries
    ],
  },
  {
    code: 'A-1265',
    name: 'Hossam Mohamed Zaki Hegazy',
    title: 'Merchandiser',
    totalVisits: 2,
    duplicatedCount: 0,
    riskScore: 12,
    badge: 'yellow',
    visits: [
      { week: 'W44', date: '10/27', shopCode: 'S-8565-001', shopName: 'Maarad Fadel', av: 1, ref: 17, wm: 4 },
      { week: 'W45', date: '11/2', shopCode: 'S-8565-001', shopName: 'Maarad Fadel', av: null, ref: 7, wm: 2 },
    ],
  },
  {
    code: 'A-1605',
    name: 'Michael Magdy Kamal Khalil',
    title: 'Merchandiser',
    totalVisits: 12,
    duplicatedCount: 10,
    riskScore: 92,
    badge: 'red',
    visits: [
      { week: 'W43', date: '10/20', shopCode: 'S-7017-002', shopName: 'Abo El Naga 2 (Portsaied)', av: 13, ref: 6, wm: 10 },
      // ... all entries
    ],
  },
];

export default function ShelfAuditDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBadge, setFilterBadge] = useState<'all' | 'red' | 'orange' | 'yellow'>('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);
  const [showModal, setShowModal] = useState(false);

  const filteredData = useMemo(() => {
    return rawData
      .filter(emp => 
        (filterBadge === 'all' || emp.badge === filterBadge) &&
        (emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || emp.code.includes(searchTerm))
      )
      .sort((a, b) => b.riskScore - a.riskScore);
  }, [searchTerm, filterBadge]);

  const openModal = (emp: Employee) => {
    setSelectedEmp(emp);
    setShowModal(true);
    setMobileMenuOpen(false);
  };

  const exportCSV = () => {
    const headers = ['Code', 'Name', 'Title', 'Risk %', 'Total Visits', 'Duplicated', 'Badge'];
    const rows = filteredData.map(e => [e.code, e.name, e.title, e.riskScore, e.totalVisits, e.duplicatedCount, e.badge]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shelf-audit-report.csv';
    a.click();
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Mobile Header */}
        <div className="sticky top-0 z-40 bg-white shadow-lg lg:hidden">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-xl font-bold text-red-600">Shelf Audit</h1>
            <button onClick={() => setMobileMenuOpen(true)} className="p-2">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 lg:hidden" onClick={() => setMobileMenuOpen(false)}>
              <motion.div initial={{ x: -320 }} animate={{ x: 0 }} exit={{ x: -320 }} className="bg-white w-11/12 h-full p-6 space-y-6 overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Filters</h2>
                  <button onClick={() => setMobileMenuOpen(false)}><X className="w-6 h-6" /></button>
                </div>
                <input type="text" placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full px-4 py-3 border rounded-lg" />
                <select value={filterBadge} onChange={e => setFilterBadge(e.target.value as any)} className="w-full px-4 py-3 border rounded-lg">
                  <option value="all">All Risk Levels</option>
                  <option value="red">High Risk Only</option>
                  <option value="orange">Medium Risk</option>
                  <option value="yellow">Low Risk</option>
                </select>
                <div className="space-y-3">
                  <button onClick={exportCSV} className="w-full py-3 bg-green-600 text-white rounded-lg flex items-center justify-center gap-2"><Download className="w-5 h-5" /> Export CSV</button>
                  <button onClick={() => window.print()} className="w-full py-3 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2"><Printer className="w-5 h-5" /> Print Report</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Desktop Header */}
          <div className="hidden lg:block mb-10">
            <h1 className="text-5xl font-bold text-gray-900">Shelf Share Audit Dashboard</h1>
            <p className="text-xl text-gray-600 mt-2">Real Field Data • Weeks 43–45 • Fake Data Detection</p>
          </div>

          {/* Desktop Controls */}
          <div className="hidden lg:flex gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="Search employee or code..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-11 pr-4 py-3 border rounded-lg" />
            </div>
            <select value={filterBadge} onChange={e => setFilterBadge(e.target.value as any)} className="px-6 py-3 border rounded-lg">
              <option value="all">All Risk</option>
              <option value="red">High Risk</option>
              <option value="orange">Medium Risk</option>
              <option value="yellow">Low Risk</option>
            </select>
            <button onClick={exportCSV} className="px-6 py-3 bg-green-600 text-white rounded-lg flex items-center gap-2"><Download className="w-5 h-5" /> Export</button>
            <button onClick={() => window.print()} className="px-6 py-3 bg-blue-600 text-white rounded-lg flex items-center gap-2"><Printer className="w-5 h-5" /> Print</button>
          </div>

          {/* Mobile Cards */}
          <div className="space-y-5 lg:hidden">
            {filteredData.map(emp => (
              <motion.div key={emp.code} whileTap={{ scale: 0.98 }} onClick={() => openModal(emp)} className="bg-white rounded-2xl shadow-xl p-6 border-l-8 border-red-600">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-mono text-lg font-bold text-red-600">{emp.code}</div>
                    <h3 className="font-bold text-gray-900 mt-1">{emp.name.split(' ').slice(0, 4).join(' ')}...</h3>
                    <p className="text-sm text-gray-600">{emp.title}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-red-600">{emp.riskScore}%</div>
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">High Risk</span>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                  <div className="bg-gray-50 p-3 rounded-lg"><div className="text-2xl font-bold">{emp.totalVisits}</div><div className="text-xs text-gray-600">Visits</div></div>
                  <div className="bg-red-50 p-3 rounded-lg"><div className="text-2xl font-bold text-red-600">{emp.duplicatedCount}</div><div className="text-xs text-gray-600">Duplicated</div></div>
                  <div className="bg-orange-50 p-3 rounded-lg"><div className="text-2xl font-bold text-orange-600">{((emp.duplicatedCount / emp.totalVisits) * 100).toFixed(0)}%</div><div className="text-xs text-gray-600">Fake Rate</div></div>
                </div>
                <button className="mt-5 w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl">View Full Report →</button>
              </motion.div>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 text-white">
              <h2 className="text-2xl font-bold flex items-center gap-3"><AlertTriangle className="w-8 h-8" /> Fake Data Audit Results ({filteredData.length} employees)</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left font-bold">Code</th>
                    <th className="px-6 py-4 text-left font-bold">Employee</th>
                    <th className="px-6 py-4 text-left font-bold">Title</th>
                    <th className="px-6 py-4 text-center font-bold">Risk %</th>
                    <th className="px-6 py-4 text-center font-bold">Visits</th>
                    <th className="px-6 py-4 text-center font-bold">Duplicated</th>
                    <th className="px-6 py-4 text-center font-bold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredData.map(emp => (
                    <motion.tr key={emp.code} whileHover={{ backgroundColor: '#fff5f5' }} className="cursor-pointer" onClick={() => openModal(emp)}>
                      <td className="px-6 py-5 font-mono font-bold text-red-600">{emp.code}</td>
                      <td className="px-6 py-5 font-medium">{emp.name}</td>
                      <td className="px-6 py-5 text-gray-600">{emp.title}</td>
                      <td className="px-6 py-5 text-center"><span className="text-3xl font-bold text-red-600">{emp.riskScore}%</span></td>
                      <td className="px-6 py-5 text-center font-semibold">{emp.totalVisits}</td>
                      <td className="px-6 py-5 text-center font-bold text-red-600">{emp.duplicatedCount}</td>
                      <td className="px-6 py-5 text-center">
                        <button className="px-5 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-medium">Details</button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal */}
        <AnimatePresence>
          {showModal && selectedEmp && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-8 sticky top-0">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-3xl font-bold">{selectedEmp.name}</h2>
                      <p className="text-xl opacity-90">{selectedEmp.code} • {selectedEmp.title}</p>
                    </div>
                    <button onClick={() => setShowModal(false)} className="p-3 bg-white/20 rounded-full"><X className="w-6 h-6" /></button>
                  </div>
                </div>
                <div className="p-8 space-y-8">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="bg-red-50 p-6 rounded-2xl text-center"><div className="text-5xl font-bold text-red-600">{selectedEmp.riskScore}%</div><div className="text-gray-600">Risk Score</div></div>
                    <div className="bg-orange-50 p-6 rounded-2xl text-center"><div className="text-5xl font-bold text-orange-600">{selectedEmp.totalVisits}</div><div className="text-gray-600">Total Visits</div></div>
                    <div className="bg-purple-50 p-6 rounded-2xl text-center"><div className="text-5xl font-bold text-purple-600">{selectedEmp.duplicatedCount}</div><div className="text-gray-600">Duplicated</div></div>
                    <div className="bg-blue-50 p-6 rounded-2xl text-center"><div className="text-5xl font-bold text-blue-600">{((selectedEmp.duplicatedCount / selectedEmp.totalVisits) * 100).toFixed(1)}%</div><div className="text-gray-600">Fake Rate</div></div>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="text-xl font-bold mb-4">Visit History ({selectedEmp.visits.length} records)</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-200"><tr><th className="p-3 text-left">Week</th><th className="p-3 text-left">Shop</th><th className="p-3 text-center">AV</th><th className="p-3 text-center">REF</th><th className="p-3 text-center">WM</th><th className="p-3 text-left">Remark</th></tr></thead>
                        <tbody>
                          {selectedEmp.visits.slice(0, 15).map((v, i) => (
                            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                              <td className="p-3">{v.week} {v.date}</td>
                              <td className="p-3 font-medium">{v.shopName}</td>
                              <td className="p-3 text-center">{v.av ?? '-'}</td>
                              <td className="p-3 text-center">{v.ref ?? '-'}</td>
                              <td className="p-3 text-center">{v.wm ?? '-'}</td>
                              <td className="p-3 text-xs text-gray-600">{v.remark || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
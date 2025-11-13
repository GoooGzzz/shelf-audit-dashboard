'use client';

import React, { useState } from 'react';
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
  LineChart,
  Line,
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle,
  TrendingUp,
  Users,
  AlertTriangle,
  X,
  Eye,
  Calendar,
  MapPin,
  Clock,
  Download,
  Filter,
  Search,
  ChevronDown,
  AlertOctagon,
  XCircle,
  RefreshCw,
  Printer,
  Menu,
  ArrowUpDown,
} from 'lucide-react';

interface Employee {
  code: string;
  name: string;
  role: string;
  issue: string;
  details: string;
  percent: number;
  badge: 'red' | 'orange' | 'yellow';
  visits: number;
  duplicated: number;
  lastVisit: string;
  stores: string[];
  trend: number[];
}

const data: Employee[] = [
  { code: 'A-1382', name: 'Ahmed Fathy Ahmed Abd El Mageed', role: 'Field Rep', issue: 'Duplicated Reports', details: '5 stores: 92% identical', percent: 92, badge: 'red', visits: 24, duplicated: 22, lastVisit: 'Nov 10, 2025', stores: ['S-12725-001', 'S-1021-001', 'S-11177-001', 'S-7705-001', 'S-8011-001'], trend: [65, 78, 92] },
  { code: 'A-2120', name: 'Mohamed Abo El Ezz Zaki Mohamed', role: 'Field Rep', issue: 'Static Data', details: 'All 8 visits identical', percent: 100, badge: 'red', visits: 8, duplicated: 8, lastVisit: 'Nov 5, 2025', stores: ['BS-IR-Naga Hamady'], trend: [100, 100, 100] },
  { code: 'A-1862', name: 'Eslam Mahmoud Akl Li Atta Allah', role: 'Field Rep', issue: 'Duplicated Reports', details: '3 stores identical', percent: 88, badge: 'red', visits: 17, duplicated: 15, lastVisit: 'Nov 7, 2025', stores: ['S-11289-001', 'S-7650-001', 'S-7692-001'], trend: [72, 80, 88] },
  { code: 'A-1888', name: 'Ahmed Ali Ahmed Abd El Mageed Ramadan', role: 'Field Rep', issue: 'Duplicated Reports', details: 'S-12677: 100% match', percent: 85, badge: 'red', visits: 20, duplicated: 17, lastVisit: 'Nov 8, 2025', stores: ['S-12677-001', 'S-9035-001', 'S-14075-001'], trend: [70, 82, 85] },
  { code: 'A-2087', name: 'Ahmed Alaa El Deen Ahmed Abd El Aziz', role: 'Field Rep', issue: 'Inconsistent Values', details: 'AV blank drop', percent: 78, badge: 'orange', visits: 18, duplicated: 14, lastVisit: 'Nov 9, 2025', stores: ['S-12679-001', 'S-13475-001', 'S-7781-001'], trend: [85, 75, 78] },
  { code: 'A-2259', name: 'Ahmed Farouk Ahmed El Sayed', role: 'Promoter', issue: 'Minor Variance', details: '13% drop once', percent: 15, badge: 'yellow', visits: 14, duplicated: 2, lastVisit: 'Nov 11, 2025', stores: ['Raya'], trend: [20, 18, 15] },
];

export default function ShelfAuditDashboard() {
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBadge, setFilterBadge] = useState<'all' | 'red' | 'orange' | 'yellow'>('all');
  const [sortBy, setSortBy] = useState<'percent' | 'visits' | 'name'>('percent');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredData = data
    .filter(emp => 
      (filterBadge === 'all' || emp.badge === filterBadge) &&
      (emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || emp.code.includes(searchTerm))
    )
    .sort((a, b) => {
      if (sortBy === 'percent') return b.percent - a.percent;
      if (sortBy === 'visits') return b.visits - a.visits;
      return a.name.localeCompare(b.name);
    });

  const barData = filteredData.map(emp => ({
    name: emp.code,
    value: emp.percent,
    fill: emp.badge === 'red' ? '#e63946' : emp.badge === 'orange' ? '#f77f00' : '#a8dadc',
  }));

  const openModal = (emp: Employee) => {
    setSelectedEmp(emp);
    setShowModal(true);
    setMobileMenuOpen(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setTimeout(() => setSelectedEmp(null), 300);
  };

  const exportData = () => {
    const csv = `Code,Name,Risk %,Issue,Visits,Duplicated\n${filteredData.map(e => `${e.code},"${e.name}",${e.percent},${e.issue},${e.visits},${e.duplicated}`).join('\n')}`;
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
        <div className="sticky top-0 z-40 bg-white shadow-md lg:hidden">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-xl font-bold text-gray-900">Shelf Audit</h1>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            >
              <motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                className="bg-white w-80 h-full p-6 space-y-6 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold">Filters</h2>
                  <button onClick={() => setMobileMenuOpen(false)}>
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg"
                  />
                  <select
                    value={filterBadge}
                    onChange={(e) => setFilterBadge(e.target.value as any)}
                    className="w-full px-4 py-3 border rounded-lg"
                  >
                    <option value="all">All Risk Levels</option>
                    <option value="red">High Risk Only</option>
                    <option value="orange">Medium Risk</option>
                    <option value="yellow">Low Risk</option>
                  </select>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full px-4 py-3 border rounded-lg"
                  >
                    <option value="percent">Highest Risk First</option>
                    <option value="visits">Most Visits</option>
                    <option value="name">Name A-Z</option>
                  </select>
                </div>

                <div className="pt-6 space-y-3">
                  <button onClick={exportData} className="w-full flex items-center justify-center gap-2 py-3 bg-green-600 text-white rounded-lg">
                    <Download className="w-5 h-5" /> Export CSV
                  </button>
                  <button onClick={() => window.print()} className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-lg">
                    <Printer className="w-5 h-5" /> Print Report
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="max-w-7xl mx-auto px-4 py-6 lg:py-12">
          {/* Desktop Header */}
          <div className="hidden lg:block mb-10">
            <h1 className="text-5xl font-bold text-gray-900">Shelf Share Audit Dashboard</h1>
            <p className="text-xl text-gray-600 mt-2">Weeks 43–45 • Real-time Fake Data Detection</p>
          </div>

          {/* Desktop Controls */}
          <div className="hidden lg:grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search employee or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </div>
            <select value={filterBadge} onChange={(e) => setFilterBadge(e.target.value as any)} className="px-4 py-3 border rounded-lg">
              <option value="all">All Risk Levels</option>
              <option value="red">High Risk Only</option>
              <option value="orange">Medium Risk</option>
              <option value="yellow">Low Risk</option>
            </select>
            <div className="flex gap-3">
              <button onClick={exportData} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg">
                <Download className="w-5 h-5" /> Export
              </button>
              <button onClick={() => window.print()} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg">
                <Printer className="w-5 h-5" /> Print
              </button>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="space-y-4 lg:hidden">
            {filteredData.map((emp) => (
              <motion.div
                key={emp.code}
                whileTap={{ scale: 0.98 }}
                onClick={() => openModal(emp)}
                className="bg-white rounded-xl shadow-lg p-5 border-l-8 border-red-600"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-mono font-bold text-lg text-red-600">{emp.code}</div>
                    <h3 className="font-semibold text-gray-900 mt-1">{emp.name.split(' ').slice(0, 3).join(' ')}...</h3>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-red-600">{emp.percent}%</div>
                    <span className="text-xs text-gray-500">Risk Score</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className={`px-3 py-1 rounded-full font-bold ${emp.badge === 'red' ? 'bg-red-100 text-red-800' : emp.badge === 'orange' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
                    {emp.issue}
                  </span>
                  <span className="text-gray-600">{emp.visits} visits</span>
                </div>
                <button className="mt-4 w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium">
                  View Details →
                </button>
              </motion.div>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-5 text-white">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <AlertOctagon className="w-7 h-7" />
                  Audit Results ({filteredData.length})
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Code</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Employee</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Issue</th>
                      <th className="px-6 py-4 text-center text-sm font-bold text-gray-900 flex items-center justify-center gap-1">
                        Risk % <ArrowUpDown className="w-4 h-4" />
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">Visits</th>
                      <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredData.map((emp) => (
                      <motion.tr
                        key={emp.code}
                        whileHover={{ backgroundColor: '#fef2f2' }}
                        onClick={() => openModal(emp)}
                        className="cursor-pointer"
                      >
                        <td className="px-6 py-5 font-mono font-bold text-red-600">{emp.code}</td>
                        <td className="px-6 py-5">
                          <div className="font-medium">{emp.name}</div>
                          <div className="text-sm text-gray-500">{emp.role}</div>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`inline-block px-4 py-2 rounded-full text-xs font-bold ${emp.badge === 'red' ? 'bg-red-100 text-red-800' : emp.badge === 'orange' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
                            {emp.issue}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <div className={`text-3xl font-bold ${emp.percent > 80 ? 'text-red-600' : emp.percent > 60 ? 'text-orange-600' : 'text-green-600'}`}>
                            {emp.percent}%
                          </div>
                        </td>
                        <td className="px-6 py-5 text-center font-semibold">{emp.visits}</td>
                        <td className="px-6 py-5 text-center">
                          <button className="px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-medium hover:shadow-lg">
                            View Details
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Charts - Hidden on mobile, shown on large screens */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-8 mt-12">
            <motion.div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-4">Risk Overview</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} height={70} textAnchor="end" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  {barData.map((entry, i) => (
                    <Bar key={i} dataKey="value" fill={entry.fill} radius={[8, 8, 0, 0]} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-4">Risk Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={[{name:'High',value:5},{name:'Medium',value:1},{name:'Low',value:1}]} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label>
                    <Cell fill="#e63946" />
                    <Cell fill="#f77f00" />
                    <Cell fill="#a8dadc" />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </div>

        {/* Modal - Full screen on mobile */}
        <AnimatePresence>
          {showModal && selectedEmp && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4" onClick={closeModal}>
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 sticky top-0">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl lg:text-3xl font-bold">{selectedEmp.name}</h2>
                      <p className="text-lg opacity-90">Code: {selectedEmp.code}</p>
                    </div>
                    <button onClick={closeModal} className="p-3 bg-white/20 rounded-full">
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-red-50 p-5 rounded-xl text-center">
                      <div className="text-4xl font-bold text-red-600">{selectedEmp.percent}%</div>
                      <div className="text-sm text-gray-600 mt-1">Risk Score</div>
                    </div>
                    <div className="bg-orange-50 p-5 rounded-xl text-center">
                      <div className="text-4xl font-bold text-orange-600">{selectedEmp.visits}</div>
                      <div className="text-sm text-gray-600 mt-1">Total Visits</div>
                    </div>
                    <div className="bg-gray-100 p-5 rounded-xl text-center">
                      <div className="text-4xl font-bold text-gray-800">{selectedEmp.duplicated}</div>
                      <div className="text-sm text-gray-600 mt-1">Duplicated</div>
                    </div>
                    <div className="bg-blue-50 p-5 rounded-xl text-center">
                      <div className="text-lg font-bold text-blue-700">{selectedEmp.role}</div>
                      <div className="text-sm text-gray-600 mt-1">Role</div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="font-bold text-lg mb-3">Stores Visited ({selectedEmp.stores.length})</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedEmp.stores.map((store, i) => (
                        <div key={i} className="bg-white px-4 py-3 rounded-lg font-mono text-sm">
                          {store}
                        </div>
                      ))}
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
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
}

const data: Employee[] = [
  {
    code: 'A-1382',
    name: 'Ahmed Fathy Ahmed Abd El Mageed',
    role: 'Field Rep',
    issue: 'Duplicated Reports',
    details: '5 stores: 92% identical data',
    percent: 92,
    badge: 'red',
    visits: 24,
    duplicated: 22,
    lastVisit: 'Nov 10, 2025',
    stores: ['S-12725-001', 'S-1021-001', 'S-11177-001', 'S-7705-001', 'S-8011-001'],
  },
  {
    code: 'A-1888',
    name: 'Ahmed Ali Ahmed Abd El Mageed Ramadan',
    role: 'Field Rep',
    issue: 'Duplicated Reports',
    details: 'S-12677: 100% match',
    percent: 85,
    badge: 'red',
    visits: 20,
    duplicated: 17,
    lastVisit: 'Nov 8, 2025',
    stores: ['S-12677-001', 'S-9035-001', 'S-14075-001'],
  },
  {
    code: 'A-2087',
    name: 'Ahmed Alaa El Deen Ahmed Abd El Aziz',
    role: 'Field Rep',
    issue: 'Inconsistent Values',
    details: 'AV blank drop',
    percent: 78,
    badge: 'orange',
    visits: 18,
    duplicated: 14,
    lastVisit: 'Nov 9, 2025',
    stores: ['S-12679-001', 'S-13475-001', 'S-7781-001'],
  },
  {
    code: 'A-1862',
    name: 'Eslam Mahmoud Akl Li Atta Allah',
    role: 'Field Rep',
    issue: 'Duplicated Reports',
    details: '3 stores identical',
    percent: 88,
    badge: 'red',
    visits: 17,
    duplicated: 15,
    lastVisit: 'Nov 7, 2025',
    stores: ['S-11289-001', 'S-7650-001', 'S-7692-001'],
  },
  {
    code: 'A-2120',
    name: 'Mohamed Abo El Ezz Zaki Mohamed',
    role: 'Field Rep',
    issue: 'Static Data',
    details: 'All 8 visits identical',
    percent: 100,
    badge: 'red',
    visits: 8,
    duplicated: 8,
    lastVisit: 'Nov 5, 2025',
    stores: ['BS-IR-Naga Hamady'],
  },
  {
    code: 'A-2259',
    name: 'Ahmed Farouk Ahmed El Sayed',
    role: 'Promoter',
    issue: 'Minor Variance',
    details: '13% drop once',
    percent: 15,
    badge: 'yellow',
    visits: 14,
    duplicated: 2,
    lastVisit: 'Nov 11, 2025',
    stores: ['Raya'],
  },
];

const COLORS = ['#e63946', '#f77f00', '#fcbf49', '#a8dadc'];

export default function ShelfAuditDashboard() {
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);
  const [showModal, setShowModal] = useState(false);

  const openModal = (emp: Employee) => {
    setSelectedEmp(emp);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setTimeout(() => setSelectedEmp(null), 300);
  };

  const barData = data.map((d, i) => ({
    name: d.code,
    value: d.percent,
    fill: COLORS[i % COLORS.length],
  }));

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">Shelf Share Audit Dashboard</h1>
            <p className="text-xl text-gray-600">Weeks 43–45 | Fake Data Detection</p>
          </motion.div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Bar Chart – FIXED */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-red-600" />
                Risk % by Employee
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  {barData.map((entry, index) => (
                    <Bar key={index} dataKey="value" fill={entry.fill} radius={[4, 4, 0, 0]} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Pie Chart */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Users className="w-6 h-6 text-orange-600" />
                Risk Distribution
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'High Risk', value: 5 },
                      { name: 'Medium Risk', value: 1 },
                      { name: 'Low Risk', value: 1 },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                    label
                  >
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

          {/* Table */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 text-white">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Audit Results (Click View)
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Code</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Issue</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Details</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Risk %</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.map((emp) => (
                    <tr key={emp.code} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-mono font-medium">{emp.code}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{emp.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{emp.role}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                            emp.badge === 'red'
                              ? 'bg-red-100 text-red-800'
                              : emp.badge === 'orange'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {emp.issue}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-sm truncate">{emp.details}</td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`text-lg font-bold ${
                            emp.badge === 'red'
                              ? 'text-red-600'
                              : emp.badge === 'orange'
                              ? 'text-orange-600'
                              : 'text-green-600'
                          }`}
                        >
                          {emp.percent}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => openModal(emp)}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-xs rounded-full hover:bg-blue-700 transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Immediate Actions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-12 bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <AlertCircle className="w-8 h-8" />
              Immediate Actions Required
            </h3>
            <div className="grid md:grid-cols-2 gap-6 text-lg">
              <div className="bg-red-800/20 p-6 rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <span className="text-red-400 font-bold">[WARNING]</span> High Risk (&gt;80%)
                </h4>
                <p>A-1382, A-2120, A-1862 → <strong>Suspend &amp; Retrain</strong></p>
              </div>
              <div className="bg-red-800/20 p-6 rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <span className="text-red-400 font-bold">[LOCK]</span> Enforcement
                </h4>
                <p>GPS + Photo + Timestamp <strong>mandatory</strong> per visit</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Detailed Modal */}
      <AnimatePresence>
        {showModal && selectedEmp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 rounded-t-2xl">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedEmp.name}</h2>
                    <p className="text-red-100 mt-1">Code: {selectedEmp.code}</p>
                  </div>
                  <button onClick={closeModal} className="text-white hover:bg-white/20 p-2 rounded-full">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-red-600">{selectedEmp.percent}%</div>
                    <div className="text-sm text-gray-600">Risk Score</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-orange-600">{selectedEmp.visits}</div>
                    <div className="text-sm text-gray-600">Total Visits</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-red-600">{selectedEmp.duplicated}</div>
                    <div className="text-sm text-gray-600">Duplicated</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-sm font-medium text-gray-800">{selectedEmp.role}</div>
                    <div className="text-xs text-gray-600">Role</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                      selectedEmp.badge === 'red'
                        ? 'bg-red-100 text-red-800'
                        : selectedEmp.badge === 'orange'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {selectedEmp.issue}
                  </span>
                  <span className="text-gray-600">• {selectedEmp.details}</span>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Recent Activity
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      Last visit: <strong>{selectedEmp.lastVisit}</strong>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      Stores covered: <strong>{selectedEmp.stores.length}</strong>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Stores Visited</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedEmp.stores.map((store, i) => (
                      <div key={i} className="bg-gray-50 px-3 py-2 rounded text-sm font-mono">
                        {store}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
                    Export Report
                  </button>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                    Flag for Review
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
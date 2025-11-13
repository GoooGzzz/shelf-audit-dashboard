'use client';

import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Brush,
  AreaChart,
  Area,
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Menu,
  X,
  Store,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Eye,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from 'lucide-react';

interface WeeklyData {
  week: string;
  av: number;
  ref: number;
  wm: number;
  visits: number;
  fakeScore: number;
}

interface Shop {
  code: string;
  name: string;
  badge: 'red' | 'orange' | 'yellow';
  riskScore: number;
  fakeRate: number;
  totalVisits: number;
  duplicated: number;
  trend: WeeklyData[];
}

const shopsData: Shop[] = [
  {
    code: 'S-12677-001',
    name: 'Abo Yousef (Talkha)',
    badge: 'red',
    riskScore: 96,
    fakeRate: 83.3,
    totalVisits: 6,
    duplicated: 5,
    trend: [
      { week: 'W43', av: 4, ref: 11, wm: 6, visits: 1, fakeScore: 10 },
      { week: 'W44', av: 4, ref: 12, wm: 6, visits: 3, fakeScore: 30 },
      { week: 'W45', av: 0, ref: 12, wm: 6, visits: 2, fakeScore: 95 },
    ],
  },
  {
    code: 'S-7017-002',
    name: 'Abo El Naga 2 (Portsaied)',
    badge: 'red',
    riskScore: 94,
    fakeRate: 83,
    totalVisits: 6,
    duplicated: 5,
    trend: [
      { week: 'W43', av: 13, ref: 6, wm: 10, visits: 2, fakeScore: 15 },
      { week: 'W44', av: 14, ref: 6, wm: 10, visits: 3, fakeScore: 40 },
      { week: 'W45', av: 0, ref: 6, wm: 10, visits: 1, fakeScore: 98 },
    ],
  },
  {
    code: 'S-14075-001',
    name: 'Mohamed Zoghly (Mansoura)',
    badge: 'orange',
    riskScore: 68,
    fakeRate: 50,
    totalVisits: 2,
    duplicated: 1,
    trend: [
      { week: 'W44', av: 10, ref: 15, wm: 12, visits: 1, fakeScore: 30 },
      { week: 'W45', av: 6, ref: 16, wm: 11, visits: 1, fakeScore: 70 },
    ],
  },
];

export default function InteractiveShopTrends() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBadge, setFilterBadge] = useState<'all' | 'red' | 'orange' | 'yellow'>('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [hoveredLine, setHoveredLine] = useState<string | null>(null);

  const filteredShops = useMemo(() => {
    return shopsData
      .filter(s => 
        (filterBadge === 'all' || s.badge === filterBadge) &&
        (s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.code.includes(searchTerm))
      )
      .sort((a, b) => b.riskScore - a.riskScore);
  }, [searchTerm, filterBadge]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-xl shadow-2xl border border-gray-200">
          <p className="font-bold text-lg">{label}</p>
          {payload.map((entry: any) => (
            <div key={entry.name} className="flex items-center gap-3 mt-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: entry.color }} />
              <span className="font-medium">{entry.name}:</span>
              <span className="font-bold">{entry.value}</span>
            </div>
          ))}
          <div className="mt-3 pt-3 border-t">
            <span className="text-red-600 font-bold">Fake Score: {payload[0].payload.fakeScore}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-white/95 backdrop-blur shadow-lg border-b">
          <div className="max-w-7xl mx-auto px-4 py-5 flex items-center justify-between">
            <div>
              <h1 className="text-2xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                Interactive Shop Trends
              </h1>
              <p className="text-sm lg:text-lg text-gray-600">Hover • Zoom • Brush • Detect Fake Patterns</p>
            </div>
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Desktop Filters */}
          <div className="hidden lg:flex gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search shop..." 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)} 
                className="w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-4 focus:ring-purple-300 focus:outline-none transition-all"
              />
            </div>
            <select value={filterBadge} onChange={e => setFilterBadge(e.target.value as any)} className="px-6 py-3 border rounded-xl focus:ring-4 focus:ring-purple-300">
              <option value="all">All Risk</option>
              <option value="red">High Risk Only</option>
              <option value="orange">Medium Risk</option>
              <option value="yellow">Low Risk</option>
            </select>
          </div>

          {/* Interactive Shop Cards - Desktop */}
          <div className="hidden lg:grid grid-cols-1 gap-10">
            {filteredShops.map(shop => (
              <motion.div
                key={shop.code}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
                onClick={() => {
                  setSelectedShop(shop);
                  setShowModal(true);
                }}
              >
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-3xl font-bold">{shop.name}</h3>
                      <p className="text-lg opacity-90">{shop.code}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-5xl font-black">{shop.riskScore}%</div>
                      <span className="text-sm bg-white/30 px-4 py-2 rounded-full font-bold">FAKE RISK</span>
                    </div>
                  </div>
                </div>

                <div className="p-8 cursor-pointer">
                  <ResponsiveContainer width="100%" height={320}>
                    <AreaChart 
                      data={shop.trend}
                      onMouseLeave={() => setHoveredLine(null)}
                    >
                      <defs>
                        <linearGradient id="avGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="refGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>

                      <CartesianGrid strokeDasharray="4 4" stroke="#e0e0e0" />
                      <XAxis dataKey="week" tick={{ fontWeight: 'bold' }} />
                      <YAxis tick={{ fontWeight: 'bold' }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend 
                        wrapperStyle={{ paddingTop: '20px' }}
                        iconType="circle"
                      />

                      <Area
                        type="monotone"
                        dataKey="av"
                        stroke="#8b5cf6"
                        strokeWidth={hoveredLine === 'av' ? 6 : 4}
                        fillOpacity={1}
                        fill="url(#avGradient)"
                        name="AV Share"
                        onMouseEnter={() => setHoveredLine('av')}
                        onMouseLeave={() => setHoveredLine(null)}
                      />
                      <Area
                        type="monotone"
                        dataKey="ref"
                        stroke="#3b82f6"
                        strokeWidth={hoveredLine === 'ref' ? 6 : 4}
                        fillOpacity={1}
                        fill="url(#refGradient)"
                        name="REF Share"
                        onMouseEnter={() => setHoveredLine('ref')}
                        onMouseLeave={() => setHoveredLine(null)}
                      />
                      <Line
                        type="monotone"
                        dataKey="wm"
                        stroke="#10b981"
                        strokeWidth={hoveredLine === 'wm' ? 6 : 4}
                        dot={{ r: 8 }}
                        name="WM Share"
                        onMouseEnter={() => setHoveredLine('wm')}
                        onMouseLeave={() => setHoveredLine(null)}
                      />

                      <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="5 5" />
                      <Brush 
                        dataKey="week" 
                        height={40} 
                        stroke="#8b5cf6"
                        travellerWidth={15}
                        className="mt-10"
                      />
                    </AreaChart>
                  </ResponsiveContainer>

                  <div className="flex justify-center gap-4 mt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-red-600">{shop.fakeRate.toFixed(1)}%</div>
                      <div className="text-sm text-gray-600">Fake Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600">{shop.duplicated}</div>
                      <div className="text-sm text-gray-600">Fake Entries</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-indigo-600">{shop.totalVisits}</div>
                      <div className="text-sm text-gray-600">Total Visits</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile Version - Tap to Zoom */}
          <div className="space-y-6 lg:hidden">
            {filteredShops.map(shop => (
              <motion.div
                key={shop.code}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedShop(shop);
                  setShowModal(true);
                }}
                className="bg-white rounded-3xl shadow-2xl p-6 border-l-8 border-purple-600"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{shop.name}</h3>
                    <p className="text-sm text-gray-600">{shop.code}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-black text-red-600">{shop.riskScore}%</div>
                    <span className="text-xs bg-red-100 text-red-800 px-3 py-1 rounded-full font-bold">HIGH RISK</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-100 to-indigo-100 p-4 rounded-2xl">
                  <div className="text-center">
                    <p className="text-sm text-gray-700">Latest Week</p>
                    <div className="text-3xl font-bold mt-2">
                      {shop.trend[shop.trend.length - 1].av}/{shop.trend[shop.trend.length - 1].ref}/{shop.trend[shop.trend.length - 1].wm}
                    </div>
                  </div>
                </div>

                <button className="mt-5 w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-2xl flex items-center justify-center gap-3">
                  <ZoomIn className="w-6 h-6" />
                  Tap for Interactive Trend
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Full Interactive Modal */}
        <AnimatePresence>
          {showModal && selectedShop && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="bg-white rounded-3xl shadow-3xl max-w-5xl w-full max-h-[95vh] overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-8">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-4xl font-black">{selectedShop.name}</h2>
                      <p className="text-xl opacity-90">{selectedShop.code}</p>
                    </div>
                    <button onClick={() => setShowModal(false)} className="p-3 bg-white/20 rounded-full hover:bg-white/30 transition">
                      <X className="w-8 h-8" />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <ResponsiveContainer width="100%" height={500}>
                    <AreaChart data={selectedShop.trend}>
                      <CartesianGrid strokeDasharray="5 5" />
                      <XAxis dataKey="week" tick={{ fontSize: 16, fontWeight: 'bold' }} />
                      <YAxis tick={{ fontSize: 14 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: '18px', paddingTop: '20px' }} />
                      
                      <Area type="monotone" dataKey="av" stroke="#8b5cf6" fill="#c4b5fd" strokeWidth={6} name="AV Share" />
                      <Area type="monotone" dataKey="ref" stroke="#3b82f6" fill="#93c5fd" strokeWidth={6} name="REF Share" />
                      <Line type="monotone" dataKey="wm" stroke="#10b981" strokeWidth={6} dot={{ r: 10 }} name="WM Share" />

                      <Brush 
                        dataKey="week" 
                        height={60} 
                        stroke="#8b5cf6"
                        travellerWidth={20}
                        className="mt-10"
                      />
                    </AreaChart>
                  </ResponsiveContainer>

                  <div className="mt-8 bg-red-50 border-2 border-red-300 rounded-2xl p-6 text-center">
                    <AlertTriangle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                    <p className="text-3xl font-black text-red-600">{selectedShop.riskScore}% Fake Risk</p>
                    <p className="text-lg text-gray-700 mt-2">AV crashed while REF/WM stayed high → Classic fake pattern</p>
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
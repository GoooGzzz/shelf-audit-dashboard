// src/app/page.tsx
'use client';

import { useState, useMemo } from 'react';
import { CSVParser } from '@/lib/csv/parseCSV';
import { validateRows } from '@/lib/csv/validateWithZod';
import type { AuditRow } from '@/lib/csv/schema';
import CSVCharts from '@/components/CSVCharts';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Text } from '@react-three/drei';
import { Tooltip } from 'react-tooltip';
import { 
  Upload, Download, Moon, Sun, Menu, X, Search, Filter, 
  AlertCircle, CheckCircle2, Activity, BarChart3, PieChartIcon,
  TrendingUp, Package, Calendar, User, FileText
} from 'lucide-react';

function Shelf3D({ data }: { data: AuditRow[] }) {
  const maxQty = Math.max(...data.map(r => r.quantity), 1);
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      {data.slice(0, 50).map((row, i) => (
        <Box key={i} position={[i % 10 * 1.5 - 7.5, row.quantity / maxQty * 5, Math.floor(i / 10) * 1.5 - 5]}>
          <meshStandardMaterial color={row.quantity === 0 ? '#ef4444' : row.quantity < 10 ? '#f59e0b' : '#10b981'} />
        </Box>
      ))}
      <OrbitControls />
    </>
  );
}

export default function Home() {
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [errors, setErrors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedTab, setSelectedTab] = useState('overview');

  const stats = useMemo(() => {
    if (!rows.length) return { total: 0, outOfStock: 0, lowStock: 0, locations: 0 };
    const outOfStock = rows.filter(r => r.quantity === 0).length;
    const lowStock = rows.filter(r => r.quantity > 0 && r.quantity < 10).length;
    const locations = new Set(rows.map(r => r.location)).size;
    return { total: rows.length, outOfStock, lowStock, locations };
  }, [rows]);

  const filtered = useMemo(() => 
    rows.filter(r => r.sku.toLowerCase().includes(search.toLowerCase()) || r.location.includes(search)),
    [rows, search]
  );

  const handleFile = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const parsed = await CSVParser.parse(file);
      const { valid, errors } = validateRows(parsed);
      setRows(valid);
      setErrors(errors);
    } catch (err) { alert('Failed to parse CSV'); }
    finally { setLoading(false); }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-950 text-white' : 'bg-gradient-to-br from-blue-50 to-indigo-100'} transition-all`}>
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform ${darkMode ? 'bg-black/90' : 'bg-white/95'} backdrop-blur-xl shadow-2xl`}>
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Shelf Audit Pro
          </h1>
        </div>
        <nav className="p-4 space-y-2">
          {[
            { id: 'overview', icon: BarChart3, label: 'Dashboard Overview' },
            { id: '3d', icon: Package, label: '3D Shelf View' },
            { id: 'charts', icon: PieChartIcon, label: 'Analytics' },
            { id: 'data', icon: FileText, label: 'Raw Data Table' },
            { id: 'logs', icon: Activity, label: 'Audit Logs' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setSelectedTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                selectedTab === item.id 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                  : 'hover:bg-gray-800/50'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className={`transition-all ${sidebarOpen ? 'ml-72' : 'ml-0'}`}>
        <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 dark:bg-black/70 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between p-6">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-800">
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="flex items-center gap-4">
              <button onClick={() => setDarkMode(!darkMode)} className="p-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-800">
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <label className="cursor-pointer">
                <input type="file" accept=".csv" onChange={handleFile} className="hidden" />
                <div className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all">
                  <Upload className="w-5 h-5" /> Upload CSV
                </div>
              </label>
            </div>
          </div>
        </header>

        <main className="p-8">
          {loading && <div className="text-center text-2xl">Processing 10,000+ rows...</div>}

          {rows.length > 0 && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[
                  { label: 'Total Items', value: stats.total.toLocaleString(), icon: Package, color: 'from-blue-500 to-cyan-500' },
                  { label: 'Out of Stock', value: stats.outOfStock, icon: AlertCircle, color: 'from-red-500 to-pink-500' },
                  { label: 'Low Stock', value: stats.lowStock, icon: TrendingUp, color: 'from-orange-500 to-yellow-500' },
                  { label: 'Locations/Dates', value: stats.locations, icon: Calendar, color: 'from-purple-500 to-indigo-500' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center mb-4`}>
                      <stat.icon className="w-7 h-7 text-white" />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Dynamic Content */}
              {selectedTab === '3d' && (
                <div className="bg-black rounded-3xl h-96 overflow-hidden shadow-2xl">
                  <Canvas camera={{ position: [0, 10, 20], fov: 60 }}>
                    <Shelf3D data={rows} />
                  </Canvas>
                </div>
              )}

              {selectedTab === 'charts' && <CSVCharts rows={filtered} />}

              {selectedTab === 'overview' && (
                <div className="text-center py-20">
                  <h2 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                    Welcome to Shelf Audit Pro
                  </h2>
                  <p className="text-xl text-gray-600 dark:text-gray-400">Upload your CSV to see 3D visualization, analytics, and insights</p>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
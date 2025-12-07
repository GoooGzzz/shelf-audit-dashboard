// src/app/page.tsx
'use client';

import { useState, useMemo } from 'react';
import { CSVParser } from '@/lib/csv/parseCSV';
import { validateRows } from '@/lib/csv/validateWithZod';
import type { AuditRow } from '@/lib/csv/schema';
import CSVCharts from '@/components/CSVCharts';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Text, gridHelper } from '@react-three/drei';
import { 
  Upload, Download, Moon, Sun, Menu, X, Search, 
  AlertCircle, CheckCircle2, Activity, BarChart3, PieChartIcon,
  Package, Calendar, FileText
} from 'lucide-react';

function Shelf3D({ data }: { data: AuditRow[] }) {
  const maxQty = Math.max(...data.map(r => r.quantity), 1);

  return (
    <>
      <ambientLight intensity={0.7} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <directionalLight position={[0, 10, 5]} intensity={0.8} />

      {data.slice(0, 120).map((row, i) => {
        const height = Math.max(0.5, (row.quantity / maxQty) * 10);
        const color = row.quantity === 0 ? '#dc2626' : row.quantity < 10 ? '#f97316' : '#16a34a';

        return (
          <group key={i} position={[i % 12 * 1.8 - 10, height / 2, Math.floor(i / 12) * 1.8 - 8]}>
            <Box args={[1.6, height, 1.6]}>
              <meshStandardMaterial color={color} />
            </Box>
            <Text position={[0, height + 0.8, 0]} fontSize={0.4} color="white" anchorX="center">
              {row.sku.slice(0, 10)}
            </Text>
            <Text position={[0, height + 1.4, 0]} fontSize={0.6} color="white" fontWeight="bold" anchorX="center">
              {row.quantity}
            </Text>
          </group>
        );
      })}

      <OrbitControls enablePan enableZoom enableRotate />
      <gridHelper args={[40, 40]} />
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
    return {
      total: rows.length,
      outOfStock: rows.filter(r => r.quantity === 0).length,
      lowStock: rows.filter(r => r.quantity > 0 && r.quantity < 10).length,
      locations: new Set(rows.map(r => r.location)).size,
    };
  }, [rows]);

  const filtered = useMemo(() => 
    rows.filter(r => 
      r.sku.toLowerCase().includes(search.toLowerCase()) || 
      r.location.includes(search)
    ), [rows, search]
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
    } catch (err) {
      alert('Failed to parse CSV');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-950 text-white' : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50'} transition-all`}>
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-80 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform ${darkMode ? 'bg-black/95' : 'bg-white/95'} backdrop-blur-2xl shadow-2xl border-r border-gray-800/50`}>
        <div className="p-8 border-b border-gray-800">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Shelf Audit Pro
          </h1>
        </div>
        <nav className="p-6 space-y-3">
          {[
            { id: 'overview', icon: BarChart3, label: 'Dashboard Overview' },
            { id: '3d', icon: Package, label: '3D Warehouse View' },
            { id: 'charts', icon: PieChartIcon, label: 'Analytics & Charts' },
            { id: 'data', icon: FileText, label: 'Raw Data Table' },
            { id: 'logs', icon: Activity, label: 'Audit Trail' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setSelectedTab(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all text-left font-medium ${
                selectedTab === item.id 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl' 
                  : 'hover:bg-gray-800/50 text-gray-400 hover:text-white'
              }`}
            >
              <item.icon className="w-6 h-6" />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div className={`transition-all ${sidebarOpen ? 'ml-80' : 'ml-0'}`}>
        <header className="sticky top-0 z-40 backdrop-blur-2xl bg-white/70 dark:bg-black/70 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between p-6">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-3 rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-800 transition">
              {sidebarOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
            <div className="flex items-center gap-4">
              <button onClick={() => setDarkMode(!darkMode)} className="p-3 rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-800">
                {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
              </button>
              <label className="cursor-pointer">
                <input type="file" accept=".csv" onChange={handleFile} className="hidden" />
                <div className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl shadow-2xl hover:shadow-pink-500/50 transition-all font-bold text-lg">
                  <Upload className="w-6 h-6" /> Upload CSV
                </div>
              </label>
            </div>
          </div>
        </header>

        <main className="p-8">
          {loading && (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-8 border-purple-600 border-t-transparent"></div>
              <p className="mt-6 text-2xl font-bold">Analyzing 10,000+ items...</p>
            </div>
          )}

          {rows.length > 0 && (
            <>
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                {[
                  { label: 'Total SKUs', value: stats.total.toLocaleString(), icon: Package, color: 'from-blue-500 to-cyan-500' },
                  { label: 'Out of Stock', value: stats.outOfStock, icon: AlertCircle, color: 'from-red-500 to-rose-500' },
                  { label: 'Low Stock (<10)', value: stats.lowStock, icon: TrendingUp, color: 'from-orange-500 to-amber-500' },
                  { label: 'Unique Dates', value: stats.locations, icon: Calendar, color: 'from-purple-500 to-pink-500' },
                ].map((s, i) => (
                  <div key={i} className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${s.color} flex items-center justify-center mb-6`}>
                      <s.icon className="w-9 h-9 text-white" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{s.label}</p>
                    <p className="text-4xl font-bold mt-2">{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Content Tabs */}
              {selectedTab === '3d' && (
                <div className="bg-black rounded-3xl h-screen max-h-[800px] overflow-hidden shadow-3xl border-4 border-purple-600/50">
                  <Canvas camera={{ position: [0, 15, 30], fov: 60 }}>
                    <Shelf3D data={rows} />
                  </Canvas>
                </div>
              )}

              {selectedTab === 'charts' && <CSVCharts rows={filtered} />}

              {selectedTab === 'overview' && (
                <div className="text-center py-32">
                  <h1 className="text-8xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-8">
                    Shelf Audit Pro
                  </h1>
                  <p className="text-2xl text-gray-600 dark:text-gray-300">The most advanced inventory audit dashboard ever built.</p>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
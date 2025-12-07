// src/app/page.tsx
'use client';

import { useState, useMemo } from 'react';
import { CSVParser } from '@/lib/csv/parseCSV';
import { validateRows } from '@/lib/csv/validateWithZod';
import type { AuditRow } from '@/lib/csv/schema';
import CSVCharts from '@/components/CSVCharts';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Text, Grid, Stars, Environment } from '@react-three/drei';
import { Upload, Download, Moon, Sun, Menu, X, Package, AlertCircle, TrendingUp, Calendar, BarChart3, Activity, FileText } from 'lucide-react';

function Shelf3D({ data }: { data: AuditRow[] }) {
  const maxQty = Math.max(...data.map(r => r.quantity), 1);

  return (
    <>
      <color attach="background" args={['#0f172a']} />
      <fog attach="fog" args={['#0f172a', 10, 50]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow />
      <pointLight position={[-10, 10, -10]} intensity={0.8} color="#6366f1" />

      {/* 3D Boxes with Realistic Height & Labels */}
      {data.slice(0, 150).map((row, i) => {
        const height = Math.max(0.3, (row.quantity / maxQty) * 12);
        const color = row.quantity === 0 ? '#dc2626' : row.quantity < 10 ? '#f97316' : '#16a34a';

        return (
          <group key={i} position={[i % 15 * 1.8 - 13, height / 2, Math.floor(i / 15) * 1.8 - 10]}>
            <Box args={[1.6, height, 1.6]} castShadow receiveShadow>
              <meshStandardMaterial color={color} roughness={0.4} metalness={0.6} />
            </Box>

            {/* SKU Label */}
            <Text
              position={[0, height + 0.8, 0]}
              fontSize={0.45}
              color="white"
              font="/fonts/inter-v12-latin-700.woff"
              anchorX="center"
              anchorY="middle"
            >
              {row.sku}
            </Text>

            {/* Quantity Badge */}
            <Text
              position={[0, height + 1.6, 0]}
              fontSize={0.8}
              color="white"
              font="/fonts/inter-v12-latin-900.woff"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.1}
              outlineColor="#000"
            >
              {row.quantity}
            </Text>
          </group>
        );
      })}

      {/* Floor Grid */}
      <Grid
        args={[50, 50]}
        cellSize={2}
        cellThickness={1}
        cellColor="#4b5563"
        sectionSize={10}
        sectionThickness={1.5}
        sectionColor="#6366f1"
        fadeDistance={50}
        fadeStrength={1}
        position={[0, -0.01, 0]}
      />

      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        minDistance={10}
        maxDistance={80}
        maxPolarAngle={Math.PI / 2.2}
      />

      <Environment preset="night" />
    </>
  );
}

export default function Home() {
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [errors, setErrors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [selectedTab, setSelectedTab] = useState('overview');

  const stats = useMemo(() => {
    if (!rows.length) return { total: 0, outOfStock: 0, lowStock: 0, uniqueDates: 0 };
    return {
      total: rows.length,
      outOfStock: rows.filter(r => r.quantity === 0).length,
      lowStock: rows.filter(r => r.quantity > 0 && r.quantity < 10).length,
      uniqueDates: new Set(rows.map(r => r.location)).size,
    };
  }, [rows]);

  const handleFile = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const parsed = await CSVParser.parse(file);
      const { valid, errors } = validateRows(parsed);
      setRows(valid);
      setErrors(errors);
    } catch {
      alert('Failed to parse CSV');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50'} transition-all duration-1000`}>
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-80 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform ${darkMode ? 'bg-black/95 border-r border-purple-500/20' : 'bg-white/95'} backdrop-blur-3xl shadow-2xl`}>
        <div className="p-8 border-b border-purple-500/30">
          <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Shelf Audit Pro
          </h1>
          <p className="text-sm mt-2 opacity-70">Next-Gen Inventory Intelligence</p>
        </div>

        <nav className="p-6 space-y-4">
          {[
            { id: 'overview', icon: BarChart3, label: 'Dashboard' },
            { id: '3d', icon: Package, label: '3D Warehouse View' },
            { id: 'charts', icon: Activity, label: 'Analytics' },
            { id: 'data', icon: FileText, label: 'Data Table' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setSelectedTab(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-5 rounded-2xl transition-all text-left font-semibold text-lg ${
                selectedTab === item.id
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xl shadow-purple-500/50'
                  : 'hover:bg-white/10 text-gray-300'
              }`}
            >
              <item.icon className="w-7 h-7" />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-500 ${sidebarOpen ? 'ml-80' : 'ml-0'}`}>
        {/* Header */}
        <header className="sticky top-0 z-40 backdrop-blur-3xl bg-black/40 border-b border-purple-500/20">
          <div className="flex items-center justify-between p-8">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-4 rounded-2xl hover:bg-white/10 transition">
              {sidebarOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
            </button>

            <div className="flex items-center gap-6">
              <button onClick={() => setDarkMode(!darkMode)} className="p-4 rounded-2xl hover:bg-white/10">
                {darkMode ? <Sun className="w-7 h-7 text-yellow-400" /> : <Moon className="w-7 h-7" />}
              </button>

              <label className="cursor-pointer">
                <input type="file" accept=".csv" onChange={handleFile} className="hidden" />
                <div className="flex items-center gap-4 px-10 py-5 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white rounded-3xl shadow-2xl hover:shadow-cyan-500/50 transition-all font-bold text-xl">
                  <Upload className="w-8 h-8" />
                  Upload Audit CSV
                </div>
              </label>
            </div>
          </div>
        </header>

        {/* Main Area */}
        <main className="p-10">
          {loading && (
            <div className="flex flex-col items-center justify-center h-96">
              <div className="animate-spin rounded-full h-24 w-24 border-8 border-purple-500 border-t-transparent"></div>
              <p className="mt-8 text-3xl font-bold text-purple-400">Analyzing 10,000+ SKUs...</p>
            </div>
          )}

          {rows.length > 0 && (
            <>
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                {[
                  { label: 'Total Items', value: stats.total.toLocaleString(), icon: Package, color: 'from-cyan-400 to-blue-500' },
                  { label: 'Out of Stock', value: stats.outOfStock, icon: AlertCircle, color: 'from-red-500 to-rose-600' },
                  { label: 'Low Stock', value: stats.lowStock, icon: TrendingUp, color: 'from-orange-500 to-yellow-500' },
                  { label: 'Audit Dates', value: stats.uniqueDates, icon: Calendar, color: 'from-purple-500 to-pink-500' },
                ].map((s, i) => (
                  <div key={i} className="group bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-purple-500/30 hover:border-purple-400 transition-all hover:scale-105">
                    <div className={`w-20 h-20 rounded-3xl bg-gradient-to-r ${s.color} flex items-center justify-center mb-6 shadow-2xl`}>
                      <s.icon className="w-12 h-12 text-white" />
                    </div>
                    <p className="text-gray-300 text-lg">{s.label}</p>
                    <p className="text-5xl font-black mt-4 text-white">{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Content */}
              {selectedTab === '3d' && (
                <div className="bg-black/90 rounded-3xl h-screen max-h-[850px] overflow-hidden shadow-3xl border-4 border-purple-600/50">
                  <Canvas shadows camera={{ position: [0, 20, 40], fov: 60 }}>
                    <Shelf3D data={rows} />
                  </Canvas>
                </div>
              )}

              {selectedTab === 'charts' && <CSVCharts rows={rows} />}

              {selectedTab === 'overview' && (
                <div className="text-center py-40">
                  <h1 className="text-9xl font-black bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-8">
                    SHELF AUDIT PRO
                  </h1>
                  <p className="text-3xl text-gray-300">The Future of Inventory Intelligence</p>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
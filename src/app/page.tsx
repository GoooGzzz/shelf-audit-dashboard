'use client';

import { useState, useMemo } from 'react';
import { CSVParser } from '@/lib/csv/parseCSV';
import { validateRows } from '@/lib/csv/validateWithZod';
import type { AuditRow } from '@/lib/csv/schema';
import CSVCharts from '@/components/CSVCharts';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Text, Grid, Stars, Environment, useFrame } from '@react-three/drei';
import { Upload, Download, Moon, Sun, Menu, X, Package, AlertCircle, TrendingUp, Calendar, BarChart3, Activity, FileText } from 'lucide-react';

function AnimatedBox({ row, i, maxQty }: { row: AuditRow; i: number; maxQty: number }) {
  const meshRef = useState<any>(null)[0];
  const height = Math.max(0.3, (row.quantity / maxQty) * 12);
  const color = row.quantity === 0 ? '#dc2626' : row.quantity < 10 ? '#f97316' : '#16a34a';

  useFrame((state) => {
    if (meshRef) {
      meshRef.rotation.y = Math.sin(state.clock.elapsedTime + i) * 0.5;
      meshRef.position.y = height / 2 + Math.sin(state.clock.elapsedTime * 2 + i) * 0.2;
    }
  });

  return (
    <group position={[i % 15 * 1.8 - 13, height / 2, Math.floor(i / 15) * 1.8 - 10]}>
      <Box ref={meshRef} args={[1.6, height, 1.6]} castShadow receiveShadow>
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.6} />
      </Box>
      <Text position={[0, height + 0.8, 0]} fontSize={0.45} color="white" anchorX="center">
        {row.sku}
      </Text>
      <Text position={[0, height + 1.6, 0]} fontSize={0.8} color="white" fontWeight="bold" anchorX="center">
        {row.quantity}
      </Text>
    </group>
  );
}

function Shelf3D({ data }: { data: AuditRow[] }) {
  const maxQty = Math.max(...data.map(r => r.quantity), 1);

  return (
    <>
      <fog args={['#0f172a', 10, 50]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow />
      <pointLight position={[-10, 10, -10]} intensity={0.8} color="#6366f1" />

      {data.slice(0, 150).map((row, i) => (
        <AnimatedBox key={i} row={row} i={i} maxQty={maxQty} />
      ))}

      <Grid args={[50, 50]} cellSize={2} cellThickness={1} cellColor="#4b5563" sectionSize={10} sectionThickness={1.5} sectionColor="#6366f1" fadeDistance={50} position={[0, -0.01, 0]} />

      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      <OrbitControls enablePan enableZoom enableRotate minDistance={10} maxDistance={80} maxPolarAngle={Math.PI / 2.2} />

      <Environment preset="night" />
    </>
  );
}

export default function Home() {
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [errors, setErrors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile: closed by default
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
      {/* Mobile Sidebar Toggle */}
      <button onClick={() => setSidebarOpen(true)} className="fixed top-4 left-4 z-50 md:hidden p-3 bg-purple-600 text-white rounded-xl shadow-lg">
        <Menu className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-80 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform md:translate-x-0 md:static ${darkMode ? 'bg-black/95 border-r border-purple-500/20' : 'bg-white/95'} backdrop-blur-3xl shadow-2xl h-full`}>
        <div className="p-8 border-b border-purple-500/30">
          <h1 className="text-3xl font-black bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Shelf Audit Pro
          </h1>
          <p className="text-sm mt-2 opacity-70">Next-Gen Inventory</p>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden absolute top-4 right-4 p-2 bg-gray-800 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="p-6 space-y-4 overflow-y-auto h-full">
          {[
            { id: 'overview', icon: BarChart3, label: 'Dashboard' },
            { id: '3d', icon: Package, label: '3D View' },
            { id: 'charts', icon: Activity, label: 'Analytics' },
            { id: 'data', icon: FileText, label: 'Data' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => { setSelectedTab(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-4 px-6 py-5 rounded-2xl transition-all text-left font-semibold text-lg ${
                selectedTab === item.id
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xl'
                  : 'hover:bg-white/10 text-gray-300'
              }`}
            >
              <item.icon className="w-7 h-7" />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div className={`transition-all duration-500 ${sidebarOpen ? 'ml-80 md:ml-80' : 'ml-0'}`}>
        <header className="sticky top-0 z-40 backdrop-blur-3xl bg-black/40 border-b border-purple-500/20 p-4 md:p-8">
          <div className="flex items-center justify-between">
            <div className="hidden md:flex items-center gap-6">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-3 rounded-2xl hover:bg-white/10">
                <Menu className="w-7 h-7" />
              </button>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => setDarkMode(!darkMode)} className="p-3 rounded-2xl hover:bg-white/10">
                {darkMode ? <Sun className="w-6 h-6 text-yellow-400" /> : <Moon className="w-6 h-6" />}
              </button>
              <label className="cursor-pointer">
                <input type="file" accept=".csv" onChange={handleFile} className="hidden" />
                <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white rounded-2xl shadow-xl hover:shadow-cyan-500/50 transition-all font-semibold">
                  <Upload className="w-5 h-5" /> Upload
                </div>
              </label>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-10">
          {loading && (
            <div className="flex flex-col items-center justify-center h-96">
              <div className="animate-spin rounded-full h-20 w-20 border-8 border-purple-500 border-t-transparent"></div>
              <p className="mt-6 text-2xl font-bold text-purple-400">Processing...</p>
            </div>
          )}

          {rows.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-8 md:mb-12">
                {[
                  { label: 'Total', value: stats.total, icon: Package, color: 'from-cyan-400 to-blue-500' },
                  { label: 'Out Stock', value: stats.outOfStock, icon: AlertCircle, color: 'from-red-500 to-rose-600' },
                  { label: 'Low Stock', value: stats.lowStock, icon: TrendingUp, color: 'from-orange-500 to-yellow-500' },
                  { label: 'Dates', value: stats.uniqueDates, icon: Calendar, color: 'from-purple-500 to-pink-500' },
                ].map((s, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 md:p-8 border border-purple-500/30 hover:scale-105 transition">
                    <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl ${s.color} flex items-center justify-center mb-4`}>
                      <s.icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                    </div>
                    <p className="text-gray-300 text-xs md:text-sm">{s.label}</p>
                    <p className="text-2xl md:text-4xl font-black mt-2 text-white">{s.value}</p>
                  </div>
                ))}
              </div>

              {selectedTab === '3d' && (
                <div className="bg-black/90 rounded-2xl md:rounded-3xl h-64 md:h-[600px] overflow-hidden shadow-3xl border border-purple-600/50">
                  <Canvas shadows camera={{ position: [0, 20, 40], fov: 60 }}>
                    <Shelf3D data={rows} />
                  </Canvas>
                </div>
              )}

              {selectedTab === 'charts' && <CSVCharts rows={rows} />}

              {selectedTab === 'overview' && (
                <div className="text-center py-20 md:py-40">
                  <h1 className="text-4xl md:text-8xl font-black bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4 md:mb-8">
                    SHELF AUDIT PRO
                  </h1>
                  <p className="text-lg md:text-3xl text-gray-300">Advanced Inventory Analytics</p>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
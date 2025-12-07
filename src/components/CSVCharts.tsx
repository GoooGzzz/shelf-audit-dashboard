// src/components/CSVCharts.tsx
'use client';

import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { AuditRow } from '@\/lib\/csv\/schema';

type Props = { rows: AuditRow[] };

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export default function CSVCharts({ rows }: Props) {
  // 1. Stock status distribution
  const statusData = rows.reduce((acc, row) => {
    const status = row.status || 'unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(statusData).map(([name, value]) => ({ name, value }));

  // 2. Quantity by location (top 10)
  const locationData = rows
    .reduce((acc, row) => {
      const loc = row.location || 'Unknown';
      const existing = acc.find(x => x.location === loc);
      if (existing) existing.quantity += row.quantity;
      else acc.push({ location: loc, quantity: row.quantity });
      return acc;
    }, [] as { location: string; quantity: number }[])
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 10);

  // 3. Low stock items (<10)
  const lowStock = rows.filter(r => r.quantity < 10).length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">Stock Status Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
              {pieData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
        {lowStock > 0 && <p className="text-red-600 font-bold mt-4">{lowStock} items low in stock!</p>}
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">Top 10 Locations by Quantity</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={locationData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="location" angle={-45} textAnchor="end" height={80} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="quantity" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// src/components/CSVCharts.tsx
'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import type { AuditRow } from '@/lib/csv/schema';

type Props = { rows: AuditRow[] };

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export default function CSVCharts({ rows }: Props) {
  // 1. Quantity by location (top 10)
  const locationData = rows
    .reduce((acc, row) => {
      const loc = row.location.trim() || 'Unknown';
      const existing = acc.find(x => x.location === loc);
      if (existing) existing.quantity += row.quantity;
      else acc.push({ location: loc, quantity: row.quantity });
      return acc;
    }, [] as { location: string; quantity: number }[])
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 10);

  // 2. Low stock items (<10)
  const lowStockCount = rows.filter(r => r.quantity < 10).length;
  const zeroStockCount = rows.filter(r => r.quantity === 0).length;
  const inStockCount = rows.length - lowStockCount - zeroStockCount;

  const pieData = [
    { name: 'In Stock', value: inStockCount, color: '#10b981' },
    { name: 'Low Stock (<10)', value: lowStockCount, color: '#f59e0b' },
    { name: 'Out of Stock', value: zeroStockCount, color: '#ef4444' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">Stock Level Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
              {pieData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
        {zeroStockCount > 0 && <p className="text-red-600 font-bold mt-4">{zeroStockCount} items out of stock!</p>}
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
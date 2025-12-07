// src/components/CSVCharts.tsx
'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import type { AuditRow } from '@/lib/csv/schema';

type Props = { rows: AuditRow[] };

export default function CSVCharts({ rows }: Props) {
  // Your CSV: sku, date (as location), quantity → group by date
  const dailyData = rows.reduce((acc, row) => {
    const date = row.location.trim();
    const existing = acc.find(x => x.date === date);
    if (existing) existing.quantity += row.quantity;
    else acc.push({ date, quantity: row.quantity });
    return acc;
  }, [] as { date: string; quantity: number }[])
  .sort((a, b) => a.date.localeCompare(b.date));

  // Stock level summary
  const zeroStock = rows.filter(r => r.quantity === 0).length;
  const lowStock = rows.filter(r => r.quantity > 0 && r.quantity < 10).length;
  const inStock = rows.length - zeroStock - lowStock;

  const pieData = [
    { name: 'In Stock (≥10)', value: inStock, color: '#10b981' },
    { name: 'Low Stock (1–9)', value: lowStock, color: '#f59e0b' },
    { name: 'Out of Stock', value: zeroStock, color: '#ef4444' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">Stock Level Summary</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
              {pieData.map((_, i) => <Cell key={i} fill={pieData[i].color} />)}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
        {zeroStock > 0 && <p className="text-red-600 font-bold mt-4">{zeroStock} items out of stock</p>}
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">Daily Total Quantity Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" angle={-45} textAnchor="end" height={80} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="quantity" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
// src/components/UI/WeeklyDistributionChart.tsx
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"; // Import from recharts

// Define AuditRow type if not imported yet
interface AuditRow {
  employeeName: string;
  totalAV: number;
  totalRef: number;
  totalWM: number;
  week: string | number;  // Adjust the week field type as needed
}

interface WeeklyDistributionChartProps {
  rows: AuditRow[];
}

const WeeklyDistributionChart: React.FC<WeeklyDistributionChartProps> = ({ rows }) => {
  // Aggregate data based on the 'week' property
  const weeklyData = rows.reduce((acc: any, row) => {
    const week = row.week;  // Ensure this is the correct property from the AuditRow
    if (!acc[week]) acc[week] = 0;
    acc[week] += row.totalAV + row.totalRef + row.totalWM;  // Adjust scoring as per the formula you need
    return acc;
  }, {});

  // Convert the aggregated weekly data to a proper array format for Recharts
  const chartData = Object.keys(weeklyData).map((week) => ({
    week,
    totalScore: weeklyData[week],
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="week" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="totalScore" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default WeeklyDistributionChart;

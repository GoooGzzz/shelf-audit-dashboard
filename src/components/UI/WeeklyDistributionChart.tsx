import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { AuditRow } from "@/lib/csv/types";

interface WeeklyDistributionChartProps {
  rows: AuditRow[];
}

const WeeklyDistributionChart: React.FC<WeeklyDistributionChartProps> = ({ rows }) => {
  // Assume each row has a 'week' field which corresponds to the week of audit
  const weeklyData = rows.reduce((acc: any, row) => {
    const week = row.week;
    if (!acc[week]) acc[week] = 0;
    acc[week] += row.avTotal + row.refTotal + row.wmTotal;
    return acc;
  }, {});

  const data = Object.keys(weeklyData).map((week) => ({
    week,
    audits: weeklyData[week],
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="week" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="audits" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default WeeklyDistributionChart;

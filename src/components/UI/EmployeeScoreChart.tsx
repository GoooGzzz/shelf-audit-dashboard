import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { AuditRow } from "@/lib/csv/types";

interface EmployeeScoreChartProps {
  rows: AuditRow[];
}

const EmployeeScoreChart: React.FC<EmployeeScoreChartProps> = ({ rows }) => {
  const data = rows.map((row) => ({
    name: row.empName,
    score: row.avTotal + row.refTotal + row.wmTotal, // Adjust this logic as per your scoring formula
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="score" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default EmployeeScoreChart;

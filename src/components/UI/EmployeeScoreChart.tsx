// src/components/UI/EmployeeScoreChart.tsx
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"; // Import from recharts

// Assuming you are importing the AuditRow type from somewhere like @\/lib\/csv\/types
import { AuditRow } from "@\/lib\/csv\/types";  // Adjust the path if necessary

interface EmployeeScoreChartProps {
  rows: AuditRow[];
}

const EmployeeScoreChart: React.FC<EmployeeScoreChartProps> = ({ rows }) => {
  // Prepare the data for the chart
  const data = rows.map((row) => ({
    name: row.employeeName,  // Assuming 'employeeName' is a property of AuditRow
    score: row.totalAV + row.totalRef + row.totalWM,  // Adjust scoring formula as per your requirements
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="score" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default EmployeeScoreChart;

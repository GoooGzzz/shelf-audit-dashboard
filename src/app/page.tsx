// app/page.tsx
'use client';

import React, { useState } from 'react';
import { parseCSV } from '@/lib/csv/parseCSV';
import { AuditRow } from '@/lib/csv/types';
import dynamic from 'next/dynamic';

const EnhancedDataDashboard = dynamic(
  () => import('@/components/DataIntegrityDashboard'),
  { ssr: false }
);

export default function HomePage() {
  const [auditData, setAuditData] = useState<AuditRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCSVUpload = (csvData: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const parsedData = parseCSV(csvData);
      setAuditData(parsedData);
    } catch (err: any) {
      console.error("Data Processing Error:", err);
      setError("Failed to process data. Please check CSV format.");
      setAuditData([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <EnhancedDataDashboard />
    </div>
  );
}
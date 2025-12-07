// src/lib/csv/parseCSV.ts
import Papa from 'papaparse';
import { AuditRow, RawAuditRow } from './types';

export const parseCSV = (csvData: string): AuditRow[] => {
  try {
    const lines = csvData.trim().split('\n');
    
    return lines.slice(2).map((line) => {
      const values = line.split(',');
      if (!values[0]) return null;

      const avBrands = values.slice(10, 39).map((v) => parseInt(v) || 0);
      const refBrands = values.slice(39, 63).map((v) => parseInt(v) || 0);
      const wmBrands = values.slice(63, 79).map((v) => parseInt(v) || 0);

      return {
        week: values[0],
        day: values[1],
        empCode: values[2],
        empName: values[3],
        title: values[4],
        shopCode: values[5],
        shopName: values[6],
        avTotal: parseInt(values[7]) || null,
        refTotal: parseInt(values[8]) || null,
        wmTotal: parseInt(values[9]) || null,
        avBrands,
        refBrands,
        wmBrands,
        avSum: avBrands.reduce((a, b) => a + b, 0),
        refSum: refBrands.reduce((a, b) => a + b, 0),
        wmSum: wmBrands.reduce((a, b) => a + b, 0),
      };
    }).filter(Boolean) as AuditRow[];
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error("Error parsing CSV: " + error.message);
    }
    throw new Error("Unknown error while parsing CSV");
  }
};

export const parseRouteMapCSV = (csvData: string): RawAuditRow[] => {
  try {
    const parsed = Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
      transformHeader: (header) => header.trim()
    });
    
    return parsed.data as RawAuditRow[];
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error("Error parsing Route Map CSV: " + error.message);
    }
    throw new Error("Unknown error while parsing Route Map CSV");
  }
};
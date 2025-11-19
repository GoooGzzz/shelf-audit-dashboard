// File: src/lib/csv/parseCSV.ts
import Papa from 'papaparse';
import { RouteMapRow } from "./types"; // Import the new type

export const parseRouteMapCSV = (csvData: string): RouteMapRow[] => {
  try {
    const parsed = Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
      // Ensure all rows are parsed as strings to handle codes like S-0105-025 correctly
      dynamicTyping: false, 
      transformHeader: (header) => header.trim().replace('Shop Code', 'Shop Code_Audited').replace('Shop Name', 'Shop Name_Audited') // Cleans up the headers for the last two columns
    });
    
    // Perform an explicit cast to ensure the data adheres to the new interface
    return parsed.data as RouteMapRow[]; 
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error("Error parsing Route Map CSV: " + error.message);
    } else {
      throw new Error("Unknown error while parsing Route Map CSV");
    }
  }
};
// The original parseCSV can remain for the old audit data, 
// and the main component (page.tsx/DataIntegrityDashboard.tsx) 
// would call this new function for the new file.
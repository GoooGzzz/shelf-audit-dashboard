// File: src/components/UI/CSVUpload.tsx

import React from 'react';

// Define the type for the onUpload prop
interface CSVUploadProps {
  onUpload: (data: string) => void;  // `data` is a string (CSV data)
}

const CSVUpload: React.FC<CSVUploadProps> = ({ onUpload }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const csvData = reader.result as string;  // Make sure it's a string
        onUpload(csvData);  // Call the onUpload function with the CSV data
      };
      reader.readAsText(file);
    }
  };

  return <input type="file" accept=".csv" onChange={handleFileChange} />;
};

export default CSVUpload;

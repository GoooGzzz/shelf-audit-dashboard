import React, { useState } from 'react';

const CSVUpload = ({ onUpload }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const data = reader.result;
        onUpload(data);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="mb-4 p-2 border border-gray-300 rounded"
      />
      <button
        onClick={() => document.querySelector('input[type="file"]').click()}
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
      >
        Upload CSV
      </button>
    </div>
  );
};

export { CSVUpload };

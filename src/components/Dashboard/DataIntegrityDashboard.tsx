import React, { useState } from "react";
import { Tab } from "@headlessui/react"; // Import Headless UI Tab component
import { CSVUpload } from "../Upload/CSVUpload";
import OverviewTab from "./Tabs/OverviewTab";
import ViolationsTab from "./Tabs/ViolationsTab";

const DataIntegrityDashboard = () => {
  const [csvData, setCsvData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = (data) => {
    setLoading(true);
    setTimeout(() => {
      setCsvData(data);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Data Integrity Dashboard</h1>

      {/* CSV Upload Section */}
      <div className="flex justify-center mb-6">
        <CSVUpload onUpload={handleUpload} />
      </div>

      {loading ? (
        <div className="text-center text-xl text-gray-500">Loading...</div>
      ) : (
        <>
          {/* Tabs Section */}
          <Tab.Group>
            {/* Tab List */}
            <Tab.List className="flex space-x-4 border-b border-gray-200">
              <Tab
                className={({ selected }) =>
                  selected
                    ? "text-blue-600 border-b-2 border-blue-600 font-semibold"
                    : "text-gray-600 hover:text-blue-600"
                }
              >
                Overview
              </Tab>
              <Tab
                className={({ selected }) =>
                  selected
                    ? "text-blue-600 border-b-2 border-blue-600 font-semibold"
                    : "text-gray-600 hover:text-blue-600"
                }
              >
                Violations
              </Tab>
            </Tab.List>

            {/* Tab Panels */}
            <Tab.Panels>
              {/* Overview Panel */}
              <Tab.Panel>
                <OverviewTab data={csvData} />
              </Tab.Panel>

              {/* Violations Panel */}
              <Tab.Panel>
                <ViolationsTab data={csvData} />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </>
      )}
    </div>
  );
};

export default DataIntegrityDashboard;

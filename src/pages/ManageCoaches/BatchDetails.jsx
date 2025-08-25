import React, { useState } from "react";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const BatchDetails = () => {
  // Left column: batch details
  const batchDetails = [
    { label: 'Batch Name', value: 'USA-FG-767' },
    { label: 'Owner', value: <>Ravi Kumar <span className="inline-block bg-gray-200 rounded-full px-1 ml-1 text-xs">👤</span></> },
    { label: 'Day', value: 'Friday' },
    { label: 'Batch ID', value: 'USA-FG-767' },
    { label: 'Start Date', value: '10-05-2024' },
    { label: 'Batch Status', value: 'Active Batch' },
    { label: 'Class Type', value: 'Foundation Private Individual Class' },
    { label: 'End Date', value: '26-07-2025' },
    { label: 'Country of Batch', value: 'USA' },
    { label: 'Sessions a week', value: '1 Day/Week' },
    { label: 'Batch Duration', value: '45 minutes' },
    { label: 'Relationship Manager', value: <>Anuj Sharma <span className="inline-block bg-gray-200 rounded-full px-1 ml-1 text-xs">👤</span></> },
    { label: 'Coach', value: <>Subir Rai <span className="inline-block bg-gray-200 rounded-full px-1 ml-1 text-xs">👤</span></> },
    { label: 'Start Time', value: '02:15:00' },
  ];

  // Right column: enrollments table
  const [rowData] = useState([
    { enrollmentNo: 'ENR-26776', level: 'Basic', studentName: 'Dhruv Patel', enrollmentStatus: 'Completed' },
    { enrollmentNo: 'ENR-26776', level: 'Basic', studentName: 'Dhruv Patel', enrollmentStatus: 'Completed' },
    { enrollmentNo: 'ENR-26776', level: 'Basic', studentName: 'Dhruv Patel', enrollmentStatus: 'Completed' },
    { enrollmentNo: 'ENR-26776', level: 'Basic', studentName: 'Dhruv Patel', enrollmentStatus: 'Completed' },
    { enrollmentNo: 'ENR-26776', level: 'Basic', studentName: 'Dhruv Patel', enrollmentStatus: 'Completed' },
    { enrollmentNo: 'ENR-26776', level: 'Basic', studentName: 'Dhruv Patel', enrollmentStatus: 'Completed' },
    { enrollmentNo: 'ENR-26776', level: 'Basic', studentName: 'Dhruv Patel', enrollmentStatus: 'Completed' },
    { enrollmentNo: 'ENR-26776', level: 'Basic', studentName: 'Dhruv Patel', enrollmentStatus: 'Completed' },
    { enrollmentNo: 'ENR-26776', level: 'Basic', studentName: 'Dhruv Patel', enrollmentStatus: 'Completed' },
    { enrollmentNo: 'ENR-26776', level: 'Basic', studentName: 'Dhruv Patel', enrollmentStatus: 'Completed' },
  ]);

  const [columnDefs] = useState([
    { headerName: 'Enrollment No.', field: 'enrollmentNo', cellRenderer: (params) => <a href="#" className="text-blue-600 underline">{params.value}</a> },
    { headerName: 'Level', field: 'level' },
    { headerName: 'Student Name', field: 'studentName', cellRenderer: (params) => <a href="#" className="text-blue-600 underline">{params.value}</a> },
    { headerName: 'Enrollment Status', field: 'enrollmentStatus', cellRenderer: (params) => <span className="bg-green-100 text-green-700 px-2 py-1 rounded border border-green-400">{params.value}</span> },
  ]);

  return (
    <div className="p-6 bg-white rounded-md">
      <h2 className="text-2xl font-semibold mb-2">Batch Schedule</h2>
      <a href="#" className="text-blue-600 underline text-base font-medium mb-4 inline-block">USA-FG-767</a>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
        {/* Left column: Details */}
        <div className="bg-white rounded-xl border p-6 flex flex-col gap-2">
          <button className="bg-[#1A2346] text-white px-4 py-1 rounded mb-4 w-24">Details</button>
          <div className="grid grid-cols-2 gap-y-3 gap-x-6">
            {batchDetails.map((item, idx) => (
              <React.Fragment key={idx}>
                <div className="text-gray-500 text-sm font-medium">{item.label}</div>
                <div className="text-gray-900 text-sm font-semibold">{item.value}</div>
              </React.Fragment>
            ))}
          </div>
        </div>
        {/* Right column: Enrollments Table */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center mb-4">
            <span className="bg-[#1A2346] text-white rounded px-2 py-1 text-xs font-bold mr-2">10</span>
            <span className="font-semibold text-base">Enrollments For This Batch</span>
          </div>
          <div className="ag-theme-alpine" style={{ height: 370, width: '100%' }}>
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              pagination={false}
              domLayout='autoHeight'
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchDetails; 
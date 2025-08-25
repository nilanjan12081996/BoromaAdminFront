import React, { useState } from "react";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const CoachSessions = () => {
  const [rowData] = useState([
    {
      relationshipManager: 'Anuj Sharma',
      sessionName: 'Session 19',
      batchSchedule: 'USA-FG-767',
      level: 'Basic',
      date: '30th April',
      day: 'Fri',
      startTime: '02:15:00',
      coach: 'Subir Rai',
      topic: 'Checkmate..',
      status: 'Planned',
      zoomLink: 'https://skyzh.github.io/zo...'
    },
    {
      relationshipManager: 'Anuj Sharma',
      sessionName: 'Session 19',
      batchSchedule: 'USA-FG-Com..',
      level: 'Basic',
      date: '30th April',
      day: 'Fri',
      startTime: '02:15:00',
      coach: 'Subir Rai',
      topic: 'Checkmate..',
      status: 'Completed',
      zoomLink: 'https://skyzh.github.io/zo...'
    },
    {
      relationshipManager: 'Anuj Sharma',
      sessionName: 'Session 19',
      batchSchedule: 'IND-FG-Com..',
      level: 'Basic',
      date: '30th April',
      day: 'Fri',
      startTime: '02:15:00',
      coach: 'Subir Rai',
      topic: 'Checkmate..',
      status: 'Planned',
      zoomLink: 'https://skyzh.github.io/zo...'
    }
  ]);

  const [columnDefs] = useState([
    // { headerName: '', checkboxSelection: true, width: 40 },
    { headerName: 'Relationship Manager', field: 'relationshipManager', sortable: true, filter: true },
    { headerName: 'Session Name', field: 'sessionName', sortable: true, filter: true, cellRenderer: (params) => <a href="#" className="text-blue-600 underline">{params.value}</a> },
    { headerName: 'Batch Schedule', field: 'batchSchedule', sortable: true, filter: true, cellRenderer: (params) => <a href="#" className="text-blue-600 underline">{params.value}</a> },
    { headerName: 'Level', field: 'level', sortable: true, filter: true },
    { headerName: 'Date', field: 'date', sortable: true, filter: true },
    { headerName: 'Day', field: 'day', sortable: true, filter: true },
    { headerName: 'Start Time', field: 'startTime', sortable: true, filter: true },
    { headerName: 'Coach', field: 'coach', sortable: true, filter: true, cellRenderer: (params) => <a href="#" className="text-blue-600 underline">{params.value}</a> },
    { headerName: 'Topic', field: 'topic', sortable: true, filter: true },
    { headerName: 'Status', field: 'status', cellRenderer: (params) => params.value === 'Completed' ? <span className="bg-green-100 text-green-700 px-2 py-1 rounded border border-green-400">Completed</span> : <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded border border-orange-400">Planned</span> },
    { headerName: 'Zoom Link', field: 'zoomLink', cellRenderer: (params) => <a href={params.value} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{params.value}</a> }
  ]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Coach Sessions</h2>
      <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={10}
          domLayout='autoHeight'
        />
      </div>
    </div>
  );
};

export default CoachSessions; 
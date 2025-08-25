import React, { useState } from "react";

const SessionDetails = () => {
  const [activeTab, setActiveTab] = useState('details');

  return (
    <div className="p-6 bg-white rounded-md">
      <h2 className="text-2xl font-semibold mb-2">Coach Sessions</h2>
      <a href="#" className="text-blue-600 underline text-base font-medium mb-4 inline-block">Session 19</a>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
        {/* Left: Details/Attendance */}
        <div className="md:col-span-2 bg-white rounded-xl border p-6 flex flex-col gap-2">
          <div className="flex gap-2 mb-4">
            <button
              className={`px-4 py-1 rounded font-medium ${activeTab === 'details' ? 'bg-[#1A2346] text-white' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setActiveTab('details')}
            >
              Details
            </button>
            <button
              className={`px-4 py-1 rounded font-medium ${activeTab === 'attendance' ? 'bg-[#1A2346] text-white' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setActiveTab('attendance')}
            >
              Attendance
            </button>
          </div>
          {activeTab === 'details' && (
            <div className="grid grid-cols-2 gap-y-3 gap-x-6">
              <div className="text-gray-500 text-sm font-medium">Coach Session Name</div>
              <div className="text-gray-900 text-sm font-semibold">Session 19</div>
              <div className="text-gray-500 text-sm font-medium">Owner</div>
              <div className="text-gray-900 text-sm font-semibold">Ravi Kumar <span className="inline-block bg-gray-200 rounded-full px-1 ml-1 text-xs">👤</span></div>
              <div className="text-gray-500 text-sm font-medium">Batch Schedule</div>
              <div className="text-blue-600 underline text-sm font-semibold"><a href="#">USA-FG-767</a></div>
              <div className="text-gray-500 text-sm font-medium">Date</div>
              <div className="text-gray-900 text-sm font-semibold">30-05-25</div>
              <div className="text-gray-500 text-sm font-medium">Topic</div>
              <div className="italic text-gray-700 text-sm">Checkmate in 10 moves</div>
              <div className="text-gray-500 text-sm font-medium">Sub-Level</div>
              <div className="text-gray-900 text-sm font-semibold">Basic Sub-level</div>
              <div className="text-gray-500 text-sm font-medium">Level</div>
              <div className="text-gray-900 text-sm font-semibold">Basic</div>
              <div className="text-gray-500 text-sm font-medium">Zoom Link</div>
              <div className="text-blue-600 underline text-sm font-semibold truncate max-w-xs"><a href="https://app.zoom.us/wc/93079904274/join?fromPWA=1&pwd=0A107z3lKge5YzowSaeiPxJ3HFS8401s." target="_blank" rel="noopener noreferrer">https://app.zoom.us/wc/93079904274/join?fromPWA=1&pwd=0A107z3lKge5YzowSaeiPxJ3HFS8401s...</a></div>
              <div className="text-gray-500 text-sm font-medium">Session Type</div>
              <div className="text-gray-900 text-sm font-semibold">Training</div>
              <div className="text-gray-500 text-sm font-medium">End Time (IST)</div>
              <div className="text-gray-900 text-sm font-semibold">04:45:00</div>
              <div className="text-gray-500 text-sm font-medium">Start Time</div>
              <div className="text-gray-900 text-sm font-semibold">04:00:00</div>
              <div className="text-gray-500 text-sm font-medium">Batch Local Time</div>
              <div className="text-gray-900 text-sm font-semibold">17:30:00</div>
              <div className="text-gray-500 text-sm font-medium">Country</div>
              <div className="text-gray-900 text-sm font-semibold">USA</div>
              <div className="text-gray-500 text-sm font-medium">Duration</div>
              <div className="text-gray-900 text-sm font-semibold">45 minutes</div>
              <div className="text-gray-500 text-sm font-medium">Day</div>
              <div className="text-gray-900 text-sm font-semibold">Friday</div>
              <div className="text-gray-500 text-sm font-medium">Coach</div>
              <div className="text-gray-900 text-sm font-semibold">Subir Rai <span className="inline-block bg-gray-200 rounded-full px-1 ml-1 text-xs">👤</span></div>
              <div className="text-gray-500 text-sm font-medium">Relationship Manager</div>
              <div className="text-gray-900 text-sm font-semibold">Anuj Sharma</div>
              <div className="text-gray-500 text-sm font-medium">Substitute Coach</div>
              <div className="text-gray-900 text-sm font-semibold"><span className="inline-block bg-gray-200 rounded-full px-1 mr-1 text-xs">👤</span> Vrinda Reddy</div>
            </div>
          )}
          {activeTab === 'attendance' && (
            <div className="text-gray-500 text-sm">Attendance details go here...</div>
          )}
        </div>
        {/* Right: Homework Details & System Info */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-xl border p-4">
            <button className="bg-[#1A2346] text-white px-4 py-1 rounded mb-4 text-sm font-semibold">Homework Details</button>
            <div className="mb-2">
              <div className="text-gray-500 text-xs font-medium">Homework Title</div>
              <div className="text-gray-900 text-sm font-semibold">FC-BG-2_Movement of Chessmen (King & Pawn)</div>
            </div>
            <div>
              <div className="text-gray-500 text-xs font-medium">Homework PDF-Code/Name</div>
              <div className="text-blue-600 underline text-sm font-semibold"><a href="#">FC-BG-2_Movement of Chessmen (King & Pawn)</a></div>
            </div>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <button className="bg-[#1A2346] text-white px-4 py-1 rounded mb-4 text-sm font-semibold">System Information</button>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4">
              <div className="text-gray-500 text-xs font-medium col-span-1">Created By</div>
              <div className="text-gray-900 text-xs font-semibold col-span-1"><span className="inline-block bg-gray-200 rounded-full px-1 mr-1 text-xs">👤</span> SatyamD , 16-05-2025, 02:18</div>
              <div className="text-gray-500 text-xs font-medium col-span-1">Start Time(IST)</div>
              <div className="text-gray-900 text-xs font-semibold col-span-1">04:00:00</div>
              <div className="text-gray-500 text-xs font-medium col-span-1">Created By</div>
              <div className="text-gray-900 text-xs font-semibold col-span-1"><span className="inline-block bg-gray-200 rounded-full px-1 mr-1 text-xs">👤</span> SatyamD , 16-05-2025, 02:18</div>
              <div className="text-gray-500 text-xs font-medium col-span-1">End Time(IST)</div>
              <div className="text-gray-900 text-xs font-semibold col-span-1">04:45:00</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionDetails; 
import { Label } from "flowbite-react";
import React from "react";

const BatchDetails = () => {
  return (
    <div>
      <div className="min-h-screen bg-gray-100 field_area">
        <div className="max-w-full mx-auto p-6 bg-white shadow rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Batch Details</h2>
          </div>
          <div className="space-y-4 popup_section">
            <div className="flex gap-4">
              <div className="w-6/12">
                <div className="mb-1 block">
                  <Label value="Batch name" />
                </div>
                <p className="text-[#8E8E8E] text-sm">Anuj</p>
              </div>
              <div className="w-6/12">
                <div className="mb-1 block">
                  <Label value="Relationship Manager" />
                </div>
                <p className="text-[#8E8E8E] text-sm">Relationship Manager</p>
              </div>
              <div className="w-6/12">
                <div className="mb-1 block">
                  <Label value="Batch Coach" />
                </div>
                <p className="text-[#8E8E8E] text-sm">Sharma</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-6/12">
                <div className="mb-1 block">
                  <Label value="Batch Limit" />
                </div>
                <p className="text-[#8E8E8E] text-sm">10 Students</p>
              </div>
              <div className="w-6/12">
                <div className="mb-1 block">
                  <Label value="Country" />
                </div>
                <p className="text-[#8E8E8E] text-sm">USA</p>
              </div>
              <div className="w-6/12">
                <div className="mb-1 block">
                  <Label value="Planned Start Date" />
                </div>
                <p className="text-[#8E8E8E] text-sm">02-05-25</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchDetails;

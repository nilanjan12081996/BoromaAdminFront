import { Datepicker, Label, Select, TextInput } from "flowbite-react";
import React from "react";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { FaCircleMinus } from "react-icons/fa6";
import { HiMinusCircle } from "react-icons/hi2";

const AddBatch = () => {
  return (
    <div>
      <div className="min-h-screen bg-gray-100 field_area">
        <div className="max-w-full mx-auto p-6 bg-white shadow rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Create New batch</h2>
          </div>
          <div className="space-y-4 popup_section">
            <div className="flex gap-4">
              <div className="w-4/12">
                <div className="mb-1 block">
                  <Label value="Batch name" />
                </div>
                <TextInput
                  type="text"
                  placeholder="Enter batch name"
                  required
                />
              </div>
              <div className="w-4/12">
                <div className="mb-1 block">
                  <Label value="Relationship Manager" />
                </div>
                <Select required>
                  <option>Enter relationship manager</option>
                  <option>01</option>
                  <option>02</option>
                  <option>03</option>
                </Select>
              </div>
              <div className="w-4/12">
                <div className="mb-1 block">
                  <Label value="Batch Coach" />
                </div>
                <Select required>
                  <option>Choose coach</option>
                  <option>01</option>
                  <option>02</option>
                  <option>03</option>
                </Select>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-4/12">
                <div className="mb-1 block">
                  <Label value="Batch Limit" />
                </div>
                <TextInput
                  type="text"
                  placeholder="Enter batch limit"
                  required
                />
              </div>
              <div className="w-4/12">
                <div className="mb-1 block">
                  <Label value="Country" />
                </div>
                <Select required>
                  <option>Select Country</option>
                  <option>01</option>
                  <option>02</option>
                  <option>03</option>
                </Select>
              </div>
              <div className="w-4/12">
                <div className="mb-1 block">
                  <Label value="Batch Type" />
                </div>
                <Select required>
                  <option>Select Batch Type</option>
                  <option>01</option>
                  <option>02</option>
                  <option>03</option>
                </Select>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-4/12">
                <div className="mb-1 block">
                  <Label value="Batch Duration" />
                </div>
                <div className="mb-4">
                  <div className="flex gap-2">
                    {/* Numeric input for duration */}
                    <input
                      type="text"
                      placeholder="Enter Course Duration"
                      className="w-full border rounded px-4 py-2"
                    />

                    {/* Dropdown for duration type */}
                    <select className="w-1/2 border rounded px-4 py-2">
                      <option value="">Select</option>
                      <option value="week">Week(s)</option>
                      <option value="month">Month(s)</option>
                      <option value="year">Year(s)</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="w-4/12 flex gap-4">
                <div>
                  <div className="mb-1 block">
                    <Label value="Start Date" />
                  </div>
                  <Datepicker />
                </div>
                <div>
                  <div className="mb-1 block">
                    <Label value="End Date" />
                  </div>
                  <Datepicker />
                </div>
              </div>
              <div className="w-4/12">
                <div className="mb-1 block">
                  <Label value="Course Name" />
                </div>
                <Select required>
                  <option>Select Course Name</option>
                  <option>01</option>
                  <option>02</option>
                  <option>03</option>
                </Select>
              </div>
            </div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Batch Timings</h2>
            </div>
            <div className="flex gap-8">
              <div className="flex gap-4 w-6/12">
                <div className="w-4/12">
                  <div className="mb-1 block">
                    <Label value="Day" />
                  </div>
                  <Select required>
                    <option>Select Day</option>
                    <option>01</option>
                    <option>02</option>
                    <option>03</option>
                  </Select>
                </div>
                <div className="w-8/12">
                  <div className="mb-1 block">
                    <Label value="Start Time" />
                  </div>
                  <div className="flex gap-2">
                    <div className="w-8/12">
                      <TextInput
                        type="text"
                        placeholder="Enter Start Time"
                        required
                      />
                    </div>
                    <div className="w-4/12">
                      <Select required>
                        <option>Select</option>
                        <option>AM</option>
                        <option>PM</option>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 w-4/12">
                <div className="w-full">
                  <div className="mb-1 block">
                    <Label value="End Time" />
                  </div>
                  <div className="flex gap-2">
                    <div className="w-8/12">
                      <TextInput
                        type="text"
                        placeholder="Enter End Time"
                        required
                      />
                    </div>
                    <div className="w-4/12">
                      <Select required>
                        <option>Select</option>
                        <option>AM</option>
                        <option>PM</option>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-2/12 flex gap-2 pt-6">
                <button>
                  <BsFillPlusCircleFill className="text-[#009d42] hover:text-black text-2xl" />
                </button>
                <button>
                  <FaCircleMinus className="text-[#ca0000] hover:text-black text-2xl" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBatch;

import React, { useState } from "react";
import { Modal, Button, TextInput, Label, Select } from "flowbite-react";
import { ToastContainer } from "react-toastify";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { BiSolidMessageSquareEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const ManageBatch = () => {
  const navigate = useNavigate();
  const [rowData] = useState([
    {
      name: "USA-FG-767",
      student: "Anuj Sharma, Soumalya Chandra, Megha Sharma,... ",
      country: "USA",
      limit: "10 Students",
      coach: "Garry Charles",
      manager: "Koushik Roy",
    },
  ]);

  const [columnDefs] = useState([
    {
      field: "name",
      headerName: "Batch Name",
      sortable: true,
      filter: true,
    },
    {
      field: "student",
      headerName: "Batch Students",
      sortable: true,
      filter: true,
    },
    { field: "country", headerName: "Country", sortable: true, filter: true },
    {
      field: "limit",
      headerName: "Batch Limit",
      sortable: true,
      filter: true,
    },
    {
      field: "coach",
      headerName: "Batch Coach",
      sortable: true,
      filter: true,
    },
    {
      field: "manager",
      headerName: "Relationship Manager",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: () => (
        <div className="flex gap-0">
          <Button>
            <BiSolidMessageSquareEdit className="text-[#34A0A4] hover:text-black text-2xl" />
          </Button>
          <Button>
            <MdDelete className="text-[#F94141] hover:text-[#ff0000] text-2xl" />
          </Button>
        </div>
      ),
    },
    {
      headerName: "Details",
      field: "Details",
      cellRenderer: () => (
        <Button
          onClick={() => handleBatchDetails()}
          className="border text-[#52b69a] border-[#52b69a] bg-white hover:bg-[#52b69a] hover:text-white text-xl px-6 py-0 my-1"
        >
          Details
        </Button>
      ),
    },
  ]);

  const handleAddBatch = () => {
    navigate("/add-batch");
  };

  const handleBatchDetails = () => {
    navigate("/view-batch-details");
  };

  return (
    <div>
      <ToastContainer />
      <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-white">
        <div className="h-full lg:h-screen">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Mange Batches</h2>
            <Button
              onClick={() => handleAddBatch()}
              className="bg-[#52b69a] hover:bg-black px-4 py-1 text-white text-base font-semibold flex justify-center items-center rounded-md"
            >
              Add New Batch
            </Button>
          </div>
          <div
            className="ag-theme-alpine"
            style={{ height: 600, width: "100%" }}
          >
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              pagination={true}
              paginationPageSize={10}
              domLayout="autoHeight"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageBatch;

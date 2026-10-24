import React, { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { Button } from "flowbite-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { BiSolidMessageSquareEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { CgAdd } from "react-icons/cg";
import { useDispatch, useSelector } from "react-redux";

import {
  getAllVehicleInfo,
  deleteVehicleInfo,
} from "../../Reducer/VehicleInfoSlice";

import AddVehicleModal from "./AddVehicleModal";
import EditVehicleModal from "./EditVehicleModal";
import DeleteVehicleModal from "./DeleteVehicleModal";
import StatusToggleRenderVehicle from "./StatusToggleRenderVehicle";

const Transport = () => {
  const dispatch = useDispatch();
  const { vehicleInfoList, loading } = useSelector(
    (state) => state?.vehicleInfo || {}
  );

  // Local state for vehicles
  const [vehicles, setVehicles] = useState([]);

  // Modal states
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  // Selected item for edit/delete
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const hasFetchedRef = useRef(false);

  /**
   * 1. Fetch vehicle info on component mount (strictly once)
   */
  useEffect(() => {
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      dispatch(getAllVehicleInfo());
    }
  }, [dispatch]);

  /**
   * 2. Sync with Redux / Backend API response
   */
  useEffect(() => {
    const apiData =
      vehicleInfoList?.data ||
      vehicleInfoList?.res ||
      vehicleInfoList?.vehicles ||
      vehicleInfoList?.result ||
      (Array.isArray(vehicleInfoList) ? vehicleInfoList : null);

    if (Array.isArray(apiData)) {
      const mapped = apiData.map((item, index) => ({
        id: item.id || item._id || index + 1,
        vehicle_no: item.vehicle_no || item.vehicleNo || item.vehicleno || "",
        no_of_seat:
          item.no_of_seat !== undefined && item.no_of_seat !== null
            ? item.no_of_seat
            : item.no_of_seats !== undefined && item.no_of_seats !== null
            ? item.no_of_seats
            : "NA",
        status:
          item.status === 1 ||
          item.status === true ||
          item.status === "1" ||
          item.isActive === true
            ? 1
            : 0,
        raw: item,
      }));
      setVehicles(mapped);
    }
  }, [vehicleInfoList]);

  // Handler for opening edit modal
  const handleOpenEdit = useCallback((vehicle) => {
    setSelectedVehicle(vehicle);
    setOpenEditModal(true);
  }, []);

  // Handler for opening delete modal
  const handleOpenDelete = useCallback((vehicle) => {
    setSelectedVehicle(vehicle);
    setOpenDeleteModal(true);
  }, []);

  // Handler for confirming delete
  const handleConfirmDelete = async () => {
    if (!selectedVehicle?.id) return;
    setDeleteLoading(true);

    try {
      const res = await dispatch(deleteVehicleInfo(selectedVehicle.id));
      if (
        res?.meta?.requestStatus === "fulfilled" ||
        res?.payload?.success ||
        res?.payload?.status_code === 200
      ) {
        toast.success(
          `Vehicle "${selectedVehicle.vehicle_no}" deleted successfully!`
        );
      } else {
        toast.info(`Vehicle "${selectedVehicle.vehicle_no}" removed.`);
      }

      // Optimistically remove from local list
      setVehicles((prev) => prev.filter((v) => v.id !== selectedVehicle.id));
      setOpenDeleteModal(false);
      setSelectedVehicle(null);

      // Refetch latest
      dispatch(getAllVehicleInfo());
    } catch (err) {
      console.error("Delete vehicle error:", err);
      toast.error("Failed to delete vehicle.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Optimistic handler for added vehicle
  const handleVehicleAdded = (newVehicle) => {
    setVehicles((prev) => [
      {
        id: prev.length > 0 ? Math.max(...prev.map((v) => Number(v.id) || 0)) + 1 : 1,
        vehicle_no: newVehicle.vehicle_no,
        no_of_seat: newVehicle.no_of_seat || "NA",
        status: newVehicle.status ?? 1,
      },
      ...prev,
    ]);
  };

  // Optimistic handler for updated vehicle
  const handleVehicleUpdated = (updated) => {
    setVehicles((prev) =>
      prev.map((v) =>
        v.id === updated.id
          ? {
              ...v,
              vehicle_no: updated.vehicle_no,
              no_of_seat: updated.no_of_seat || "NA",
              status: updated.status,
            }
          : v
      )
    );
  };

  /**
   * Row Data for AG Grid
   */
  const rowData = useMemo(() => {
    return vehicles.map((v) => ({
      id: v.id,
      vehicle_no: v.vehicle_no,
      no_of_seats: v.no_of_seat,
      status: v.status === 1,
      raw: v,
    }));
  }, [vehicles]);

  /**
   * Column Definitions for AG Grid
   * Columns: VEHICLE NAME/NO, NUMBER OF SEATS, STATUS, ACTIONS (Edit, Delete)
   */
  const columnDefs = useMemo(
    () => [
      {
        field: "id",
        headerName: "ID",
        sortable: true,
        filter: true,
        width: 90,
        maxWidth: 110,
        cellRenderer: (params) => (
          <span className="font-semibold text-gray-700">#{params?.value}</span>
        ),
      },
      {
        field: "vehicle_no",
        headerName: "VEHICLE NUMBER",
        sortable: true,
        filter: true,
        minWidth: 180,
        flex: 1,
        cellRenderer: (params) => (
          <span className="font-bold text-gray-800 tracking-wide uppercase">
            {params?.value || "—"}
          </span>
        ),
      },
      {
        field: "no_of_seats",
        headerName: "NUMBER OF SEATS",
        sortable: true,
        filter: true,
        minWidth: 160,
        cellRenderer: (params) => (
          <span className="inline-block bg-blue-50 text-blue-700 font-semibold px-2.5 py-0.5 rounded text-xs border border-blue-200">
            {params?.value !== undefined && params?.value !== null
              ? `${params.value} Seats`
              : "NA"}
          </span>
        ),
      },
      {
        field: "status",
        headerName: "STATUS",
        sortable: true,
        filter: false,
        minWidth: 150,
        cellRenderer: StatusToggleRenderVehicle,
      },
      {
        headerName: "ACTIONS",
        field: "actions",
        minWidth: 200,
        sortable: false,
        filter: false,
        cellRenderer: (params) => {
          const item = params?.data?.raw || params?.data;
          return (
            <div className="flex items-center gap-2 h-full py-1">
              <button
                type="button"
                onClick={() => handleOpenEdit(item)}
                title="Edit Vehicle"
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md border border-[#536EFF] text-[#536EFF] bg-white hover:bg-[#536EFF] hover:text-white transition-colors duration-150 cursor-pointer shadow-xs"
              >
                <BiSolidMessageSquareEdit className="text-base" />
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleOpenDelete(item)}
                title="Delete Vehicle"
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md border border-[#bf0300] text-[#bf0300] bg-white hover:bg-[#bf0300] hover:text-white transition-colors duration-150 cursor-pointer shadow-xs"
              >
                <MdDelete className="text-base" />
                Delete
              </button>
            </div>
          );
        },
      },
    ],
    [handleOpenEdit, handleOpenDelete]
  );

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Main Table Card Styled exactly like Booking screenshot */}
      <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-white shadow-sm border border-gray-100">
        <div className="h-full">
          {/* Header Row: Title on Left, Add Vehicle Button on Right */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">
                Transport
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Manage vehicle fleet, seats, active status and vehicle operations
              </p>
            </div>

            <Button
              onClick={() => setOpenAddModal(true)}
              className="bg-[#bf0300] hover:bg-[#a01618] px-4 py-1 text-white hover:text-white text-base font-semibold flex justify-center items-center rounded-md transition-colors duration-200 shadow-sm"
            >
              <CgAdd className="text-[18px] mr-1" />
              Add Vehicle
            </Button>
          </div>

          {/* AG Grid Table */}
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
              defaultColDef={{
                resizable: true,
              }}
              overlayNoRowsTemplate={
                '<span class="ag-overlay-no-rows-center">No Rows To Show</span>'
              }
            />
          </div>
        </div>
      </div>

      {/* 1. Add Vehicle Modal */}
      {openAddModal && (
        <AddVehicleModal
          isOpen={openAddModal}
          onClose={() => setOpenAddModal(false)}
          onVehicleAdded={handleVehicleAdded}
        />
      )}

      {/* 2. Edit Vehicle Modal */}
      {openEditModal && (
        <EditVehicleModal
          isOpen={openEditModal}
          onClose={() => {
            setOpenEditModal(false);
            setSelectedVehicle(null);
          }}
          vehicle={selectedVehicle}
          onVehicleUpdated={handleVehicleUpdated}
        />
      )}

      {/* 3. Delete Vehicle Modal */}
      {openDeleteModal && (
        <DeleteVehicleModal
          isOpen={openDeleteModal}
          onClose={() => {
            setOpenDeleteModal(false);
            setSelectedVehicle(null);
          }}
          vehicle={selectedVehicle}
          onConfirm={handleConfirmDelete}
          loading={deleteLoading}
        />
      )}
    </div>
  );
};

export default Transport;

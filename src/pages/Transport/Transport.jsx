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
import { BsEye } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";

import {
  getAllVehicleInfo,
  deleteVehicleInfo,
} from "../../Reducer/VehicleInfoSlice";
import { getCategory } from "../../Reducer/CategorySlice";

import AddVehicleModal from "./AddVehicleModal";
import EditVehicleModal from "./EditVehicleModal";
import DeleteVehicleModal from "./DeleteVehicleModal";
import ViewVehicleImagesModal from "./ViewVehicleImagesModal";
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
  const [openViewImagesModal, setOpenViewImagesModal] = useState(false);

  // Selected item for edit/delete/images
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [viewImagesVehicle, setViewImagesVehicle] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const hasFetchedRef = useRef(false);

  /**
   * 1. Fetch vehicle info and categories on component mount
   */
  useEffect(() => {
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      dispatch(getAllVehicleInfo());
      dispatch(getCategory());
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
      const mapped = apiData.map((item, index) => {
        const catName =
          item.category_name ||
          (Array.isArray(item.categories) && item.categories.length > 0
            ? item.categories.map((c) => c.category_name).join(", ")
            : item.category?.category_name) ||
          "—";

        const catId =
          item.category_id ||
          (Array.isArray(item.categories) && item.categories.length > 0
            ? item.categories[0].id
            : item.category?.id) ||
          null;

        return {
          id: item.id || item._id || index + 1,
          category_id: catId,
          category_name: catName,
          vehicle_no: item.vehicle_no || item.vehicleNo || item.vehicleno || "",
          no_of_seat:
            item.no_of_seat !== undefined && item.no_of_seat !== null
              ? item.no_of_seat
              : item.no_of_seats !== undefined && item.no_of_seats !== null
              ? item.no_of_seats
              : "NA",
          images: Array.isArray(item.images) ? item.images : [],
          status:
            item.status === 1 ||
            item.status === true ||
            item.status === "1" ||
            item.isActive === true
              ? 1
              : 0,
          raw: {
            ...item,
            category_id: catId,
            category_name: catName,
            images: Array.isArray(item.images) ? item.images : [],
          },
        };
      });
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

  // Optimistic handler for added vehicle (appends to bottom)
  const handleVehicleAdded = (newVehicle) => {
    setVehicles((prev) => [
      ...prev,
      {
        id: newVehicle.id || (prev.length > 0 ? Math.max(...prev.map((v) => Number(v.id) || 0)) + 1 : 1),
        category_id: newVehicle.category_id || null,
        category_name: newVehicle.category_name || "—",
        vehicle_no: newVehicle.vehicle_no,
        no_of_seat: newVehicle.no_of_seat || "NA",
        images: newVehicle.images || [],
        status: newVehicle.status ?? 1,
        raw: newVehicle,
      },
    ]);
  };

  // Optimistic handler for updated vehicle
  const handleVehicleUpdated = (updated) => {
    setVehicles((prev) =>
      prev.map((v) =>
        v.id === updated.id
          ? {
              ...v,
              category_id: updated.category_id !== undefined ? updated.category_id : v.category_id,
              category_name: updated.category_name !== undefined ? updated.category_name : v.category_name,
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
      category_name: v.category_name || "—",
      vehicle_no: v.vehicle_no,
      no_of_seats: v.no_of_seat,
      images: v.images || [],
      status: v.status === 1,
      raw: v,
    }));
  }, [vehicles]);

  /**
   * Column Definitions for AG Grid
   * Columns: ID, CATEGORY NAME, VEHICLE NUMBER, NUMBER OF SEATS, IMAGES, STATUS, ACTIONS
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
        field: "category_name",
        headerName: "CATEGORY NAME",
        sortable: true,
        filter: true,
        minWidth: 160,
        cellRenderer: (params) => (
          <span className="text-gray-700 font-medium capitalize">
            {params?.value && params.value !== "—" && params.value !== "NA"
              ? params.value
              : "—"}
          </span>
        ),
      },
      {
        field: "vehicle_no",
        headerName: "VEHICLE NUMBER",
        sortable: true,
        filter: true,
        minWidth: 190,
        flex: 1,
        cellRenderer: (params) => {
          const val = params?.value;
          if (!val || val === "—") {
            return <span className="text-gray-400 font-medium">—</span>;
          }
          return (
            <div className="flex items-center h-full py-1">
              <div className="inline-flex items-stretch border-2 border-gray-900 bg-white rounded shadow-2xs overflow-hidden select-none font-mono">
                <div className="bg-[#003893] text-white px-1.5 py-0.5 flex flex-col items-center justify-center">
                  <span className="text-[6px] font-black text-amber-300 leading-none">●</span>
                  <span className="text-[7px] font-black tracking-tighter leading-none mt-0.5">IND</span>
                </div>
                <div className="px-2.5 py-0.5 bg-gradient-to-b from-white via-gray-50 to-gray-100 flex items-center justify-center">
                  <span className="font-black text-gray-900 text-xs tracking-wider uppercase">
                    {val}
                  </span>
                </div>
              </div>
            </div>
          );
        },
      },
      {
        field: "no_of_seats",
        headerName: "NUMBER OF SEATS",
        sortable: true,
        filter: true,
        minWidth: 160,
        cellRenderer: (params) => (
          <span className="text-gray-700 font-medium">
            {params?.value !== undefined && params?.value !== null && params?.value !== "NA"
              ? `${params.value} Seats`
              : "NA"}
          </span>
        ),
      },
      {
        field: "images",
        headerName: "IMAGES",
        sortable: false,
        filter: false,
        minWidth: 130,
        cellRenderer: (params) => {
          const item = params?.data?.raw || params?.data;
          const count = Array.isArray(item?.images) ? item.images.length : 0;
          return (
            <div className="flex items-center h-full py-1">
              <button
                type="button"
                onClick={() => {
                  setViewImagesVehicle(item);
                  setOpenViewImagesModal(true);
                }}
                title="View vehicle images"
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md border border-[#536EFF] text-[#536EFF] bg-white hover:bg-[#536EFF] hover:text-white transition-colors duration-150 cursor-pointer shadow-xs"
              >
                <BsEye className="text-sm" />
                View {count > 0 ? `(${count})` : ""}
              </button>
            </div>
          );
        },
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

      {/* Main Table Card */}
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

      {/* 4. View Vehicle Images Modal */}
      {openViewImagesModal && (
        <ViewVehicleImagesModal
          isOpen={openViewImagesModal}
          onClose={() => {
            setOpenViewImagesModal(false);
            setViewImagesVehicle(null);
          }}
          vehicle={viewImagesVehicle}
          onImagesUpdated={() => dispatch(getAllVehicleInfo())}
        />
      )}
    </div>
  );
};

export default Transport;

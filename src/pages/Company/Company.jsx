import React, { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { Button, TextInput } from "flowbite-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { BiSolidMessageSquareEdit } from "react-icons/bi";
import { MdDelete, MdDirectionsCar } from "react-icons/md";
import { CgAdd } from "react-icons/cg";
import { HiOutlineOfficeBuilding, HiOutlineMail, HiOutlineSearch } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import nodeApi from "../../store/nodeApi";

import {
  getAllCompany,
  deleteCompany,
} from "../../Reducer/CompanySlice";

import AddCompanyModal from "./AddCompanyModal";
import EditCompanyModal from "./EditCompanyModal";
import DeleteCompanyModal from "./DeleteCompanyModal";
import StatusToggleRendererCompany from "./StatusToggleRendererCompany";
import CompanyVehicleModal from "./CompanyVehicleModal";

/**
 * Default fallback companies used if database is empty initially.
 * Automatically synchronizes with live database records when available.
 */
const DEFAULT_COMPANIES = [
  {
    id: 1,
    company_name: "Boroma Transport Logistics",
    company_email: "contact@boromatransport.com",
    status: 1,
  },
  {
    id: 2,
    company_name: "Skyware Corporate Services",
    company_email: "info@skyware.in",
    status: 1,
  },
];

const Company = () => {
  const dispatch = useDispatch();
  const { companyList, loading } = useSelector(
    (state) => state?.company || {}
  );

  // Grid API reference for search filtering
  const gridRef = useRef(null);

  // Local state for companies list
  const [companies, setCompanies] = useState(DEFAULT_COMPANIES);
  const [quickFilterText, setQuickFilterText] = useState("");

  // Modal controls
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openVehicleModal, setOpenVehicleModal] = useState(false);

  // Selected item for edit or delete
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [vehicleCompany, setVehicleCompany] = useState(null);
  const [companyVehiclesMap, setCompanyVehiclesMap] = useState({}); // { [companyId]: [vehicles] }
  const [deleteLoading, setDeleteLoading] = useState(false);

  const hasFetchedRef = useRef(false);

  /**
   * 1. Fetch all companies on component mount
   */
  useEffect(() => {
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      dispatch(getAllCompany());
    }
  }, [dispatch]);

  /**
   * 2. Fetch all company-vehicle mappings
   */
  const fetchAllMappings = useCallback(async () => {
    try {
      let res;
      try {
        res = await nodeApi.get("/company-car-map/getAll");
      } catch (e) {
        res = await nodeApi.get("/company-car-maps/getAll");
      }

      const mappings =
        res?.data?.data ||
        res?.data?.mappings ||
        res?.data?.result ||
        (Array.isArray(res?.data) ? res.data : []);

      if (Array.isArray(mappings)) {
        const grouped = {};
        mappings.forEach((m) => {
          const cId = m.company_id;
          if (!grouped[cId]) grouped[cId] = [];
          const v = m.vehicle || {};
          grouped[cId].push({
            mappingId: m.id,
            vehicleId: m.vehicle_id || v.id,
            vehicle_no: v.vehicle_no || m.vehicle_no || "—",
            category_name:
              v.category?.category_name ||
              (Array.isArray(v.categories) && v.categories.length > 0
                ? v.categories[0].category_name
                : v.category_name) ||
              "—",
            no_of_seat: v.no_of_seat,
            status: m.status,
          });
        });
        setCompanyVehiclesMap(grouped);
      }
    } catch (err) {
      console.error("Fetch all mappings error:", err);
    }
  }, []);

  useEffect(() => {
    fetchAllMappings();
  }, [fetchAllMappings]);

  /**
   * 3. Synchronize with Redux / Backend API response
   */
  useEffect(() => {
    const apiData =
      companyList?.data ||
      companyList?.companies ||
      companyList?.result ||
      companyList?.res ||
      (Array.isArray(companyList) ? companyList : null);

    if (Array.isArray(apiData) && apiData.length > 0) {
      const mapped = apiData.map((item, index) => ({
        id: item.id || item._id || index + 1,
        company_name: item.company_name || item.name || "—",
        company_email: item.company_email || item.email || "—",
        status:
          item.status === 1 ||
          item.status === true ||
          item.status === "1" ||
          item.isActive === true
            ? 1
            : 0,
        raw: item,
      }));
      setCompanies(mapped);
    }
  }, [companyList]);

  // Handler: Open edit modal
  const handleOpenEdit = useCallback((company) => {
    setSelectedCompany(company);
    setOpenEditModal(true);
  }, []);

  // Handler: Open delete modal
  const handleOpenDelete = useCallback((company) => {
    setSelectedCompany(company);
    setOpenDeleteModal(true);
  }, []);

  // Handler: Open vehicle management modal
  const handleOpenVehicles = useCallback((company) => {
    setVehicleCompany(company);
    setOpenVehicleModal(true);
  }, []);

  // Handler: Update vehicles after changes in modal
  const handleVehiclesUpdated = useCallback(
    (companyId) => {
      fetchAllMappings();
    },
    [fetchAllMappings]
  );

  // Handler: Confirm delete
  const handleConfirmDelete = async () => {
    if (!selectedCompany?.id) return;
    setDeleteLoading(true);

    try {
      const res = await dispatch(deleteCompany(selectedCompany.id));

      if (
        res?.meta?.requestStatus === "fulfilled" ||
        res?.payload?.success ||
        res?.payload?.status === 200
      ) {
        toast.success(
          `Company "${selectedCompany.company_name}" deleted successfully!`
        );
        // Optimistically remove from local state
        setCompanies((prev) => prev.filter((c) => c.id !== selectedCompany.id));
        setOpenDeleteModal(false);
        setSelectedCompany(null);
        // Refetch latest from server
        dispatch(getAllCompany({ force: true }));
      } else {
        const errorMsg =
          res?.payload?.message ||
          res?.payload?.error ||
          "Failed to delete company.";
        toast.error(errorMsg);
      }
    } catch (err) {
      console.error("Delete company error:", err);
      toast.error("Failed to delete company. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Optimistic handler: Add Company
  const handleCompanyAdded = (newCompany) => {
    setCompanies((prev) => [
      {
        id:
          newCompany.id ||
          (prev.length > 0 ? Math.max(...prev.map((c) => Number(c.id) || 0)) + 1 : 1),
        company_name: newCompany.company_name,
        company_email: newCompany.company_email,
        status: newCompany.status ?? 1,
        raw: newCompany,
      },
      ...prev,
    ]);
  };

  // Optimistic handler: Update Company
  const handleCompanyUpdated = (updated) => {
    setCompanies((prev) =>
      prev.map((c) =>
        c.id === updated.id
          ? {
              ...c,
              company_name: updated.company_name,
              company_email: updated.company_email,
              status: updated.status !== undefined ? updated.status : c.status,
              raw: { ...c.raw, ...updated },
            }
          : c
      )
    );
  };

  /**
   * Row Data for AG Grid
   */
  const rowData = useMemo(() => {
    return companies.map((c) => ({
      id: c.id,
      company_name: c.company_name,
      company_email: c.company_email,
      vehicles: companyVehiclesMap[c.id] || [],
      status: c.status === 1,
      raw: c,
    }));
  }, [companies, companyVehiclesMap]);

  /**
   * Column Definitions for AG Grid
   * Columns: COMPANY NAME, COMPANY EMAIL, VEHICLES, STATUS, ACTIONS
   */
  const columnDefs = useMemo(
    () => [
      {
        field: "company_name",
        headerName: "COMPANY NAME",
        sortable: true,
        filter: true,
        minWidth: 190,
        flex: 1.2,
        cellRenderer: (params) => {
          const val = params?.value;
          return (
            <div className="flex items-center gap-2.5 h-full py-1">
              <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-[#bf0300] shrink-0 border border-red-100">
                <HiOutlineOfficeBuilding className="text-lg" />
              </div>
              <span className="text-gray-800 font-semibold truncate capitalize">
                {val || "—"}
              </span>
            </div>
          );
        },
      },
      {
        field: "company_email",
        headerName: "COMPANY EMAIL",
        sortable: true,
        filter: true,
        minWidth: 200,
        flex: 1.2,
        cellRenderer: (params) => {
          const email = params?.value;
          if (!email || email === "—") {
            return <span className="text-gray-400 font-medium">—</span>;
          }
          return (
            <div className="flex items-center gap-2 h-full py-1">
              <HiOutlineMail className="text-gray-400 text-base shrink-0" />
              <a
                href={`mailto:${email}`}
                className="text-gray-700 hover:text-[#536EFF] hover:underline font-normal text-sm truncate"
                title={`Send email to ${email}`}
              >
                {email}
              </a>
            </div>
          );
        },
      },
      {
        field: "vehicles",
        headerName: "VEHICLES",
        sortable: false,
        filter: true,
        minWidth: 220,
        flex: 1.5,
        cellRenderer: (params) => {
          const item = params?.data?.raw || params?.data;
          const vehicles = params?.value || [];

          if (!vehicles || vehicles.length === 0) {
            return (
              <div className="flex items-center h-full py-1">
                <span className="inline-block bg-gray-100 text-gray-400 font-semibold text-xs px-2.5 py-0.5 rounded border border-gray-200">
                  NA
                </span>
              </div>
            );
          }

          return (
            <div className="flex items-center gap-1.5 flex-wrap h-full py-1">
              {vehicles.slice(0, 2).map((v, idx) => (
                <span
                  key={v.mappingId || idx}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-bold bg-slate-100 text-slate-800 border border-slate-300 shadow-2xs uppercase tracking-wide hover:bg-slate-200 transition-colors"
                  title={`${v.vehicle_no}${v.category_name && v.category_name !== "—" ? ` (${v.category_name})` : ""}`}
                >
                  {v.vehicle_no}
                </span>
              ))}
              {vehicles.length > 2 && (
                <button
                  type="button"
                  onClick={() => handleOpenVehicles(item)}
                  title={vehicles.map((v) => v.vehicle_no).join(", ")}
                  className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-[#536EFF] border border-indigo-200 hover:bg-indigo-100 transition-colors cursor-pointer"
                >
                  +{vehicles.length - 2} more
                </button>
              )}
            </div>
          );
        },
      },
      {
        field: "status",
        headerName: "STATUS",
        sortable: true,
        filter: false,
        minWidth: 140,
        flex: 0.8,
        cellRenderer: StatusToggleRendererCompany,
      },
      {
        headerName: "ACTIONS",
        field: "actions",
        minWidth: 290,
        flex: 1.4,
        sortable: false,
        filter: false,
        cellRenderer: (params) => {
          const item = params?.data?.raw || params?.data;
          return (
            <div className="flex items-center gap-2 h-full py-1">
              <button
                type="button"
                onClick={() => handleOpenVehicles(item)}
                title="Manage / Add Vehicle to Company"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border border-[#16a34a] text-[#16a34a] bg-white hover:bg-[#16a34a] hover:text-white transition-colors duration-150 cursor-pointer shadow-2xs shrink-0"
              >
                <MdDirectionsCar className="text-base" />
                Add Vehicle
              </button>
              <button
                type="button"
                onClick={() => handleOpenEdit(item)}
                title="Edit Company"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border border-[#536EFF] text-[#536EFF] bg-white hover:bg-[#536EFF] hover:text-white transition-colors duration-150 cursor-pointer shadow-2xs shrink-0"
              >
                <BiSolidMessageSquareEdit className="text-base" />
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleOpenDelete(item)}
                title="Delete Company"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border border-[#bf0300] text-[#bf0300] bg-white hover:bg-[#bf0300] hover:text-white transition-colors duration-150 cursor-pointer shadow-2xs shrink-0"
              >
                <MdDelete className="text-base" />
                Delete
              </button>
            </div>
          );
        },
      },
    ],
    [handleOpenEdit, handleOpenDelete, handleOpenVehicles]
  );

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Main Table Card */}
      <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-white shadow-sm border border-gray-100">
        <div className="h-full">
          {/* Header Row: Title on Left, Search + Add Company Button on Right */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">
                Company
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Manage registered companies, business contacts, and active statuses
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-56 sm:w-64">
                <TextInput
                  type="text"
                  icon={HiOutlineSearch}
                  placeholder="Quick search..."
                  value={quickFilterText}
                  onChange={(e) => setQuickFilterText(e.target.value)}
                  sizing="sm"
                />
              </div>

              <Button
                onClick={() => setOpenAddModal(true)}
                className="bg-[#bf0300] hover:bg-[#a01618] px-4 py-1 text-white hover:text-white text-base font-semibold flex justify-center items-center rounded-md transition-colors duration-200 shadow-sm shrink-0"
              >
                <CgAdd className="text-[18px] mr-1" />
                Add Company
              </Button>
            </div>
          </div>

          {/* AG Grid Table */}
          <div
            className="ag-theme-alpine"
            style={{ height: 550, width: "100%" }}
          >
            <AgGridReact
              ref={gridRef}
              rowData={rowData}
              columnDefs={columnDefs}
              quickFilterText={quickFilterText}
              pagination={true}
              paginationPageSize={10}
              domLayout="autoHeight"
              defaultColDef={{
                resizable: true,
              }}
              overlayNoRowsTemplate={
                '<span class="ag-overlay-no-rows-center font-medium text-gray-500">No Companies Found</span>'
              }
            />
          </div>
        </div>
      </div>

      {/* 1. Add Company Modal */}
      {openAddModal && (
        <AddCompanyModal
          isOpen={openAddModal}
          onClose={() => setOpenAddModal(false)}
          onCompanyAdded={handleCompanyAdded}
        />
      )}

      {/* 2. Edit Company Modal */}
      {openEditModal && (
        <EditCompanyModal
          isOpen={openEditModal}
          onClose={() => {
            setOpenEditModal(false);
            setSelectedCompany(null);
          }}
          company={selectedCompany}
          onCompanyUpdated={handleCompanyUpdated}
        />
      )}

      {/* 3. Delete Company Modal */}
      {openDeleteModal && (
        <DeleteCompanyModal
          isOpen={openDeleteModal}
          onClose={() => {
            setOpenDeleteModal(false);
            setSelectedCompany(null);
          }}
          company={selectedCompany}
          onConfirm={handleConfirmDelete}
          loading={deleteLoading}
        />
      )}

      {/* 4. Company Vehicle Management Modal */}
      {openVehicleModal && (
        <CompanyVehicleModal
          isOpen={openVehicleModal}
          onClose={() => {
            setOpenVehicleModal(false);
            setVehicleCompany(null);
          }}
          company={vehicleCompany}
          onVehiclesUpdated={handleVehiclesUpdated}
        />
      )}
    </div>
  );
};

export default Company;
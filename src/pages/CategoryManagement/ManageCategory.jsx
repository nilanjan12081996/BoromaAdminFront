import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
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
  changeStatus,
  getCategory,
  deleteCategory,
} from "../../Reducer/CategorySlice";

import AddCategory from "./AddCategory";
import UpdateCategory from "./UpdateCategory";
import DeleteCategoryModal from "./DeleteCategoryModal";
import StatusToggleRenderer from "./StatusToggleRenderer";

/**
 * =========================================================================
 * INITIAL / DUMMY CATEGORY DATA
 * (Used immediately so the table displays data and works interactively.
 *  When backend endpoints are provided, it automatically syncs with the API.)
 * =========================================================================
 */
const DEFAULT_CATEGORIES = [
  { id: 1, category_name: "Bus", short_name: "BUS", status: 1 },
  { id: 2, category_name: "Sedan Cab", short_name: "SEDAN", status: 1 },
  { id: 3, category_name: "SUV Cab", short_name: "SUV", status: 1 },
  { id: 4, category_name: "Mini Bus / Traveller", short_name: "MINIBUS", status: 1 },
  { id: 5, category_name: "Luxury Coach", short_name: "COACH", status: 0 },
  { id: 6, category_name: "Auto Rickshaw", short_name: "AUTO", status: 1 },
];

const ManageCategory = () => {
  const dispatch = useDispatch();
  const { categoryList, loading } = useSelector((state) => state?.category || {});

  // Local state to support instant interactive Add / Update / Delete
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

  // Modal control states
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  // Selected category for Edit / Delete
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const hasFetchedRef = useRef(false);

  /**
   * 1. FETCH CATEGORIES ON COMPONENT MOUNT
   * Calls getCategory thunk from Redux (pointing to /api/category/get).
   */
  useEffect(() => {
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      dispatch(getCategory());
    }
  }, [dispatch]);

  /**
   * 2. SYNC WITH BACKEND API RESPONSE WHEN AVAILABLE
   */
  useEffect(() => {
    const apiData =
      categoryList?.data ||
      categoryList?.categories ||
      categoryList?.res ||
      categoryList?.result ||
      (Array.isArray(categoryList) ? categoryList : null);

    if (Array.isArray(apiData) && apiData.length > 0) {
      const mapped = apiData.map((item, index) => ({
        id: item.id || item._id || index + 1,
        category_name: item.category_name || item.name || item.categoryName || "",
        short_name: item.short_name || item.shortName || item.shortname || "",
        status:
          item.status === 1 ||
          item.status === true ||
          item.status === "1" ||
          item.isActive === true ||
          item.is_active === 1
            ? 1
            : 0,
      }));
      setCategories(mapped);
    }
  }, [categoryList]);

  // Handlers for Add Category
  const handleCategoryAdded = (newCat) => {
    setCategories((prev) => [
      {
        id: prev.length > 0 ? Math.max(...prev.map((c) => Number(c.id) || 0)) + 1 : 1,
        category_name: newCat.category_name,
        short_name: newCat.short_name || "",
        status: newCat.status ?? 1,
      },
      ...prev,
    ]);
  };

  // Handlers for Edit Category
  const handleOpenEdit = (category) => {
    setSelectedCategory(category);
    setOpenEditModal(true);
  };

  const handleCategoryUpdated = (updatedCat) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === updatedCat.id
          ? {
              ...c,
              category_name: updatedCat.category_name,
              short_name: updatedCat.short_name || "",
              status: updatedCat.status,
            }
          : c
      )
    );
  };

  // Handlers for Delete Category
  const handleOpenDelete = (category) => {
    setSelectedCategory(category);
    setOpenDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedCategory) return;
    setDeleteLoading(true);

    try {
      // Dispatch Redux action (connected to nodeApi: /category/delete/:id)
      await dispatch(
        deleteCategory({
          id: selectedCategory.id,
          category_id: selectedCategory.id,
        })
      );

      // Update local state
      setCategories((prev) => prev.filter((c) => c.id !== selectedCategory.id));
      toast.success(`Category "${selectedCategory.category_name}" deleted successfully!`);
      setOpenDeleteModal(false);
      setSelectedCategory(null);

      // Refetch latest from API
      dispatch(getCategory());
    } catch (err) {
      console.error("Delete category error:", err);
      // Fallback local delete
      setCategories((prev) => prev.filter((c) => c.id !== selectedCategory.id));
      toast.success(`Category deleted locally!`);
      setOpenDeleteModal(false);
      setSelectedCategory(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Status toggle handler
  const handleStatusToggle = useCallback(
    async (id, newStatusBool) => {
      const numericStatus = newStatusBool ? 1 : 0;
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: numericStatus } : c))
      );

      // Dispatch Redux changeStatus thunk (connected to nodeApi: /category/:id/toggle-status)
      await dispatch(
        changeStatus({
          id: id,
          category_id: id,
          status: numericStatus,
        })
      );

      toast.info(
        `Category status set to ${newStatusBool ? "Active" : "Inactive"}`
      );

      // Refetch latest from API
      dispatch(getCategory());
    },
    [dispatch]
  );

  /**
   * Row Data for AG Grid
   */
  const rowData = useMemo(() => {
    return categories.map((cat) => ({
      id: cat.id,
      category_name: cat.category_name,
      short_name: cat.short_name || "",
      status: cat.status === 1,
      rawStatus: cat.status,
      rawData: cat,
    }));
  }, [categories]);

  /**
   * Column Definitions for AG Grid
   * Columns: ID, CATEGORY NAME, SHORT NAME, STATUS, ACTIONS
   */
  const columnDefs = useMemo(
    () => [

      {
        field: "category_name",
        headerName: "CATEGORY NAME",
        sortable: true,
        filter: true,
        minWidth: 200,
        flex: 1,
        cellRenderer: (params) => (
          <span className="font-medium text-gray-800">{params?.value}</span>
        ),
      },
      {
        field: "short_name",
        headerName: "SHORT NAME",
        sortable: true,
        filter: true,
        minWidth: 140,
        cellRenderer: (params) => (
          <span className="inline-block bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded text-xs font-mono font-semibold border border-gray-200">
            {params?.value || "—"}
          </span>
        ),
      },
      {
        field: "status",
        headerName: "STATUS",
        sortable: true,
        filter: false,
        minWidth: 160,
        cellRenderer: StatusToggleRenderer,
      },
      {
        headerName: "ACTIONS",
        field: "actions",
        minWidth: 200,
        sortable: false,
        filter: false,
        cellRenderer: (params) => {
          const item = params?.data?.rawData;
          return (
            <div className="flex items-center gap-2 h-full py-1">
              <button
                type="button"
                onClick={() => handleOpenEdit(item)}
                title="Edit Category"
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md border border-[#536EFF] text-[#536EFF] bg-white hover:bg-[#536EFF] hover:text-white transition-colors duration-150 cursor-pointer shadow-xs"
              >
                <BiSolidMessageSquareEdit className="text-base" />
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleOpenDelete(item)}
                title="Delete Category"
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
    []
  );

  return (
    <div className="category_management_container">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Main Table Card Styled exactly like Screenshot 2 */}
      <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-white shadow-sm border border-gray-100">
        <div className="h-full">
          {/* Header Row: Title on Left, Add Category Button on Right */}
          <div className="flex justify-between items-center mb-5">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
                Category
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Manage, add, update, and remove vehicle categories
              </p>
            </div>

            <Button
              onClick={() => setOpenAddModal(true)}
              className="bg-[#bf0300] hover:bg-[#a01618] px-4 py-1 text-white hover:text-white text-base font-semibold flex justify-center items-center rounded-md transition-colors duration-200 shadow-sm"
            >
              <CgAdd className="text-[20px] mr-1.5" />
              Add Category
            </Button>
          </div>

          {/* AG Grid Table */}
          <div
            className="ag-theme-alpine"
            style={{ width: "100%", height: 500 }}
          >
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              pagination={true}
              paginationPageSize={10}
              domLayout="autoHeight"
              context={{
                onStatusToggle: handleStatusToggle,
              }}
              defaultColDef={{
                resizable: true,
              }}
            />
          </div>
        </div>
      </div>

      {/* 1. Add Category Modal */}
      {openAddModal && (
        <AddCategory
          isOpen={openAddModal}
          onClose={() => setOpenAddModal(false)}
          onCategoryAdded={handleCategoryAdded}
        />
      )}

      {/* 2. Edit Category Modal */}
      {openEditModal && (
        <UpdateCategory
          isOpen={openEditModal}
          onClose={() => {
            setOpenEditModal(false);
            setSelectedCategory(null);
          }}
          category={selectedCategory}
          onCategoryUpdated={handleCategoryUpdated}
        />
      )}

      {/* 3. Delete Category Modal */}
      {openDeleteModal && (
        <DeleteCategoryModal
          isOpen={openDeleteModal}
          onClose={() => {
            setOpenDeleteModal(false);
            setSelectedCategory(null);
          }}
          category={selectedCategory}
          onConfirm={handleConfirmDelete}
          loading={deleteLoading}
        />
      )}
    </div>
  );
};

export default ManageCategory;
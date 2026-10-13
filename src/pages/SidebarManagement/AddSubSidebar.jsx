import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addSubSidebar, getSidebarList } from "../../Reducer/SidebarSlice";
import { RxDashboard } from "react-icons/rx";
import {
  FiPlus,
  FiArrowLeft,
  FiLayers,
} from "react-icons/fi";

const AddSubSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { addSubLoading, sidebarList } = useSelector(
    (state) => state.sidebar || {}
  );

  const [formData, setFormData] = useState({
    name: "",
    shortName: "",
    id: "",
  });

  const [errors, setErrors] = useState({});
  const hasLoadedRef = useRef(false);

  // Fetch parent sidebar list if not already loaded so users can pick from dropdown
  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;
    if (!sidebarList || sidebarList.length === 0) {
      dispatch(getSidebarList());
    }
  }, [dispatch, sidebarList]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleGenerateSlug = () => {
    if (!formData.name) return;
    const slug = formData.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setFormData((prev) => ({ ...prev, shortName: slug }));
    if (errors.shortName) {
      setErrors((prev) => ({ ...prev, shortName: "" }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name?.trim()) {
      errs.name = "Sub Sidebar Name is required";
    }
    if (!formData.shortName?.trim()) {
      errs.shortName = "Short Name is required";
    }
    if (!formData.id?.toString().trim()) {
      errs.id = "Please select a parent sidebar";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const trimmedId = formData.id?.toString().trim();
    const parsedId =
      !isNaN(Number(trimmedId)) && trimmedId !== ""
        ? Number(trimmedId)
        : trimmedId;

    const payload = {
      id: parsedId,
      name: formData.name.trim(),
      shortName: formData.shortName.trim(),
      short_name: formData.shortName.trim(),
      sidebarId: parsedId,
      parentId: parsedId,
    };

    try {
      const resultAction = await dispatch(addSubSidebar(payload));

      if (addSubSidebar.fulfilled.match(resultAction)) {
        toast.success("Sub Sidebar item added successfully!");
        setFormData({
          name: "",
          shortName: "",
          id: "",
        });
        setErrors({});
      } else {
        const errorMsg =
          resultAction?.payload?.message ||
          (resultAction?.payload?.error &&
            typeof resultAction.payload.error === "object"
            ? Object.values(resultAction.payload.error).join(", ")
            : null) ||
          resultAction?.payload ||
          "Failed to add sub-sidebar item.";
        toast.error(
          typeof errorMsg === "string"
            ? errorMsg
            : "Failed to add sub-sidebar item."
        );
      }
    } catch (err) {
      toast.error(err?.message || "An unexpected error occurred.");
    }
  };

  // Available sidebars for the select dropdown
  const availableParents = Array.isArray(sidebarList) ? sidebarList : [];

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-gray-50/50">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="max-w-xl mx-auto mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 transition duration-200"
            title="Go back"
          >
            <FiArrowLeft className="text-lg" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Add Sub Sidebar
              </h1>

            </div>
          </div>
        </div>

        <Link
          to="/add-sidebar"
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-[#536EFF] hover:text-[#4359e0] bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm hover:bg-gray-50 transition duration-150"
          title="Go to Add Main Sidebar"
        >
          <RxDashboard className="text-sm" />
          <span>Add Main Sidebar</span>
        </Link>
      </div>

      {/* Form Container */}
      <div className="max-w-xl mx-auto">
        {/* Form Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 pb-4 mb-5 border-b border-gray-100">
            <FiLayers className="text-xl text-[#536EFF]" />
            <h2 className="text-lg font-semibold text-gray-800">
              Sub-Sidebar Information
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Field 1: Sub-Sidebar Name */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Sub Sidebar Name <span className="text-red-500">*</span>
                </label>
                {formData.name && !formData.shortName && (
                  <button
                    type="button"
                    onClick={handleGenerateSlug}
                    className="text-xs text-[#536EFF] hover:underline"
                  >
                    Generate short name
                  </button>
                )}
              </div>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Booking List, Vehicle Maintenance"
                className={`w-full px-4 py-2.5 text-sm rounded-xl border ${errors.name
                  ? "border-red-400 focus:ring-red-200"
                  : "border-gray-200 focus:border-[#536EFF] focus:ring-[#536EFF]/20"
                  } bg-white text-gray-900 transition duration-200 focus:outline-none focus:ring-2`}
              />
              {errors.name && (
                <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Field 2: Short Name / Slug */}
            <div>
              <label
                htmlFor="shortName"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Sub Sidebar Short Name <span className="text-red-500">*</span>
              </label>
              <input
                id="shortName"
                name="shortName"
                type="text"
                value={formData.shortName}
                onChange={handleChange}
                placeholder="e.g. booking-list, vehicle-maintenance"
                className={`w-full px-4 py-2.5 text-sm rounded-xl border ${errors.shortName
                  ? "border-red-400 focus:ring-red-200"
                  : "border-gray-200 focus:border-[#536EFF] focus:ring-[#536EFF]/20"
                  } bg-white text-gray-900 transition duration-200 focus:outline-none focus:ring-2`}
              />
              {errors.shortName ? (
                <p className="mt-1.5 text-xs text-red-500">{errors.shortName}</p>
              ) : (
                <p className="mt-1 text-xs text-gray-400">
                  Unique route key (e.g. /{formData.shortName || "example"})
                </p>
              )}
            </div>

            {/* Field 3: Select Parent Sidebar (ID) - Dropdown only */}
            <div>
              <label
                htmlFor="id"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Select Parent Sidebar (ID) <span className="text-red-500">*</span>
              </label>

              <select
                id="id"
                name="id"
                aria-label="Select Parent Sidebar"
                value={formData.id}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 text-sm rounded-xl border ${errors.id
                  ? "border-red-400 focus:ring-red-200"
                  : "border-gray-200 focus:border-[#536EFF] focus:ring-[#536EFF]/20"
                  } bg-white text-gray-900 transition duration-200 focus:outline-none focus:ring-2 cursor-pointer`}
              >
                <option value="">-- Choose from existing sidebars --</option>
                {availableParents.map((parent) => {
                  const pid =
                    parent?.id ?? parent?._id ?? parent?.sidebar_id;
                  const pname =
                    parent?.name || parent?.title || `Sidebar ${pid}`;
                  const pshort =
                    parent?.shortName || parent?.short_name || "";
                  return (
                    <option key={pid} value={pid}>
                      {pname} (ID: {pid}{pshort ? ` - /${pshort}` : ""})
                    </option>
                  );
                })}
              </select>

              {errors.id ? (
                <p className="mt-1.5 text-xs text-red-500">{errors.id}</p>
              ) : (
                <p className="mt-1 text-xs text-gray-400">
                  Choose the parent sidebar item under which this sub-sidebar will be nested.
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="submit"
                disabled={addSubLoading}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#536EFF] text-white text-sm font-medium hover:bg-[#4359e0] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed transition duration-200 shadow-sm"
              >
                {addSubLoading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <FiPlus className="text-base" />
                    <span>Add Sub Sidebar</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setFormData({ name: "", shortName: "", id: "" });
                  setErrors({});
                }}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 active:scale-[0.99] transition duration-200"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSubSidebar;

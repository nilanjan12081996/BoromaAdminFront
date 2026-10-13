import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addSidebar } from "../../Reducer/SidebarSlice";
import { RxDashboard } from "react-icons/rx";
import { FiPlus, FiArrowLeft, FiLayers } from "react-icons/fi";

const AddSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { addLoading } = useSelector((state) => state.sidebar || {});

  const [formData, setFormData] = useState({
    name: "",
    shortName: "",
    parentId: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Each input is completely independent
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name?.trim()) {
      errs.name = "Sidebar Name is required";
    }
    if (!formData.shortName?.trim()) {
      errs.shortName = "Sidebar ID / Short Name is required";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Defaults to 0 if parentId is empty or not a number
    const parsedParentId =
      !formData.parentId ||
        formData.parentId.trim() === "" ||
        isNaN(Number(formData.parentId))
        ? 0
        : Number(formData.parentId);

    const payload = {
      name: formData.name.trim(),
      shortName: formData.shortName.trim(),
      parentId: parsedParentId,
    };

    try {
      const resultAction = await dispatch(addSidebar(payload));

      if (addSidebar.fulfilled.match(resultAction)) {
        toast.success("Sidebar item added successfully!");
        setFormData({
          name: "",
          shortName: "",
          parentId: "",
        });
      } else {
        const errorMsg =
          resultAction?.payload?.message ||
          (resultAction?.payload?.error &&
            typeof resultAction.payload.error === "object"
            ? Object.values(resultAction.payload.error).join(", ")
            : null) ||
          "Failed to add sidebar item.";
        toast.error(errorMsg);
      }
    } catch (err) {
      toast.error(err?.message || "An unexpected error occurred.");
    }
  };

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
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Add Sidebar
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Create dynamic menu items for the admin navigation sidebar.
            </p>
          </div>
        </div>

        <Link
          to="/add-subsidebar"
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-[#536EFF] hover:text-[#4359e0] bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm hover:bg-gray-50 transition duration-150"
          title="Go to Add Sub Sidebar"
        >
          <FiLayers className="text-sm" />
          <span>Add Sub Sidebar</span>
        </Link>
      </div>

      {/* Only Form Card */}
      <div className="max-w-xl mx-auto">
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 pb-4 mb-5 border-b border-gray-100">
            <RxDashboard className="text-xl text-[#536EFF]" />
            <h2 className="text-lg font-semibold text-gray-800">
              Sidebar Information
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Sidebar Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Sidebar Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Booking, Transport, Maintenance"
                className={`w-full px-4 py-2.5 text-sm rounded-xl border ${errors.name
                    ? "border-red-400 focus:ring-red-200"
                    : "border-gray-200 focus:border-[#536EFF] focus:ring-[#536EFF]/20"
                  } bg-white text-gray-900 transition duration-200 focus:outline-none focus:ring-2`}
              />
              {errors.name && (
                <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Sidebar ID / Short Name */}
            <div>
              <label
                htmlFor="shortName"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Sidebar Short Name <span className="text-red-500">*</span>
              </label>
              <input
                id="shortName"
                name="shortName"
                type="text"
                value={formData.shortName}
                onChange={handleChange}
                placeholder="e.g. booking, transport, vehicle-management"
                className={`w-full px-4 py-2.5 text-sm rounded-xl border ${errors.shortName
                    ? "border-red-400 focus:ring-red-200"
                    : "border-gray-200 focus:border-[#536EFF] focus:ring-[#536EFF]/20"
                  } bg-white text-gray-900 transition duration-200 focus:outline-none focus:ring-2`}
              />
              {errors.shortName ? (
                <p className="mt-1.5 text-xs text-red-500">{errors.shortName}</p>
              ) : (
                <p className="mt-1 text-xs text-gray-400">
                  Unique identifier and route key (e.g. /{formData.shortName || "example"})
                </p>
              )}
            </div>

            {/* Parent ID */}
            <div>
              <label
                htmlFor="parentId"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Parent ID
              </label>
              <input
                id="parentId"
                name="parentId"
                type="text"
                value={formData.parentId}
                onChange={handleChange}
                placeholder="Enter Parent ID (e.g. 0)"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white text-gray-900 transition duration-200 focus:border-[#536EFF] focus:ring-2 focus:ring-[#536EFF]/20 focus:outline-none"
              />
              <p className="mt-1 text-xs text-gray-400">
                Leave empty or enter 0 for top-level menu item, or enter parent sidebar ID for submenus.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="submit"
                disabled={addLoading}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#536EFF] text-white text-sm font-medium hover:bg-[#4359e0] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed transition duration-200 shadow-sm"
              >
                {addLoading ? (
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
                    <span>Add Sidebar</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setFormData({ name: "", shortName: "", parentId: "" });
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

export default AddSidebar;

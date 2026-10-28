import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toggleCompanyStatus, getAllCompany } from "../../Reducer/CompanySlice";
import { toast } from "react-toastify";

const StatusToggleRendererCompany = (props) => {
  const dispatch = useDispatch();
  const [status, setStatus] = useState(Boolean(props?.value));
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setStatus(Boolean(props?.value));
  }, [props?.value]);

  const handleToggle = async (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (isUpdating) return;

    const companyId = props?.data?.id;
    if (!companyId) return;

    const newStatus = !status;
    setStatus(newStatus);
    setIsUpdating(true);

    try {
      const res = await dispatch(toggleCompanyStatus(companyId));

      if (res?.meta?.requestStatus === "fulfilled" || res?.payload?.success) {
        toast.info(
          `Company "${props?.data?.company_name || ""}" status set to ${
            newStatus ? "Active" : "Inactive"
          }`
        );
        // Refresh server data
        dispatch(getAllCompany({ force: true }));
      } else {
        const errorMsg =
          res?.payload?.message || "Failed to update company status";
        toast.error(errorMsg);
        setStatus(!newStatus);
      }
    } catch (err) {
      console.error("Company toggle status error:", err);
      toast.error("Failed to update company status");
      setStatus(!newStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center gap-2 h-full py-1">
      <div
        onClick={handleToggle}
        title={
          isUpdating
            ? "Updating status..."
            : status
            ? "Click to Deactivate"
            : "Click to Activate"
        }
        className={`w-12 h-6 flex items-center rounded-full p-0.5 cursor-pointer transition-colors duration-300 ${
          isUpdating ? "opacity-60 cursor-not-allowed" : ""
        } ${status ? "bg-green-500" : "bg-gray-300 hover:bg-gray-400"}`}
      >
        <div
          className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
            status ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </div>
      <span
        className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
          status
            ? "bg-green-50 text-green-700 border border-green-200"
            : "bg-gray-100 text-gray-500 border border-gray-200"
        }`}
      >
        {status ? "Active" : "Inactive"}
      </span>
    </div>
  );
};

export default StatusToggleRendererCompany;

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toggleVehicleInfoStatus, getAllVehicleInfo } from "../../Reducer/VehicleInfoSlice";
import { toast } from "react-toastify";

const StatusToggleRenderVehicle = (props) => {
  const dispatch = useDispatch();
  const [status, setStatus] = useState(Boolean(props?.value));

  useEffect(() => {
    setStatus(Boolean(props?.value));
  }, [props?.value]);

  const handleToggle = async (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    const newStatus = !status;
    const numericStatus = newStatus ? 1 : 0;
    setStatus(newStatus);

    const vehicleId = props?.data?.id;
    if (!vehicleId) return;

    try {
      const res = await dispatch(
        toggleVehicleInfoStatus({
          id: vehicleId,
          status: numericStatus,
        })
      );

      if (res?.meta?.requestStatus === "fulfilled") {
        toast.info(
          `Vehicle ${props?.data?.vehicle_no || ""} status set to ${
            newStatus ? "Active" : "Inactive"
          }`
        );
        // Refresh list
        dispatch(getAllVehicleInfo());
      } else {
        toast.error("Failed to update status");
        setStatus(!newStatus);
      }
    } catch (err) {
      console.error("Toggle error:", err);
      setStatus(!newStatus);
    }
  };

  return (
    <div className="flex items-center gap-2 h-full py-1">
      <div
        onClick={handleToggle}
        title={status ? "Click to Deactivate" : "Click to Activate"}
        className={`w-12 h-6 flex items-center rounded-full p-0.5 cursor-pointer transition-colors duration-300 ${
          status ? "bg-green-500" : "bg-gray-300 hover:bg-gray-400"
        }`}
      >
        <div
          className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
            status ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </div>
      <span
        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
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

export default StatusToggleRenderVehicle;

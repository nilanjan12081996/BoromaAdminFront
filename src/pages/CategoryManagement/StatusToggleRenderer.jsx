import React, { useEffect, useState } from "react";

const StatusToggleRenderer = (props) => {
  const [status, setStatus] = useState(Boolean(props?.value));

  useEffect(() => {
    setStatus(Boolean(props?.value));
  }, [props?.value]);

  const handleToggle = (e) => {
    e.stopPropagation();
    const newStatus = !status;
    setStatus(newStatus);

    // Call parent handler if provided in context/props
    if (props?.context?.onStatusToggle) {
      props.context.onStatusToggle(props?.data?.id, newStatus);
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

export default StatusToggleRenderer;

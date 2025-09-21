import React, { useState } from "react";
import { useDispatch } from "react-redux";

import { changeStatusSub, getSubCategory } from "../../Reducer/SubcategorySlice";
import { changeStatusVehicle, getVehiclesInfo } from "../../Reducer/VehicleSlice";

const StatusToggleRenderVehicle = (props) => {
  const dispatch = useDispatch();
  const [status, setStatus] = useState(props?.value); // props.value = true/false

  const handleToggle = () => {
    const newStatus = !status;
    setStatus(newStatus);

    // API payload
    const payload = {
      vehicle_info_id: props?.data?.id, // row id
      status: newStatus ? 1 : 0,
    };

    // Call API
    dispatch(changeStatusVehicle(payload)).then((res)=>{
        if(res?.payload?.status_code===200){
            dispatch(getVehiclesInfo())
        }
    });
  };

  return (
    <div
      onClick={handleToggle}
      className={`w-16 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
        status ? "bg-green-500" : "bg-gray-400"
      }`}
    >
      <div
        className={`bg-white w-6 h-6 rounded-full shadow-md transform duration-300 ${
          status ? "translate-x-9" : "translate-x-0"
        }`}
      />
    </div>
  );
};

export default StatusToggleRenderVehicle;

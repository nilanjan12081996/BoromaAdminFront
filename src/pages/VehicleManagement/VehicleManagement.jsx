import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Button,
  TextInput,
  Label,
  Select,
  Textarea,
  FileInput,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { ToastContainer } from "react-toastify";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useNavigate } from "react-router-dom";
import { CgAdd } from "react-icons/cg";
import { useDispatch } from "react-redux";

import { useSelector } from "react-redux";
import { getSubCategory } from "../../Reducer/SubcategorySlice";

import { getVehiclesInfo } from "../../Reducer/VehicleSlice";
import StatusToggleRenderVehicle from "./StatusToggleRenderVehicle";
import AddVehicle from "./AddVehicle";
const VehicleManagement=()=>{
    const{vehicleList}=useSelector((state)=>state?.vehicles)
    const[vehicleId,setVehicleId]=useState()
    const [loadingStates, setLoadingStates] = useState({});
   const [openAddVehicleModal, setOpenAddVehicleModal] = useState(false);
     const [openVehicleDetailsModal, setOpenVehicleDetailsModal] =
       useState(false);
     const [openManageMerchantDetailsModal, setOpenManageMerchantDetailsModal] =
       useState(false);
     const navigate = useNavigate();
     const dispatch=useDispatch()
     useEffect(()=>{
dispatch(getVehiclesInfo())
  },[])
console.log("vehicleList: ",vehicleList);
  const rowData = useMemo(() => {
    // Safety checks for undefined/null data
    if (!vehicleList?.res || !Array.isArray(vehicleList.res)) {
      console.log("No merchant data available or invalid format");
      return [];
    }

    return vehicleList?.res?.map((mar, index) => ({
      id: mar?.id ,
      vehicle_no: mar?.vehicle_no || "",
      no_of_seats:mar?.no_of_seats?mar?.no_of_seats:"NA",
      vehicle_type:mar?.vehicle_type,
      status: mar?.status === 1 
    }));
  }, [vehicleList]);

 const columnDefs = useMemo(() => [
    {
      field:'vehicle_no',
      headerName: "VEHICLE NAME",
      sortable: true,
      filter: true,
      minWidth: 150,
    },

      {
      field:'no_of_seats',
      headerName: "NUMBER OF SEATS",
      sortable: true,
      filter: true,
      minWidth: 150,
    },

       {
      field:'vehicle_type',
      headerName: "VEHICLE TYPE",
      sortable: true,
      filter: true,
      minWidth: 150,
    },
 
     {
            field: "status",
            headerName: "STATUS",
            sortable: true,
            filter: false, // Disable filter for toggle column
            minWidth: 150,
             cellRenderer: StatusToggleRenderVehicle,
        },
    // {
    //   field: "status",
    //   headerName: "STATUS",
    //   sortable: true,
    //   filter: true,
    //   minWidth: 100,
    // },

    {
      headerName: "ACTIONS",
      field: "actions",
      minWidth: 120,
      cellRenderer: (params) => (
        <Button
          onClick={() => handleSubDetails(params?.data?.id)}
          className="border text-[#536EFF] border-[#536EFF] bg-white hover:bg-[#536EFF] hover:text-white text-xl px-4 py-0 my-1"
        >
          View Details
        </Button>
      ),
    },
  ], []);

   
     const handleAddSub = () => {
       setOpenAddVehicleModal(true);
     };
   
     const handleSubDetails = (id) => {
       setOpenSubDetailsModal(true);
       setsubCategoryId(id)
     };
   
     const handleManageMerchantDetails = () => {
       setOpenManageMerchantDetailsModal(true);
       setOpenMerchantDetailsModal(false);
     };
   
     return (
       <div>
         <ToastContainer />
         <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-white">
           <div className="h-full lg:h-screen">
             <div className="flex justify-between items-center mb-4">
               <h2 className="text-2xl font-semibold">Vehicle Info</h2>
               <Button
                 onClick={() => handleAddSub()}
                 className="bg-[#536EFF] hover:bg-[#E7E7FF] px-4 py-1 text-white hover:text-[#536EFF] text-base font-semibold flex justify-center items-center rounded-md"
               >
                 <CgAdd className="text-[18px] mr-1" />
                 Add Vehicle Info
               </Button>
             </div>
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
               />
             </div>
           </div>
         </div>
         {/* Register New Merchant modal start here */}
       {
        openAddVehicleModal&&<AddVehicle
        openAddVehicleModal={openAddVehicleModal}
        setOpenAddVehicleModal={setOpenAddVehicleModal}
        />
      }  
      {/* {
        openSubDetailsModal&&<UpdateSubCategory
        openSubDetailsModal={openSubDetailsModal}
        setOpenSubDetailsModal={setOpenSubDetailsModal}
        subcategoryId={subcategoryId}
        />
      }  */}
       </div>
     );
}
export default VehicleManagement;
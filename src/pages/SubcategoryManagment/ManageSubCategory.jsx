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
import StatusToggleRendererSub from "./StatusToggleRendererSub";
import AddSubCategory from "./AddSubCategory";



const ManageSubCategory=()=>{
    const{subCategoryList}=useSelector((state)=>state?.subCategory)
    const[subcategoryId,setsubCategoryId]=useState()
    const [loadingStates, setLoadingStates] = useState({});
   const [openAddSubModal, setOpenAddSubModal] = useState(false);
     const [openSubDetailsModal, setOpenSubDetailsModal] =
       useState(false);
     const [openManageMerchantDetailsModal, setOpenManageMerchantDetailsModal] =
       useState(false);
     const navigate = useNavigate();
     const dispatch=useDispatch()
     useEffect(()=>{
dispatch(getSubCategory())
  },[])
console.log("categoryList: ",subCategoryList);
  const rowData = useMemo(() => {
    // Safety checks for undefined/null data
    if (!subCategoryList?.res || !Array.isArray(subCategoryList.res)) {
      console.log("No merchant data available or invalid format");
      return [];
    }

    return subCategoryList?.res.map((mar, index) => ({
      id: mar?.id , // Ensure unique ID
      subcat_name: mar?.subcat_name || "",
      status: mar?.status === 1 
    }));
  }, [subCategoryList]);

 const columnDefs = useMemo(() => [
    {
      field:'subcat_name',
      headerName: "SUB CATEGORY NAME",
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
             cellRenderer: StatusToggleRendererSub,
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
          onClick={() => handleMerchantDetails(params?.data?.id)}
          className="border text-[#536EFF] border-[#536EFF] bg-white hover:bg-[#536EFF] hover:text-white text-xl px-4 py-0 my-1"
        >
          View Details
        </Button>
      ),
    },
  ], []);

   
     const handleAddSub = () => {
       setOpenAddSubModal(true);
     };
   
     const handleMerchantDetails = (id) => {
       setOpenMerchantDetailsModal(true);
       setCategoryId(id)
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
               <h2 className="text-2xl font-semibold">Sub Category List</h2>
               <Button
                 onClick={() => handleAddSub()}
                 className="bg-[#536EFF] hover:bg-[#E7E7FF] px-4 py-1 text-white hover:text-[#536EFF] text-base font-semibold flex justify-center items-center rounded-md"
               >
                 <CgAdd className="text-[18px] mr-1" />
                 Add Sub Category
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
        openAddSubModal&&<AddSubCategory
        openAddSubModal={openAddSubModal}
        setOpenAddSubModal={setOpenAddSubModal}
        />
      }  
      {/* {
        openMerchantDetailsModal&&<UpdateCategory
        openMerchantDetailsModal={openMerchantDetailsModal}
        setOpenMerchantDetailsModal={setOpenMerchantDetailsModal}
        categoryId={categoryId}
        />
      } */}
       </div>
     );
}
export default ManageSubCategory;
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
import { BiSolidMessageSquareEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { CgAdd } from "react-icons/cg";
import { FiPhoneCall } from "react-icons/fi";
import { HiOutlineMail } from "react-icons/hi";
import { useDispatch } from "react-redux";
import { changeStatus, getCategory } from "../../Reducer/CategorySlice";
import { useSelector } from "react-redux";
import AddCategory from "./AddCategory";
import StatusToggleRenderer from "./StatusToggleRenderer";
import UpdateCategory from "./UpdateCategory";
const ManageCategory=()=>{
    const{categoryList}=useSelector((state)=>state?.category)
    const[categoryId,setCategoryId]=useState()
    const [loadingStates, setLoadingStates] = useState({});
   const [openAddMerchantModal, setOpenAddMerchantModal] = useState(false);
     const [openMerchantDetailsModal, setOpenMerchantDetailsModal] =
       useState(false);
     const [openManageMerchantDetailsModal, setOpenManageMerchantDetailsModal] =
       useState(false);
     const navigate = useNavigate();
     const dispatch=useDispatch()
     useEffect(()=>{
dispatch(getCategory())
  },[])
console.log("categoryList: ",categoryList);
  const rowData = useMemo(() => {
    // Safety checks for undefined/null data
    if (!categoryList?.res || !Array.isArray(categoryList.res)) {
      console.log("No merchant data available or invalid format");
      return [];
    }

    return categoryList?.res.map((mar, index) => ({
      id: mar?.id , // Ensure unique ID
      category_name: mar?.category_name || "",
      status: mar?.status === 1 
    }));
  }, [categoryList]);

 const columnDefs = useMemo(() => [
    {
      field:'category_name',
      headerName: "CATEGORY NAME",
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
            cellRenderer: StatusToggleRenderer,
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

   
     const handleAddMerchant = () => {
       setOpenAddMerchantModal(true);
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
               <h2 className="text-2xl font-semibold">Category List</h2>
               <Button
                 onClick={() => handleAddMerchant()}
                 className="bg-[#536EFF] hover:bg-[#E7E7FF] px-4 py-1 text-white hover:text-[#536EFF] text-base font-semibold flex justify-center items-center rounded-md"
               >
                 <CgAdd className="text-[18px] mr-1" />
                 Add Category
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
        openAddMerchantModal&&<AddCategory
        openAddMerchantModal={openAddMerchantModal}
        setOpenAddMerchantModal={setOpenAddMerchantModal}
        />
      }  
      {
        openMerchantDetailsModal&&<UpdateCategory
        openMerchantDetailsModal={openMerchantDetailsModal}
        setOpenMerchantDetailsModal={setOpenMerchantDetailsModal}
        categoryId={categoryId}
        />
      }
       </div>
     );
}
export default ManageCategory;
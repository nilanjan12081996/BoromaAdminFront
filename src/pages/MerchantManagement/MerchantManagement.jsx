import React, { useState } from "react";
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

const MerchantManagement = () => {
  const [openAddMerchantModal, setOpenAddMerchantModal] = useState(false);
  const [openMerchantDetailsModal, setOpenMerchantDetailsModal] =
    useState(false);
  const [openManageMerchantDetailsModal, setOpenManageMerchantDetailsModal] =
    useState(false);
  const navigate = useNavigate();
  const [rowData] = useState([
    {
      name: "Erik Sarkar",
      email: "ErikSarkar2@gmail.com",
      shopname: "Burger Shot",
      phone: "+91 -3721909981",
      walletbalance: "₹2300",
      pointtransaction: "1000 Points",
      status: "Active",
      lastactive: "03 Jul 2025",
    },
  ]);

  const [columnDefs] = useState([
    {
      field: "name",
      headerName: "MERCHANT NAME",
      sortable: true,
      filter: true,
    },
    {
      field: "email",
      headerName: "EMAIL ID",
      sortable: true,
      filter: true,
    },
    {
      field: "shopname",
      headerName: "SHOP NAME",
      sortable: true,
      filter: true,
    },
    {
      field: "phone",
      headerName: "PHONE NUMBER",
      sortable: true,
      filter: true,
    },
    {
      field: "walletbalance",
      headerName: "WALLET BALANCE",
      sortable: true,
      filter: true,
    },
    {
      field: "pointtransaction",
      headerName: "POINT TRANSACTION",
      sortable: true,
      filter: true,
    },
    {
      field: "status",
      headerName: "STATUS",
      sortable: true,
      filter: true,
    },
    {
      field: "lastactive",
      headerName: "LAST ACTIVE",
      sortable: true,
      filter: true,
    },

    {
      headerName: "ACTIONS",
      field: "actions",
      cellRenderer: () => (
        <Button
          onClick={() => handleMerchantDetails()}
          className="border text-[#536EFF] border-[#536EFF] bg-white hover:bg-[#536EFF] hover:text-white text-xl px-4 py-0 my-1"
        >
          View Details
        </Button>
      ),
    },
  ]);

  const handleAddMerchant = () => {
    setOpenAddMerchantModal(true);
  };

  const handleMerchantDetails = () => {
    setOpenMerchantDetailsModal(true);
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
            <h2 className="text-2xl font-semibold">Merchant List</h2>
            <Button
              onClick={() => handleAddMerchant()}
              className="bg-[#536EFF] hover:bg-[#E7E7FF] px-4 py-1 text-white hover:text-[#536EFF] text-base font-semibold flex justify-center items-center rounded-md"
            >
              <CgAdd className="text-[18px] mr-1" />
              Register New Merchant
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
      <Modal
        show={openAddMerchantModal}
        onClose={() => setOpenAddMerchantModal(false)}
      >
        <Modal.Header className="text-[#435971]">
          Register New Merchant
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-4 h-[500px] overflow-y-scroll">
            <div>
              <div className="mb-1 block">
                <Label value="Merchant Name *" />
              </div>
              <TextInput
                type="text"
                placeholder="Enter Merchant Name"
                required
              />
            </div>
            <div className="flex gap-4">
              <div className="w-6/12">
                <div className="mb-1 block">
                  <Label value="Email Id *" />
                </div>
                <TextInput type="email" placeholder="Enter Email Id" required />
              </div>
              <div className="w-6/12">
                <div className="mb-1 block">
                  <Label value="Phone Number *" />
                </div>
                <TextInput
                  type="tel"
                  placeholder="Enter Mobile Number"
                  required
                />
              </div>
            </div>
            <div>
              <div className="mb-1 block">
                <Label value="Shop Name *" />
              </div>
              <TextInput
                type="text"
                placeholder="Enter Company  Name"
                required
              />
            </div>
            <div>
              <div className="mb-1 block">
                <Label value="Shop GSTIN No. *" />
              </div>
              <TextInput type="text" placeholder="Enter GSTIN No." required />
            </div>
            <div className="flex gap-4">
              <div className="w-6/12">
                <div className="mb-1 block">
                  <Label value="Choose State *" />
                </div>
                <Select required>
                  <option>Choose State</option>
                  <option>West bengal</option>
                </Select>
              </div>
              <div className="w-6/12">
                <div className="mb-1 block">
                  <Label value="Choose City *" />
                </div>
                <Select required>
                  <option>Choose City</option>
                  <option>Kolkata</option>
                </Select>
              </div>
            </div>
            <div>
              <div className="mb-1 block">
                <Label value="Address *" />
              </div>
              <Textarea placeholder="Enter Address" required rows={4} />
            </div>
            <div>
              <div className="mb-1 block">
                <Label value="Profile Image" />
              </div>
              <div className="flex w-full items-center justify-center">
                <Label
                  htmlFor="dropzone-file"
                  className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                >
                  <div className="flex flex-col items-center justify-center pb-6 pt-5">
                    <svg
                      className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      SVG, PNG, JPG or GIF (MAX. 800x400px)
                    </p>
                  </div>
                  <FileInput id="dropzone-file" className="hidden" />
                </Label>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="flex justify-end">
          <Button
            className="bg-white text-gray-700 hover:bg-[#9b1c1c] hover:text-white border border-gray-300"
            onClick={() => setOpenAddMerchantModal(false)}
          >
            Cancel
          </Button>
          <Button className="bg-[#686AF8] hover:bg-black">
            Register Merchant
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Register New Merchant modal ends here */}
      {/* Merchant Details modal start here */}
      <Modal
        show={openMerchantDetailsModal}
        onClose={() => setOpenMerchantDetailsModal(false)}
      >
        <Modal.Header className="text-[#435971]">Merchant Details</Modal.Header>
        <Modal.Body>
          <div className="space-y-4 h-[500px] overflow-y-scroll">
            <h3 className="text-base text-[#191919] font-bold mb-1">Details</h3>
            <div className="flex gap-4">
              <div className="text-sm text-[#697A8D] font-medium mb-2 w-6/12">
                Merchant Name
              </div>
              <div className="text-sm text-[#2A2A3C] font-medium mb-2 w-6/12">
                Erik Sarkar
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-sm text-[#697A8D] font-medium mb-2 w-6/12">
                Shop Name
              </div>
              <div className="text-sm text-[#2A2A3C] font-medium mb-2 w-6/12">
                Burger Shot
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-sm text-[#697A8D] font-medium mb-2 w-6/12">
                GSTIN No.
              </div>
              <div className="text-sm text-[#2A2A3C] font-medium mb-2 w-6/12">
                19HVGHL9861V0Z1
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-sm text-[#697A8D] font-medium mb-2 w-6/12">
                Email Id
              </div>
              <div className="text-sm text-[#2A2A3C] font-medium mb-2 w-6/12">
                ErikSarkar@gmail.com
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-sm text-[#697A8D] font-medium mb-2 w-6/12">
                Phone Number
              </div>
              <div className="text-sm text-[#2A2A3C] font-medium mb-2 w-6/12">
                +91 90885 67890
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-sm text-[#697A8D] font-medium mb-2 w-6/12">
                Address
              </div>
              <div className="text-sm text-[#2A2A3C] font-medium mb-2 w-6/12">
                1/A, Lenin Sarani Kolkata
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-sm text-[#697A8D] font-medium mb-2 w-6/12">
                Pincode
              </div>
              <div className="text-sm text-[#2A2A3C] font-medium mb-2 w-6/12">
                700013
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-sm text-[#697A8D] font-medium mb-2 w-6/12">
                Subscription Tier
              </div>
              <div className="text-sm text-[#2A2A3C] font-medium mb-2 w-6/12">
                Basic
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-sm text-[#697A8D] font-medium mb-2 w-6/12">
                Last Active
              </div>
              <div className="text-sm text-[#2A2A3C] font-medium mb-2 w-6/12">
                03 Jul 2025
              </div>
            </div>
            <h3 className="text-base text-[#191919] font-bold mb-1">
              Wallets Balance
            </h3>
            <div className="flex gap-4">
              <div className="text-sm text-[#697A8D] font-medium mb-2 w-6/12">
                Current Balance
              </div>
              <div className="text-sm text-[#2A2A3C] font-medium mb-2 w-6/12">
                ₹ 20000
              </div>
            </div>
            <h3 className="text-base text-[#191919] font-bold mb-1">
              Points History
            </h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-[#F8F8F8] rounded-md p-3 text-center">
                <p className="text-[#697A8D] text-xs font-medium pb-2">
                  Points Earned
                </p>
                <p className="text-[#000000] text-xs font-medium">10,000</p>
              </div>
              <div className="bg-[#F8F8F8] rounded-md p-3 text-center">
                <p className="text-[#697A8D] text-xs font-medium pb-2">
                  Points Redeemed
                </p>
                <p className="text-[#000000] text-xs font-medium">7,000</p>
              </div>
              <div className="bg-[#F8F8F8] rounded-md p-3 text-center">
                <p className="text-[#697A8D] text-xs font-medium pb-2">
                  Points Expired
                </p>
                <p className="text-[#000000] text-xs font-medium">500</p>
              </div>
            </div>
            <div className="mt-4 border border-[#E5E5E5] rounded-lg overflow-hidden">
              <h3 className="text-[#697A8D] text-sm font-semibold border-b border-[#E5E5E5] py-3 pl-6">
                Transaction History
              </h3>
              <div className="overflow-x-auto">
                <Table striped>
                  <TableHead>
                    <TableHeadCell className="font-semibild">
                      Date
                    </TableHeadCell>
                    <TableHeadCell className="font-semibild">
                      Type
                    </TableHeadCell>
                    <TableHeadCell className="font-semibild">
                      ₹ 500
                    </TableHeadCell>
                    <TableHeadCell className="font-semibild">
                      Reason
                    </TableHeadCell>
                  </TableHead>
                  <TableBody className="divide-y">
                    <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <TableCell className="py-2 text-[#697A8D]">
                        03-07-25
                      </TableCell>
                      <TableCell className="py-2 text-[#05923C]">
                        Credit
                      </TableCell>
                      <TableCell className="py-2 text-[#697A8D]">
                        ₹ 500
                      </TableCell>
                      <TableCell className="py-2 text-[#697A8D]">
                        Refund
                      </TableCell>
                    </TableRow>
                    <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <TableCell className="py-2 text-[#697A8D]">
                        03-07-25
                      </TableCell>
                      <TableCell className="py-2 text-[#05923C]">
                        Credit
                      </TableCell>
                      <TableCell className="py-2 text-[#697A8D]">
                        ₹ 500
                      </TableCell>
                      <TableCell className="py-2 text-[#697A8D]">
                        Refund
                      </TableCell>
                    </TableRow>
                    <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <TableCell className="py-2 text-[#697A8D]">
                        03-07-25
                      </TableCell>
                      <TableCell className="py-2 text-[#05923C]">
                        Credit
                      </TableCell>
                      <TableCell className="py-2 text-[#697A8D]">
                        ₹ 500
                      </TableCell>
                      <TableCell className="py-2 text-[#697A8D]">
                        Refund
                      </TableCell>
                    </TableRow>
                    <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <TableCell className="py-2 text-[#697A8D]">
                        03-07-25
                      </TableCell>
                      <TableCell className="py-2 text-[#F55D43]">
                        Debit
                      </TableCell>
                      <TableCell className="py-2 text-[#697A8D]">
                        ₹ 500
                      </TableCell>
                      <TableCell className="py-2 text-[#697A8D]">
                        Withdrawal
                      </TableCell>
                    </TableRow>
                    <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <TableCell className="py-2 text-[#697A8D]">
                        03-07-25
                      </TableCell>
                      <TableCell className="py-2 text-[#F55D43]">
                        Debit
                      </TableCell>
                      <TableCell className="py-2 text-[#697A8D]">
                        ₹ 500
                      </TableCell>
                      <TableCell className="py-2 text-[#697A8D]">
                        Withdrawal
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="flex justify-end">
          <Button
            className="bg-white text-gray-700 hover:bg-[#9b1c1c] hover:text-white border border-gray-300"
            onClick={() => setOpenMerchantDetailsModal(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleManageMerchantDetails}
            className="bg-[#686AF8] hover:bg-black"
          >
            Manage Merchant
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Merchant Details modal ends here */}
      {/* Manage Merchant Details modal start here */}
      <Modal
        show={openManageMerchantDetailsModal}
        onClose={() => setOpenManageMerchantDetailsModal(false)}
      >
        <Modal.Header className="text-[#435971]">Merchant Details</Modal.Header>
        <Modal.Body>
          <div className="space-y-4 h-[500px] overflow-y-scroll">
            <h3 className="text-base text-[#191919] font-bold mb-1">Details</h3>
            <div className="flex gap-4">
              <div className="w-6/12">
                <div className="mb-1 block">
                  <Label value="Merchant Name" />
                </div>
                <TextInput type="text" placeholder="Erik Sarkar" required />
              </div>
              <div className="w-6/12">
                <div className="mb-1 block">
                  <Label value="Shop Name " />
                </div>
                <TextInput type="text" placeholder="Burger Shot" required />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-6/12">
                <div className="mb-1 block">
                  <Label value="GSTIN No." />
                </div>
                <TextInput type="text" placeholder="19HVGHL9861V0Z1" required />
              </div>
              <div className="w-6/12">
                <div className="mb-1 block">
                  <Label value="Email Id" />
                </div>
                <TextInput
                  type="text"
                  placeholder="ErikSarkar@gmail.com"
                  required
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-6/12">
                <div className="mb-1 block">
                  <Label value="Phone Number " />
                </div>
                <TextInput type="text" placeholder="1234567890" required />
              </div>
              <div className="w-6/12">
                <div className="mb-1 block">
                  <Label value="Pincode" />
                </div>
                <TextInput type="text" placeholder="700013" required />
              </div>
            </div>
            <div>
              <div className="mb-1 block">
                <Label value="Address *" />
              </div>
              <Textarea
                placeholder="1/A, Lenin Sarani Kolkata"
                required
                rows={4}
              />
            </div>
            <h3 className="text-base text-[#191919] font-bold mb-1">
              Premium Upgrade
            </h3>
            <div className="flex gap-4">
              <div className="text-sm text-[#697A8D] font-medium mb-2 w-6/12">
                Subscription Tier
              </div>
              <div className="text-sm text-[#2A2A3C] font-medium mb-2 w-6/12">
                Basic
              </div>
            </div>
            <h3 className="text-base text-[#191919] font-bold mb-1">
              Wallets Balance
            </h3>
            <div className="flex gap-4">
              <div className="text-sm text-[#697A8D] font-medium mb-2 w-6/12">
                Current Balance
              </div>
              <div className="text-sm text-[#2A2A3C] font-medium mb-2 w-6/12">
                ₹ 20000
              </div>
            </div>
            <h3 className="text-base text-[#191919] font-bold mb-1">
              Points History
            </h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-[#F8F8F8] rounded-md p-3 text-center">
                <p className="text-[#697A8D] text-xs font-medium pb-2">
                  Points Earned
                </p>
                <p className="text-[#000000] text-xs font-medium">10,000</p>
              </div>
              <div className="bg-[#F8F8F8] rounded-md p-3 text-center">
                <p className="text-[#697A8D] text-xs font-medium pb-2">
                  Points Redeemed
                </p>
                <p className="text-[#000000] text-xs font-medium">7,000</p>
              </div>
              <div className="bg-[#F8F8F8] rounded-md p-3 text-center">
                <p className="text-[#697A8D] text-xs font-medium pb-2">
                  Points Expired
                </p>
                <p className="text-[#000000] text-xs font-medium">500</p>
              </div>
            </div>
            <div className="mb-0 block">
              <div className="flex gap-2">
                <button className="bg-[#05923C] hover:bg-black text-xs leading-[30px] rounded-md text-white font-normal px-4">
                  Issue points
                </button>
                <button className="bg-[#FF7760] hover:bg-black text-xs leading-[30px] rounded-md text-white font-normal px-4">
                  Revoke Points
                </button>
              </div>
            </div>
            <div className="mt-6 border border-[#E5E5E5] rounded-lg overflow-hidden">
              <h3 className="text-[#697A8D] text-sm font-semibold border-b border-[#E5E5E5] py-3 pl-6">
                Transaction History
              </h3>
              <div className="overflow-x-auto">
                <Table striped>
                  <TableHead>
                    <TableHeadCell className="font-semibild">
                      Date
                    </TableHeadCell>
                    <TableHeadCell className="font-semibild">
                      Type
                    </TableHeadCell>
                    <TableHeadCell className="font-semibild">
                      ₹ 500
                    </TableHeadCell>
                    <TableHeadCell className="font-semibild">
                      Reason
                    </TableHeadCell>
                  </TableHead>
                  <TableBody className="divide-y">
                    <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <TableCell className="py-2 text-[#697A8D]">
                        03-07-25
                      </TableCell>
                      <TableCell className="py-2 text-[#05923C]">
                        Credit
                      </TableCell>
                      <TableCell className="py-2 text-[#697A8D]">
                        ₹ 500
                      </TableCell>
                      <TableCell className="py-2 text-[#697A8D]">
                        Refund
                      </TableCell>
                    </TableRow>
                    <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <TableCell className="py-2 text-[#697A8D]">
                        03-07-25
                      </TableCell>
                      <TableCell className="py-2 text-[#05923C]">
                        Credit
                      </TableCell>
                      <TableCell className="py-2 text-[#697A8D]">
                        ₹ 500
                      </TableCell>
                      <TableCell className="py-2 text-[#697A8D]">
                        Refund
                      </TableCell>
                    </TableRow>
                    <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <TableCell className="py-2 text-[#697A8D]">
                        03-07-25
                      </TableCell>
                      <TableCell className="py-2 text-[#05923C]">
                        Credit
                      </TableCell>
                      <TableCell className="py-2 text-[#697A8D]">
                        ₹ 500
                      </TableCell>
                      <TableCell className="py-2 text-[#697A8D]">
                        Refund
                      </TableCell>
                    </TableRow>
                    <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <TableCell className="py-2 text-[#697A8D]">
                        03-07-25
                      </TableCell>
                      <TableCell className="py-2 text-[#F55D43]">
                        Debit
                      </TableCell>
                      <TableCell className="py-2 text-[#697A8D]">
                        ₹ 500
                      </TableCell>
                      <TableCell className="py-2 text-[#697A8D]">
                        Withdrawal
                      </TableCell>
                    </TableRow>
                    <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <TableCell className="py-2 text-[#697A8D]">
                        03-07-25
                      </TableCell>
                      <TableCell className="py-2 text-[#F55D43]">
                        Debit
                      </TableCell>
                      <TableCell className="py-2 text-[#697A8D]">
                        ₹ 500
                      </TableCell>
                      <TableCell className="py-2 text-[#697A8D]">
                        Withdrawal
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
            <div className="mb-0 block">
              <div className="flex justify-end gap-2">
                <button className="bg-white text-gray-700 hover:bg-[#9b1c1c] hover:text-white border border-gray-300 rounded-md p-2">
                  <HiOutlineMail />
                </button>
                <button className="bg-white text-gray-700 hover:bg-[#9b1c1c] hover:text-white border border-gray-300 rounded-md p-2">
                  <FiPhoneCall />
                </button>
                <button className="bg-[#F85656] hover:bg-black text-xs leading-[30px] rounded-md text-white font-normal px-4">
                  Suspend Account
                </button>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="flex justify-end">
          <Button
            className="bg-white text-gray-700 hover:bg-[#9b1c1c] hover:text-white border border-gray-300"
            onClick={() => setOpenManageMerchantDetailsModal(false)}
          >
            Cancel
          </Button>
          <Button className="bg-[#686AF8] hover:bg-black">Save & Update</Button>
        </Modal.Footer>
      </Modal>
      {/* Manage Merchant Details modal ends here */}
    </div>
  );
};

export default MerchantManagement;

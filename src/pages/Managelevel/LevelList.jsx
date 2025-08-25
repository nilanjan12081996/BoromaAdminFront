import { AgGridReact } from "ag-grid-react";
import { Button } from "flowbite-react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import { getLevels } from "../../Reducer/LevelSlice";
import userRoles from "../utils/userRoles";
import { useNavigate } from "react-router-dom";
import AddModal from "./AddModal";

const LevelList = () => {
  const { allLevels } = useSelector((state) => state?.levelsData);
  const [openAddLevelModal, setOpenAddLevelModal] = useState(false);
  const dispatch = useDispatch();
  const currentUserRole = userRoles();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(getLevels());
  }, []);
  console.log("allLevels", allLevels);

  const StatusCellRenderer = (props) => {
    const isActive = props.value === 1;
    const statusText = isActive ? "Active" : "Inactive";
    const statusColor = isActive ? "#52b69a" : "#EF4444"; // Green for active, Red for inactive

    return (
      <div className="flex items-center h-full">
        <span
          className="px-3 py-1 rounded-md text-white text-sm font-medium"
          style={{ backgroundColor: statusColor }}
        >
          {statusText}
        </span>
      </div>
    );
  };

  // Edit Button Cell Renderer Component
  const EditButtonRenderer = (props) => {
    return (
      <div className="flex items-center h-full">
        <button
          onClick={() => handleEdit(props.data.id)}
          className="bg-black hover:bg-blue-600 text-white px-4 py-1 rounded-md text-sm font-medium transition-colors"
        >
          Edit
        </button>
      </div>
    );
  };

  // Column Definitions
  const columnDefs = useMemo(
    () => [
      {
        headerName: "Levels",
        field: "level_name",
        flex: 1,
        minWidth: 200,
        cellClass: "flex items-center",
      },
      {
        headerName: "Description",
        field: "level_description",
        flex: 1,
        minWidth: 200,
        cellClass: "flex items-center",
      },
      {
        headerName: "Status",
        field: "status",
        width: 120,
        cellRenderer: StatusCellRenderer,
        cellClass: "flex items-center",
      },
      {
        headerName: "Actions",
        field: "actions",
        width: 100,
        cellRenderer: EditButtonRenderer,
        sortable: false,
        filter: false,
        cellClass: "flex items-center",
      },
    ],
    []
  );

  // Default Column Definition
  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
    }),
    []
  );

  // Grid Options
  const gridOptions = {
    domLayout: "autoHeight",
    suppressHorizontalScroll: false,
    rowHeight: 60,
  };
  const handleAddLevel = () => {
    setOpenAddLevelModal(true);
  };
  return (
    <>
      <div>
        <ToastContainer />
        <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-white">
          <div className="h-full lg:h-screen">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Level</h2>
              {currentUserRole === "SA" && (
                <>
                  <Button
                    onClick={() => handleAddLevel()}
                    className="bg-[#52b69a] hover:bg-black px-4 py-1 text-white text-base font-semibold flex justify-center items-center rounded-md"
                  >
                    Add Level
                  </Button>
                </>
              )}
            </div>

            <div
              className="ag-theme-alpine"
              style={{ height: 600, width: "100%" }}
            >
              <AgGridReact
                rowData={allLevels?.result || []}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                gridOptions={gridOptions}
                animateRows={true}
                rowSelection="single"
                suppressMenuHide={true}
              />
            </div>
          </div>
        </div>
        {openAddLevelModal && (
          <AddModal
            openAddLevelModal={openAddLevelModal}
            setOpenAddLevelModal={setOpenAddLevelModal}
          />
        )}
      </div>
    </>
  );
};
export default LevelList;

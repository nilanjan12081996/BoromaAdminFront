import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Button, Modal, Spinner, TextInput } from "flowbite-react";
import { toast } from "react-toastify";
import nodeApi from "../../store/nodeApi";
import {
  MdDirectionsCar,
  MdDelete,
  MdAdd,
  MdRefresh,
  MdCheckCircle,
} from "react-icons/md";
import { HiOutlineOfficeBuilding, HiOutlineSearch } from "react-icons/hi";

const CompanyVehicleModal = ({ isOpen, onClose, company, onVehiclesUpdated }) => {
  const [assignedVehicles, setAssignedVehicles] = useState([]);
  const [allVehicles, setAllVehicles] = useState([]);
  const [loadingAssigned, setLoadingAssigned] = useState(false);
  const [loadingAll, setLoadingAll] = useState(false);

  const [addingId, setAddingId] = useState(null);
  const [addingMultiple, setAddingMultiple] = useState(false);
  const [removingId, setRemovingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const [activeTab, setActiveTab] = useState("assigned");
  const [searchAssigned, setSearchAssigned] = useState("");
  const [searchAvailable, setSearchAvailable] = useState("");
  const [selectedVehicleIds, setSelectedVehicleIds] = useState([]);

  // Fetch assigned vehicles for this company
  const fetchAssigned = useCallback(async () => {
    if (!company?.id) return;
    setLoadingAssigned(true);
    try {
      let res;
      try {
        res = await nodeApi.get(`/company-car-map/company/${company.id}/vehicles`);
      } catch (e) {
        res = await nodeApi.get(`/company-car-maps/company/${company.id}/vehicles`);
      }
      const list =
        res?.data?.data ||
        res?.data?.vehicles ||
        res?.data?.result ||
        (Array.isArray(res?.data) ? res.data : []);
      setAssignedVehicles(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Fetch assigned vehicles error:", err);
      setAssignedVehicles([]);
    } finally {
      setLoadingAssigned(false);
    }
  }, [company?.id]);

  // Fetch all vehicles in system
  const fetchAllVehicles = useCallback(async () => {
    setLoadingAll(true);
    try {
      let res;
      try {
        res = await nodeApi.get("/vehicle-info/get");
      } catch (e) {
        try {
          res = await nodeApi.get("/vehicle-info/getAll");
        } catch (e2) {
          res = await nodeApi.get("/vehicle-info/details");
        }
      }
      const list =
        res?.data?.data ||
        res?.data?.vehicles ||
        res?.data?.result ||
        (Array.isArray(res?.data) ? res.data : []);
      setAllVehicles(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Fetch all vehicles error:", err);
      setAllVehicles([]);
    } finally {
      setLoadingAll(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen && company?.id) {
      fetchAssigned();
      fetchAllVehicles();
      setActiveTab("assigned");
      setSelectedVehicleIds([]);
      setSearchAssigned("");
      setSearchAvailable("");
    } else {
      setAssignedVehicles([]);
      setAllVehicles([]);
      setSelectedVehicleIds([]);
    }
  }, [isOpen, company?.id, fetchAssigned, fetchAllVehicles]);

  // Extract IDs of vehicles already assigned to this company
  const assignedVehicleIds = useMemo(() => {
    return assignedVehicles
      .map((v) => Number(v.vehicle_id || v.vehicle?.id || v.vehicleId))
      .filter((id) => !isNaN(id) && id > 0);
  }, [assignedVehicles]);

  // Filter available vehicles (allVehicles not in assignedVehicles)
  const availableVehicles = useMemo(() => {
    return allVehicles.filter((v) => !assignedVehicleIds.includes(Number(v.id)));
  }, [allVehicles, assignedVehicleIds]);

  // Filtered lists based on search terms
  const filteredAssigned = useMemo(() => {
    if (!searchAssigned.trim()) return assignedVehicles;
    const term = searchAssigned.toLowerCase();
    return assignedVehicles.filter((m) => {
      const v = m.vehicle || m;
      const vNo = (v.vehicle_no || m.vehicle_no || "").toLowerCase();
      const cat = (
        v.category?.category_name ||
        v.category_name ||
        ""
      ).toLowerCase();
      return vNo.includes(term) || cat.includes(term);
    });
  }, [assignedVehicles, searchAssigned]);

  const filteredAvailable = useMemo(() => {
    if (!searchAvailable.trim()) return availableVehicles;
    const term = searchAvailable.toLowerCase();
    return availableVehicles.filter((v) => {
      const vNo = (v.vehicle_no || "").toLowerCase();
      const cat = (
        v.category?.category_name ||
        (Array.isArray(v.categories) && v.categories.length > 0
          ? v.categories[0].category_name
          : v.category_name) ||
        ""
      ).toLowerCase();
      return vNo.includes(term) || cat.includes(term);
    });
  }, [availableVehicles, searchAvailable]);

  // Add a single vehicle
  const handleAdd = async (vehicle) => {
    setAddingId(vehicle.id);
    try {
      const payload = {
        company_id: company.id,
        vehicle_id: vehicle.id,
        status: 1,
      };
      let res;
      try {
        res = await nodeApi.post("/company-car-map/create", payload);
      } catch (e) {
        res = await nodeApi.post("/company-car-maps/create", payload);
      }

      if (res?.status === 200 || res?.status === 201 || res?.data?.success) {
        toast.success(`Vehicle "${vehicle.vehicle_no}" added successfully!`);
        setSelectedVehicleIds((prev) => prev.filter((id) => id !== vehicle.id));
        await fetchAssigned();
        if (onVehiclesUpdated) onVehiclesUpdated(company.id);
      } else {
        toast.error(res?.data?.message || "Failed to add vehicle.");
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to add vehicle. Please try again."
      );
    } finally {
      setAddingId(null);
    }
  };

  // Add multiple selected vehicles
  const handleAddSelected = async () => {
    if (selectedVehicleIds.length === 0) return;
    setAddingMultiple(true);
    try {
      const payload = {
        company_id: company.id,
        vehicle_ids: selectedVehicleIds,
        status: 1,
      };
      let res;
      try {
        res = await nodeApi.post("/company-car-map/create", payload);
      } catch (e) {
        res = await nodeApi.post("/company-car-maps/create", payload);
      }

      if (res?.status === 200 || res?.status === 201 || res?.data?.success) {
        toast.success(
          `${selectedVehicleIds.length} vehicle(s) added successfully!`
        );
        setSelectedVehicleIds([]);
        await fetchAssigned();
        if (onVehiclesUpdated) onVehiclesUpdated(company.id);
      } else {
        toast.error(res?.data?.message || "Failed to add vehicles.");
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to add vehicles. Please try again."
      );
    } finally {
      setAddingMultiple(false);
    }
  };

  // Toggle selection of a vehicle
  const handleToggleSelect = (vehicleId) => {
    setSelectedVehicleIds((prev) =>
      prev.includes(vehicleId)
        ? prev.filter((id) => id !== vehicleId)
        : [...prev, vehicleId]
    );
  };

  // Select all or clear all
  const handleSelectAll = () => {
    if (selectedVehicleIds.length === filteredAvailable.length) {
      setSelectedVehicleIds([]);
    } else {
      setSelectedVehicleIds(filteredAvailable.map((v) => v.id));
    }
  };

  // Toggle mapping active/inactive status
  const handleToggleStatus = async (mapping) => {
    setTogglingId(mapping.id);
    try {
      let res;
      try {
        res = await nodeApi.patch(`/company-car-map/${mapping.id}/status`);
      } catch (e) {
        res = await nodeApi.patch(`/company-car-maps/${mapping.id}/status`);
      }

      if (res?.status === 200 || res?.data?.success) {
        const newStatus = res?.data?.data?.status ?? (mapping.status === 1 ? 0 : 1);
        setAssignedVehicles((prev) =>
          prev.map((m) =>
            m.id === mapping.id ? { ...m, status: newStatus } : m
          )
        );
        toast.success(
          `Vehicle status changed to ${newStatus === 1 ? "Active" : "Inactive"}!`
        );
        if (onVehiclesUpdated) onVehiclesUpdated(company.id);
      } else {
        toast.error(res?.data?.message || "Failed to toggle status.");
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to toggle vehicle status."
      );
    } finally {
      setTogglingId(null);
    }
  };

  // Remove vehicle mapping from company
  const handleRemove = async (mapping) => {
    const v = mapping.vehicle || mapping;
    const vNo = v.vehicle_no || mapping.vehicle_no || "this vehicle";
    if (!window.confirm(`Remove vehicle "${vNo}" from this company?`)) return;

    setRemovingId(mapping.id);
    try {
      let res;
      try {
        res = await nodeApi.delete(`/company-car-map/${mapping.id}`);
      } catch (e) {
        res = await nodeApi.delete(`/company-car-maps/${mapping.id}`);
      }

      if (res?.status === 200 || res?.data?.success) {
        toast.success(`Vehicle "${vNo}" removed.`);
        setAssignedVehicles((prev) => prev.filter((m) => m.id !== mapping.id));
        if (onVehiclesUpdated) onVehiclesUpdated(company.id);
      } else {
        toast.error(res?.data?.message || "Failed to remove vehicle.");
      }
    } catch (err) {
      toast.error("Failed to remove vehicle.");
    } finally {
      setRemovingId(null);
    }
  };

  const PlateRenderer = ({ vehicleNo }) => (
    <div className="inline-flex items-stretch border-2 border-gray-800 bg-white rounded shadow-2xs overflow-hidden select-none font-mono shrink-0">
      <div className="bg-[#003893] text-white px-1.5 py-0.5 flex flex-col items-center justify-center">
        <span className="text-[5px] font-black text-amber-300 leading-none">●</span>
        <span className="text-[6px] font-black tracking-tighter leading-none mt-0.5">
          IND
        </span>
      </div>
      <div className="px-2 py-0.5 bg-gradient-to-b from-white via-gray-50 to-gray-100 flex items-center">
        <span className="font-black text-gray-900 text-xs tracking-wider uppercase">
          {vehicleNo || "—"}
        </span>
      </div>
    </div>
  );

  const isLoading = loadingAssigned || loadingAll;

  return (
    <Modal show={isOpen} size="xl" onClose={onClose}>
      <Modal.Header className="border-b border-gray-100 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-[#536EFF] shrink-0 border border-indigo-100">
            <MdDirectionsCar className="text-2xl" />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-800 leading-tight">
              Manage Vehicles
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <HiOutlineOfficeBuilding className="text-gray-400 text-sm" />
              <span className="text-xs text-gray-600 font-semibold capitalize">
                {company?.company_name || "—"}
              </span>
            </div>
          </div>
        </div>
      </Modal.Header>

      <Modal.Body className="p-0">
        {/* Tab Switcher */}
        <div className="flex border-b border-gray-100 bg-gray-50/50">
          <button
            type="button"
            onClick={() => setActiveTab("assigned")}
            className={`flex-1 py-3 text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "assigned"
                ? "text-[#536EFF] border-b-2 border-[#536EFF] bg-indigo-50/40"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100/50"
            }`}
          >
            Assigned Vehicles
            <span
              className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-bold ${
                activeTab === "assigned"
                  ? "bg-[#536EFF] text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {assignedVehicles.length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("add")}
            className={`flex-1 py-3 text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "add"
                ? "text-[#16a34a] border-b-2 border-[#16a34a] bg-green-50/40"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100/50"
            }`}
          >
            Add Vehicle
            <span
              className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-bold ${
                activeTab === "add"
                  ? "bg-[#16a34a] text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {availableVehicles.length}
            </span>
          </button>
        </div>

        {/* Tab Controls Bar */}
        <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100 flex items-center justify-between gap-3">
          <div className="flex-1 max-w-xs">
            <TextInput
              type="text"
              icon={HiOutlineSearch}
              sizing="sm"
              placeholder={
                activeTab === "assigned"
                  ? "Search assigned vehicles..."
                  : "Search available vehicles..."
              }
              value={activeTab === "assigned" ? searchAssigned : searchAvailable}
              onChange={(e) =>
                activeTab === "assigned"
                  ? setSearchAssigned(e.target.value)
                  : setSearchAvailable(e.target.value)
              }
            />
          </div>

          <div className="flex items-center gap-2">
            {activeTab === "add" && availableVehicles.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="px-2.5 py-1 text-xs font-semibold rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition cursor-pointer"
                >
                  {selectedVehicleIds.length === filteredAvailable.length &&
                  filteredAvailable.length > 0
                    ? "Deselect All"
                    : "Select All"}
                </button>
                {selectedVehicleIds.length > 0 && (
                  <button
                    type="button"
                    onClick={handleAddSelected}
                    disabled={addingMultiple}
                    className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded bg-[#16a34a] text-white hover:bg-[#15803d] disabled:opacity-50 transition cursor-pointer shadow-xs"
                  >
                    {addingMultiple ? (
                      <Spinner size="xs" color="white" />
                    ) : (
                      <MdCheckCircle className="text-sm" />
                    )}
                    Add Selected ({selectedVehicleIds.length})
                  </button>
                )}
              </>
            )}

            <button
              type="button"
              onClick={() => {
                fetchAssigned();
                fetchAllVehicles();
              }}
              title="Refresh vehicle list"
              className="p-1.5 rounded text-gray-500 hover:text-gray-800 hover:bg-gray-200 transition cursor-pointer"
            >
              <MdRefresh className="text-lg" />
            </button>
          </div>
        </div>

        {/* Tab Content Body */}
        <div className="min-h-[320px] max-h-[420px] overflow-y-auto px-4 py-3">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Spinner size="lg" color="purple" />
              <p className="text-sm text-gray-500 font-medium">
                Loading vehicles...
              </p>
            </div>
          ) : activeTab === "assigned" ? (
            /* TAB 1: Assigned Vehicles List */
            filteredAssigned.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-300 mb-3">
                  <MdDirectionsCar className="text-3xl" />
                </div>
                <p className="text-sm font-semibold text-gray-700">
                  {searchAssigned
                    ? "No matching assigned vehicles"
                    : "No vehicles assigned to this company"}
                </p>
                <p className="text-xs text-gray-400 mt-1 max-w-xs">
                  {searchAssigned
                    ? "Try clearing the search query."
                    : "Switch to the 'Add Vehicle' tab to assign vehicles to this company."}
                </p>
                {!searchAssigned && availableVehicles.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveTab("add")}
                    className="mt-3.5 px-3.5 py-1.5 text-xs font-semibold rounded bg-[#16a34a] text-white hover:bg-[#15803d] transition cursor-pointer"
                  >
                    + Add Available Vehicles
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredAssigned.map((mapping) => {
                  const v = mapping.vehicle || mapping;
                  const vNo = v.vehicle_no || mapping.vehicle_no || "—";
                  const catName =
                    v.category?.category_name ||
                    (Array.isArray(v.categories) && v.categories.length > 0
                      ? v.categories[0].category_name
                      : v.category_name) ||
                    "—";
                  const seats = v.no_of_seat ?? v.no_of_seats ?? "—";
                  const isActive = mapping.status === 1 || mapping.status === "1";

                  return (
                    <div
                      key={mapping.id}
                      className="flex items-center justify-between gap-3 p-3 rounded-lg border border-gray-200 bg-white hover:border-indigo-200 hover:bg-indigo-50/20 transition-all shadow-2xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <PlateRenderer vehicleNo={vNo} />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-gray-800 capitalize truncate">
                            {catName}
                          </p>
                          <p className="text-[11px] text-gray-400">
                            {seats !== "—" ? `${seats} Seats` : "Seat info: N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {/* Status Toggle Switch / Button */}
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(mapping)}
                          disabled={togglingId === mapping.id}
                          title="Click to toggle status (Active/Inactive)"
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border cursor-pointer transition ${
                            isActive
                              ? "bg-green-50 border-green-300 text-green-700 hover:bg-green-100"
                              : "bg-gray-100 border-gray-300 text-gray-500 hover:bg-gray-200"
                          } disabled:opacity-50`}
                        >
                          {togglingId === mapping.id ? (
                            <Spinner size="xs" color="gray" />
                          ) : (
                            <span
                              className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                isActive ? "bg-green-500" : "bg-gray-400"
                              }`}
                            />
                          )}
                          {isActive ? "Active" : "Inactive"}
                        </button>

                        {/* Remove Vehicle Button */}
                        <button
                          type="button"
                          onClick={() => handleRemove(mapping)}
                          disabled={removingId === mapping.id}
                          title="Remove vehicle from company"
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md border border-red-200 text-red-600 bg-white hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors cursor-pointer disabled:opacity-50 shadow-2xs"
                        >
                          {removingId === mapping.id ? (
                            <Spinner size="xs" color="failure" />
                          ) : (
                            <MdDelete className="text-sm" />
                          )}
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            /* TAB 2: Available Vehicles to Add */
            filteredAvailable.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-300 mb-3">
                  <MdDirectionsCar className="text-3xl" />
                </div>
                <p className="text-sm font-semibold text-gray-700">
                  {searchAvailable
                    ? "No vehicles matching search"
                    : availableVehicles.length === 0 && allVehicles.length > 0
                    ? "All fleet vehicles are already assigned"
                    : "No fleet vehicles available"}
                </p>
                <p className="text-xs text-gray-400 mt-1 max-w-xs">
                  {searchAvailable
                    ? "Try adjusting your search criteria."
                    : availableVehicles.length === 0 && allVehicles.length > 0
                    ? "All registered vehicles have been assigned to this company."
                    : "Add vehicles in the Transport section first."}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredAvailable.map((v) => {
                  const catName =
                    v.category?.category_name ||
                    (Array.isArray(v.categories) && v.categories.length > 0
                      ? v.categories[0].category_name
                      : v.category_name) ||
                    "—";
                  const seats = v.no_of_seat ?? v.no_of_seats ?? "—";
                  const isSelected = selectedVehicleIds.includes(v.id);

                  return (
                    <div
                      key={v.id}
                      className={`flex items-center justify-between gap-3 p-3 rounded-lg border transition-all shadow-2xs ${
                        isSelected
                          ? "border-green-300 bg-green-50/30"
                          : "border-gray-200 bg-white hover:border-green-200 hover:bg-green-50/15"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(v.id)}
                          className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500 cursor-pointer"
                        />
                        <PlateRenderer vehicleNo={v.vehicle_no} />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-gray-800 capitalize truncate">
                            {catName}
                          </p>
                          <p className="text-[11px] text-gray-400">
                            {seats !== "—" ? `${seats} Seats` : "Seat info: N/A"}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAdd(v)}
                        disabled={addingId === v.id || addingMultiple}
                        className="shrink-0 inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-md border border-green-400 text-[#16a34a] bg-white hover:bg-[#16a34a] hover:text-white hover:border-[#16a34a] transition-colors cursor-pointer disabled:opacity-50 shadow-2xs"
                      >
                        {addingId === v.id ? (
                          <Spinner size="xs" color="success" />
                        ) : (
                          <MdAdd className="text-base" />
                        )}
                        Add
                      </button>
                    </div>
                  );
                })}
              </div>
            )
          )}
        </div>
      </Modal.Body>

      <Modal.Footer className="border-t border-gray-100 flex justify-between items-center py-3 px-4 bg-gray-50/40">
        <span className="text-xs text-gray-600 font-medium">
          Assigned to Company:{" "}
          <strong className="text-gray-900 font-bold">
            {assignedVehicles.length}
          </strong>
        </span>
        <Button
          color="gray"
          type="button"
          onClick={onClose}
          className="border border-gray-300 font-medium text-xs px-3 py-1 cursor-pointer"
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CompanyVehicleModal;
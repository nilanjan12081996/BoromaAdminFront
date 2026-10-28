import React, { useEffect, useMemo, useState } from "react";
import { Button, Label, Modal, Select, TextInput } from "flowbite-react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { updateVehicleInfo, getAllVehicleInfo } from "../../Reducer/VehicleInfoSlice";
import { getCategory } from "../../Reducer/CategorySlice";
import { toast } from "react-toastify";
import { FiEdit2 } from "react-icons/fi";
import { validateVehicleNumber } from "../../utils/vehicleValidation";

const EditVehicleModal = ({ isOpen, onClose, vehicle, onVehicleUpdated }) => {
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useDispatch();

  const { categoryList } = useSelector((state) => state?.category || {});

  // Fetch categories when modal opens
  useEffect(() => {
    if (isOpen) {
      dispatch(getCategory());
    }
  }, [isOpen, dispatch]);

  const categories = useMemo(() => {
    const list =
      categoryList?.data ||
      categoryList?.categories ||
      categoryList?.res ||
      categoryList?.result ||
      (Array.isArray(categoryList) ? categoryList : []);
    return Array.isArray(list) ? list : [];
  }, [categoryList]);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      category_id: "",
      vehicle_no: "",
      no_of_seat: "",
      status: "1",
    },
  });

  useEffect(() => {
    if (vehicle) {
      const initialCatId =
        vehicle.category_id ||
        (Array.isArray(vehicle.categories) && vehicle.categories.length > 0
          ? vehicle.categories[0].id
          : vehicle.raw?.category_id ||
            vehicle.raw?.categories?.[0]?.id ||
            "");

      setValue("category_id", initialCatId ? String(initialCatId) : "");
      setValue("vehicle_no", vehicle.vehicle_no || "");
      setValue(
        "no_of_seat",
        vehicle.no_of_seat !== undefined && vehicle.no_of_seat !== null
          ? String(vehicle.no_of_seat)
          : vehicle.no_of_seats !== undefined && vehicle.no_of_seats !== null
          ? String(vehicle.no_of_seats)
          : ""
      );
      setValue(
        "status",
        vehicle.status === 1 || vehicle.status === true || vehicle.status === "1"
          ? "1"
          : "0"
      );
    }
  }, [vehicle, setValue]);

  const onSubmit = async (data) => {
    if (!vehicle?.id) return;
    setSubmitting(true);
    const selectedCategory = categories.find(
      (c) => String(c.id) === String(data.category_id)
    );

    const payload = {
      id: vehicle.id,
      category_id: data.category_id ? parseInt(data.category_id, 10) : null,
      category_name: selectedCategory ? selectedCategory.category_name : vehicle.category_name || "NA",
      vehicle_no: data.vehicle_no.trim().toUpperCase(),
      no_of_seat: data.no_of_seat ? parseInt(data.no_of_seat, 10) : null,
      status: parseInt(data.status, 10),
    };

    try {
      const res = await dispatch(updateVehicleInfo(payload));
      if (
        res?.meta?.requestStatus === "fulfilled" ||
        res?.payload?.success ||
        res?.payload?.status_code === 200
      ) {
        toast.success("Vehicle updated successfully!");
        if (onVehicleUpdated) onVehicleUpdated(payload);
        onClose();
        dispatch(getAllVehicleInfo());
      } else {
        const errMsg =
          res?.payload?.message ||
          res?.payload?.error ||
          "Failed to update vehicle details.";
        toast.error(errMsg);
      }
    } catch (err) {
      console.error("Update vehicle error:", err);
      toast.error("An error occurred while updating the vehicle.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal show={isOpen} size="lg" onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Header className="border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#536EFF]">
              <FiEdit2 className="text-lg" />
            </div>
            <span className="text-lg font-bold text-gray-800">
              Edit Vehicle Info
            </span>
          </div>
        </Modal.Header>

        <Modal.Body className="max-h-[75vh] overflow-y-auto">
          <div className="space-y-4 py-2">
            {/* 1. Category */}
            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="edit_category_id"
                  value="Category Name"
                  className="font-medium text-gray-700"
                />
                <span className="text-red-500 ml-1">*</span>
              </div>
              <Select
                id="edit_category_id"
                {...register("category_id", {
                  required: "Category is required",
                })}
                color={errors.category_id ? "failure" : undefined}
                helperText={errors.category_id?.message}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.category_name} {cat.short_name ? `(${cat.short_name})` : ""}
                  </option>
                ))}
              </Select>
            </div>

            {/* 2. Vehicle Number */}
            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="edit_vehicle_no"
                  value="Vehicle Number"
                  className="font-medium text-gray-700"
                />
                <span className="text-red-500 ml-1">*</span>
              </div>
              <TextInput
                id="edit_vehicle_no"
                type="text"
                placeholder="e.g. WB-01-AB-1234"
                className="uppercase"
                {...register("vehicle_no", {
                  required: "Vehicle Number is required",
                  validate: validateVehicleNumber,
                })}
                color={errors.vehicle_no ? "failure" : undefined}
                helperText={errors.vehicle_no?.message}
              />
            </div>

            {/* 3. Number of Seats */}
            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="edit_no_of_seat"
                  value="Number of Seats"
                  className="font-medium text-gray-700"
                />
                <span className="text-red-500 ml-1">*</span>
              </div>
              <TextInput
                id="edit_no_of_seat"
                type="number"
                min="1"
                placeholder="e.g. 40"
                {...register("no_of_seat", {
                  required: "Number of Seats is required",
                  min: { value: 1, message: "Seats must be at least 1" },
                })}
                color={errors.no_of_seat ? "failure" : undefined}
                helperText={errors.no_of_seat?.message}
              />
            </div>

            {/* 4. Status */}
            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="edit_status"
                  value="Status"
                  className="font-medium text-gray-700"
                />
                <span className="text-red-500 ml-1">*</span>
              </div>
              <Select
                id="edit_status"
                {...register("status", {
                  required: "Status is required",
                })}
                color={errors.status ? "failure" : undefined}
                helperText={errors.status?.message}
              >
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </Select>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer className="flex justify-end gap-3 border-t border-gray-100">
          <Button
            color="gray"
            type="button"
            onClick={handleClose}
            disabled={submitting}
            className="border border-gray-300 font-medium"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={submitting}
            className="bg-[#536EFF] hover:bg-[#3f57df] text-white font-medium focus:ring-4 focus:ring-blue-200"
          >
            {submitting ? "Updating..." : "Update Vehicle"}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default EditVehicleModal;

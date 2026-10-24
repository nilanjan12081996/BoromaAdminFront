import React, { useState } from "react";
import { Button, Label, Modal, Select, TextInput } from "flowbite-react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { createVehicleInfo, getAllVehicleInfo } from "../../Reducer/VehicleInfoSlice";
import { toast } from "react-toastify";
import { CgAdd } from "react-icons/cg";

const AddVehicleModal = ({ isOpen, onClose, onVehicleAdded }) => {
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      vehicle_no: "",
      no_of_seat: "",
      status: "1",
    },
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    const payload = {
      vehicle_no: data.vehicle_no.trim().toUpperCase(),
      no_of_seat: data.no_of_seat ? parseInt(data.no_of_seat, 10) : null,
      status: parseInt(data.status, 10),
    };

    try {
      const res = await dispatch(createVehicleInfo(payload));
      if (
        res?.meta?.requestStatus === "fulfilled" ||
        res?.payload?.success ||
        res?.payload?.status_code === 200 ||
        res?.payload?.status_code === 201
      ) {
        toast.success("Vehicle added successfully!");
        if (onVehicleAdded) onVehicleAdded(payload);
        reset();
        onClose();
        dispatch(getAllVehicleInfo());
      } else {
        const errMsg =
          res?.payload?.message ||
          res?.payload?.error ||
          "Failed to add vehicle. Please check vehicle number uniqueness.";
        toast.error(errMsg);
      }
    } catch (err) {
      console.error("Add vehicle error:", err);
      toast.error("An error occurred while saving the vehicle.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal show={isOpen} size="md" onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Header className="border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-[#bf0300]">
              <CgAdd className="text-xl" />
            </div>
            <span className="text-lg font-bold text-gray-800">
              Add New Vehicle
            </span>
          </div>
        </Modal.Header>

        <Modal.Body>
          <div className="space-y-4 py-2">
            {/* 1. Vehicle Number */}
            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="vehicle_no"
                  value="Vehicle Number"
                  className="font-medium text-gray-700"
                />
                <span className="text-red-500 ml-1">*</span>
              </div>
              <TextInput
                id="vehicle_no"
                type="text"
                placeholder="e.g. WB-01-AB-1234"
                {...register("vehicle_no", {
                  required: "Vehicle Number is required",
                })}
                color={errors.vehicle_no ? "failure" : undefined}
                helperText={errors.vehicle_no?.message}
              />
            </div>

            {/* 2. Number of Seats */}
            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="no_of_seat"
                  value="Number of Seats"
                  className="font-medium text-gray-700"
                />
                <span className="text-red-500 ml-1">*</span>
              </div>
              <TextInput
                id="no_of_seat"
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

            {/* 3. Status */}
            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="status"
                  value="Status"
                  className="font-medium text-gray-700"
                />
                <span className="text-red-500 ml-1">*</span>
              </div>
              <Select
                id="status"
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
            className="bg-[#bf0300] hover:bg-[#a01618] text-white font-medium focus:ring-4 focus:ring-red-200"
          >
            {submitting ? "Adding..." : "Add Vehicle"}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default AddVehicleModal;

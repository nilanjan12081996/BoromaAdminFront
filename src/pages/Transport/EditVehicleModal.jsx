import React, { useEffect, useMemo, useState, useRef } from "react";
import { Button, Label, Modal, Select, TextInput } from "flowbite-react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { updateVehicleInfo, getAllVehicleInfo } from "../../Reducer/VehicleInfoSlice";
import { getCategory } from "../../Reducer/CategorySlice";
import nodeApi from "../../store/nodeApi";
import { toast } from "react-toastify";
import { FiEdit2 } from "react-icons/fi";
import { MdCloudUpload, MdClose } from "react-icons/md";
import { validateVehicleNumber } from "../../utils/vehicleValidation";

const EditVehicleModal = ({ isOpen, onClose, vehicle, onVehicleUpdated }) => {
  const [submitting, setSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const fileInputRef = useRef(null);
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

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const combined = [...selectedFiles, ...files].slice(0, 20);
    setSelectedFiles(combined);

    const previews = combined.map((file) => ({
      name: file.name,
      size: (file.size / 1024).toFixed(1) + " KB",
      url: URL.createObjectURL(file),
      file,
    }));
    setFilePreviews(previews);
  };

  const removeFile = (indexToRemove) => {
    if (filePreviews[indexToRemove]?.url) {
      URL.revokeObjectURL(filePreviews[indexToRemove].url);
    }
    const updatedFiles = selectedFiles.filter((_, idx) => idx !== indexToRemove);
    const updatedPreviews = filePreviews.filter((_, idx) => idx !== indexToRemove);
    setSelectedFiles(updatedFiles);
    setFilePreviews(updatedPreviews);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const cleanupPreviews = () => {
    filePreviews.forEach((p) => p.url && URL.revokeObjectURL(p.url));
    setSelectedFiles([]);
    setFilePreviews([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

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
      cleanupPreviews();
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
        // Upload additional images if selected
        if (selectedFiles.length > 0) {
          try {
            const formData = new FormData();
            formData.append("vehicle_id", vehicle.id);
            selectedFiles.forEach((file) => {
              formData.append("images", file);
            });
            await nodeApi.post("/vehicle-image/save", formData);
          } catch (imgErr) {
            console.error("Failed to upload vehicle images:", imgErr);
            toast.warn("Vehicle updated, but some images could not be uploaded.");
          }
        }

        toast.success("Vehicle updated successfully!");
        cleanupPreviews();
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
    cleanupPreviews();
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

            {/* 5. Additional Vehicle Images (Optional) */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <Label
                  htmlFor="edit_vehicle_images_input"
                  value="Upload Additional Images"
                  className="font-medium text-gray-700"
                />
                <span className="text-xs font-medium text-gray-400">
                  Optional (Multiple allowed)
                </span>
              </div>

              <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:border-blue-400 bg-gray-50/50 hover:bg-blue-50/20 transition-colors">
                <input
                  ref={fileInputRef}
                  id="edit_vehicle_images_input"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="edit_vehicle_images_input"
                  className="cursor-pointer flex flex-col items-center justify-center gap-1.5"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#536EFF]">
                    <MdCloudUpload className="text-2xl" />
                  </div>
                  <span className="text-xs font-semibold text-gray-700">
                    Click to browse additional images for this vehicle
                  </span>
                  <span className="text-[11px] text-gray-400">
                    Supports JPG, PNG, WEBP
                  </span>
                </label>
              </div>

              {/* Previews */}
              {filePreviews.length > 0 && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-600">
                      Selected New Images ({filePreviews.length})
                    </span>
                    <button
                      type="button"
                      onClick={cleanupPreviews}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-2.5 max-h-44 overflow-y-auto p-1 bg-gray-50 rounded-lg border border-gray-100">
                    {filePreviews.map((preview, idx) => (
                      <div
                        key={idx}
                        className="relative group rounded-md overflow-hidden border border-gray-200 aspect-square bg-white shadow-2xs"
                      >
                        <img
                          src={preview.url}
                          alt={preview.name}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeFile(idx)}
                          className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full text-xs shadow-md cursor-pointer transition-transform hover:scale-110"
                          title="Remove image"
                        >
                          <MdClose className="text-xs" />
                        </button>
                        <span className="absolute bottom-0 inset-x-0 bg-black/70 text-white text-[9px] px-1 py-0.5 truncate text-center">
                          {preview.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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

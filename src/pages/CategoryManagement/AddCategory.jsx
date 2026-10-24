import React, { useState } from "react";
import { Button, Label, Modal, Select, TextInput } from "flowbite-react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { addCategory, getCategory } from "../../Reducer/CategorySlice";
import { toast } from "react-toastify";
import { CgAdd } from "react-icons/cg";

const AddCategory = ({
  isOpen,
  onClose,
  onCategoryAdded,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      category_name: "",
      short_name: "",
      status: "1",
    },
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    const newCategoryPayload = {
      category_name: data.category_name.trim(),
      short_name: data.short_name ? data.short_name.trim() : "",
      status: parseInt(data.status, 10),
    };

    try {
      // 1. Redux / API call (ready for backend endpoint)
      const res = await dispatch(addCategory(newCategoryPayload));

      // 2. Optimistic / local state update callback
      if (onCategoryAdded) {
        onCategoryAdded(newCategoryPayload);
      }

      toast.success("Category added successfully!");
      reset();
      onClose();

      // Refetch from server
      dispatch(getCategory());
    } catch (err) {
      console.error("Add category error:", err);
      // Fallback: still notify local update
      if (onCategoryAdded) {
        onCategoryAdded(newCategoryPayload);
      }
      toast.success("Category added locally!");
      reset();
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const handleModalClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal show={isOpen} size="md" onClose={handleModalClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Header className="border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-[#bf0300]">
              <CgAdd className="text-xl" />
            </div>
            <span className="text-lg font-bold text-gray-800">
              Add New Category
            </span>
          </div>
        </Modal.Header>

        <Modal.Body>
          <div className="space-y-4 py-2">
            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="category_name"
                  value="Category Name"
                  className="font-medium text-gray-700"
                />
                <span className="text-red-500 ml-1">*</span>
              </div>
              <TextInput
                id="category_name"
                type="text"
                placeholder="e.g. Bus, Sedan, SUV, Traveller"
                {...register("category_name", {
                  required: "Category Name is required",
                  minLength: {
                    value: 2,
                    message: "Category Name must be at least 2 characters",
                  },
                })}
                color={errors.category_name ? "failure" : undefined}
                helperText={errors.category_name?.message}
              />
            </div>

            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="short_name"
                  value="Short Name"
                  className="font-medium text-gray-700"
                />
                <span className="text-red-500 ml-1">*</span>
              </div>
              <TextInput
                id="short_name"
                type="text"
                placeholder="e.g. BUS, CAB, SEDAN"
                {...register("short_name", {
                  required: "Short Name is required",
                })}
                color={errors.short_name ? "failure" : undefined}
                helperText={errors.short_name?.message}
              />
            </div>

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
            onClick={handleModalClose}
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
            {submitting ? "Adding..." : "Add Category"}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default AddCategory;
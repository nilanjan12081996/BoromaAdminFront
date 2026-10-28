import React, { useState } from "react";
import { Button, Label, Modal, Select, TextInput } from "flowbite-react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { createCompany, getAllCompany } from "../../Reducer/CompanySlice";
import { toast } from "react-toastify";
import { CgAdd } from "react-icons/cg";
import { HiOutlineOfficeBuilding, HiOutlineMail } from "react-icons/hi";

const AddCompanyModal = ({ isOpen, onClose, onCompanyAdded }) => {
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      company_name: "",
      company_email: "",
      status: "1",
    },
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    const payload = {
      company_name: data.company_name.trim(),
      company_email: data.company_email.trim().toLowerCase(),
      status: parseInt(data.status, 10),
    };

    try {
      const res = await dispatch(createCompany(payload));

      if (
        res?.meta?.requestStatus === "fulfilled" ||
        res?.payload?.success ||
        res?.payload?.status === 201
      ) {
        toast.success(
          `Company "${payload.company_name}" created successfully!`
        );
        const createdData = res?.payload?.data || payload;
        if (onCompanyAdded) {
          onCompanyAdded(createdData);
        }
        reset();
        onClose();
        dispatch(getAllCompany({ force: true }));
      } else {
        const errorMsg =
          res?.payload?.message ||
          res?.payload?.error ||
          "Failed to create company. Please check input values.";
        toast.error(errorMsg);
      }
    } catch (err) {
      console.error("Create company error:", err);
      toast.error("Failed to create company. Please try again.");
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
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center text-[#bf0300]">
              <CgAdd className="text-xl" />
            </div>
            <div>
              <span className="text-lg font-bold text-gray-800">
                Add New Company
              </span>
              <p className="text-xs text-gray-400 font-normal">
                Enter company registration details
              </p>
            </div>
          </div>
        </Modal.Header>

        <Modal.Body>
          <div className="space-y-4 py-2">
            {/* Company Name */}
            <div>
              <div className="mb-1.5 block">
                <Label
                  htmlFor="company_name"
                  value="Company Name"
                  className="font-medium text-gray-700"
                />
                <span className="text-red-500 ml-1">*</span>
              </div>
              <div className="relative">
                <TextInput
                  id="company_name"
                  type="text"
                  icon={HiOutlineOfficeBuilding}
                  placeholder="e.g. Boroma Transport Logistics Ltd."
                  {...register("company_name", {
                    required: "Company name is required",
                    minLength: {
                      value: 3,
                      message: "Company name must be at least 3 characters",
                    },
                  })}
                  color={errors.company_name ? "failure" : "gray"}
                />
              </div>
              {errors.company_name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.company_name.message}
                </p>
              )}
            </div>

            {/* Company Email */}
            <div>
              <div className="mb-1.5 block">
                <Label
                  htmlFor="company_email"
                  value="Company Email"
                  className="font-medium text-gray-700"
                />
                <span className="text-red-500 ml-1">*</span>
              </div>
              <div className="relative">
                <TextInput
                  id="company_email"
                  type="email"
                  icon={HiOutlineMail}
                  placeholder="e.g. contact@boromatransport.com"
                  {...register("company_email", {
                    required: "Company email is required",
                    pattern: {
                      value:
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Please enter a valid email address",
                    },
                  })}
                  color={errors.company_email ? "failure" : "gray"}
                />
              </div>
              {errors.company_email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.company_email.message}
                </p>
              )}
            </div>

            {/* Status */}
            <div>
              <div className="mb-1.5 block">
                <Label
                  htmlFor="status"
                  value="Initial Status"
                  className="font-medium text-gray-700"
                />
              </div>
              <Select id="status" {...register("status")}>
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </Select>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer className="border-t border-gray-100 flex justify-end gap-2">
          <Button
            type="button"
            color="gray"
            onClick={handleModalClose}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={submitting}
            className="bg-[#bf0300] hover:bg-[#a01618] text-white flex items-center justify-center transition-colors duration-200"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Saving...
              </span>
            ) : (
              "Save Company"
            )}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default AddCompanyModal;

import React, { useEffect, useState } from "react";
import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { updateCompany, getAllCompany } from "../../Reducer/CompanySlice";
import { toast } from "react-toastify";
import { BiSolidMessageSquareEdit } from "react-icons/bi";
import { HiOutlineOfficeBuilding, HiOutlineMail } from "react-icons/hi";
import { AiOutlineExclamationCircle } from "react-icons/ai";

const EditCompanyModal = ({ isOpen, onClose, company, onCompanyUpdated }) => {
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
    },
  });

  useEffect(() => {
    if (company) {
      reset({
        company_name: company.company_name || "",
        company_email: company.company_email || "",
      });
    }
  }, [company, reset]);

  const onSubmit = async (data) => {
    if (!company?.id) return;
    setSubmitting(true);

    const payload = {
      id: company.id,
      company_name: data.company_name.trim(),
      company_email: data.company_email.trim().toLowerCase(),
    };

    try {
      const res = await dispatch(updateCompany(payload));

      if (
        res?.meta?.requestStatus === "fulfilled" ||
        res?.payload?.success ||
        res?.payload?.status === 200
      ) {
        toast.success(
          `Company "${payload.company_name}" updated successfully!`
        );
        const updatedData = res?.payload?.data || {
          ...company,
          ...payload,
        };
        if (onCompanyUpdated) {
          onCompanyUpdated(updatedData);
        }
        onClose();
        dispatch(getAllCompany({ force: true }));
      } else {
        const errorMsg =
          res?.payload?.message ||
          res?.payload?.error ||
          "Failed to update company. Please check inputs.";
        toast.error(errorMsg);
      }
    } catch (err) {
      console.error("Update company error:", err);
      toast.error("Failed to update company. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const isInactive = company && (company.status === 0 || company.status === false);

  return (
    <Modal show={isOpen} size="md" onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Header className="border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-[#536EFF]">
              <BiSolidMessageSquareEdit className="text-xl" />
            </div>
            <div>
              <span className="text-lg font-bold text-gray-800">
                Edit Company
              </span>
              <p className="text-xs text-gray-400 font-normal">
                Update details for ID #{company?.id}
              </p>
            </div>
          </div>
        </Modal.Header>

        <Modal.Body>
          <div className="space-y-4 py-2">
            {isInactive && (
              <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs">
                <AiOutlineExclamationCircle className="text-base shrink-0 mt-0.5 text-amber-600" />
                <span>
                  <strong>Notice:</strong> This company is currently <em>Inactive</em>.
                  Backend requires the company to be Active to apply updates. Please toggle status to Active if update fails.
                </span>
              </div>
            )}

            {/* Company Name */}
            <div>
              <div className="mb-1.5 block">
                <Label
                  htmlFor="edit_company_name"
                  value="Company Name"
                  className="font-medium text-gray-700"
                />
                <span className="text-red-500 ml-1">*</span>
              </div>
              <div className="relative">
                <TextInput
                  id="edit_company_name"
                  type="text"
                  icon={HiOutlineOfficeBuilding}
                  placeholder="Company name"
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
                  htmlFor="edit_company_email"
                  value="Company Email"
                  className="font-medium text-gray-700"
                />
                <span className="text-red-500 ml-1">*</span>
              </div>
              <div className="relative">
                <TextInput
                  id="edit_company_email"
                  type="email"
                  icon={HiOutlineMail}
                  placeholder="contact@company.com"
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
          </div>
        </Modal.Body>

        <Modal.Footer className="border-t border-gray-100 flex justify-end gap-2">
          <Button
            type="button"
            color="gray"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={submitting}
            className="bg-[#536EFF] hover:bg-[#3d56e0] text-white flex items-center justify-center transition-colors duration-200"
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
                Updating...
              </span>
            ) : (
              "Update Company"
            )}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default EditCompanyModal;

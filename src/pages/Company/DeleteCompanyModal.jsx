import React from "react";
import { Button, Modal } from "flowbite-react";
import { MdDelete } from "react-icons/md";
import { HiOutlineExclamationCircle, HiOutlineOfficeBuilding } from "react-icons/hi";

const DeleteCompanyModal = ({
  isOpen,
  onClose,
  company,
  onConfirm,
  loading = false,
}) => {
  if (!company) return null;

  const isInactive = company && (company.status === 0 || company.status === false);

  return (
    <Modal show={isOpen} size="md" onClose={onClose} popup>
      <Modal.Header />
      <Modal.Body>
        <div className="text-center px-2 pb-2">
          {/* Danger Icon */}
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-[#bf0300]">
            <MdDelete className="h-8 w-8" />
          </div>

          <h3 className="mb-2 text-lg font-bold text-gray-800">
            Delete Company
          </h3>

          <p className="mb-4 text-sm text-gray-500">
            Are you sure you want to permanently delete this company?
            This action cannot be undone.
          </p>

          {/* Company details card */}
          <div className="mb-5 rounded-lg border border-gray-200 bg-gray-50 p-3.5 text-left text-sm">
            <div className="flex items-center gap-2 mb-1.5">
              <HiOutlineOfficeBuilding className="text-gray-500 text-base" />
              <span className="font-semibold text-gray-800 text-sm">
                {company.company_name}
              </span>
            </div>
            <div className="text-xs text-gray-500 pl-6 flex flex-col gap-0.5">
              <span>
                <strong>Email:</strong> {company.company_email}
              </span>
              <span>
                <strong>ID:</strong> #{company.id}
              </span>
              <span>
                <strong>Status:</strong>{" "}
                <span
                  className={
                    company.status === 1 || company.status === true
                      ? "text-green-600 font-semibold"
                      : "text-amber-600 font-semibold"
                  }
                >
                  {company.status === 1 || company.status === true
                    ? "Active"
                    : "Inactive"}
                </span>
              </span>
            </div>
          </div>

          {isInactive && (
            <div className="mb-4 flex items-start gap-2 p-2.5 bg-amber-50 border border-amber-200 rounded-md text-amber-800 text-xs text-left">
              <HiOutlineExclamationCircle className="text-base shrink-0 mt-0.5 text-amber-600" />
              <span>
                Backend policy: Company must be Active to be deleted. If deletion fails, please toggle status to Active first.
              </span>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-center gap-3">
            <Button
              color="gray"
              onClick={onClose}
              disabled={loading}
              className="px-4"
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              disabled={loading}
              className="bg-[#bf0300] hover:bg-[#a01618] text-white flex items-center justify-center transition-colors duration-200 px-4"
            >
              {loading ? (
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
                  Deleting...
                </span>
              ) : (
                "Yes, Delete"
              )}
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default DeleteCompanyModal;

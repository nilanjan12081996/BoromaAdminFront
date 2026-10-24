import React from "react";
import { Button, Modal } from "flowbite-react";
import { MdDeleteOutline } from "react-icons/md";

const DeleteVehicleModal = ({
  isOpen,
  onClose,
  vehicle,
  onConfirm,
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <Modal show={isOpen} size="md" popup onClose={onClose}>
      <Modal.Header />
      <Modal.Body>
        <div className="text-center px-2 pb-2">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center text-[#bf0300]">
            <MdDeleteOutline className="w-8 h-8" />
          </div>

          <h3 className="mb-2 text-lg font-bold text-gray-800">
            Delete Vehicle
          </h3>

          <p className="mb-6 text-sm text-gray-500">
            Are you sure you want to delete vehicle{" "}
            <span className="font-semibold text-gray-800">
              "{vehicle?.vehicle_no || `ID #${vehicle?.id}`}"
            </span>
            ? This action cannot be undone.
          </p>

          <div className="flex justify-center gap-3">
            <Button
              color="gray"
              onClick={onClose}
              disabled={loading}
              className="border border-gray-300 font-medium"
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              disabled={loading}
              className="bg-[#bf0300] hover:bg-[#a01618] text-white font-medium focus:ring-4 focus:ring-red-200"
            >
              {loading ? "Deleting..." : "Yes, Delete"}
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default DeleteVehicleModal;

import React, { useEffect, useState } from "react";
import { Button, Modal, Spinner } from "flowbite-react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { getAllVehicleInfo } from "../../Reducer/VehicleInfoSlice";
import nodeApi from "../../store/nodeApi";
import { MdDelete, MdClose, MdImage } from "react-icons/md";
import { BsZoomIn } from "react-icons/bs";

const ViewVehicleImagesModal = ({ isOpen, onClose, vehicle, onImagesUpdated }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const dispatch = useDispatch();

  const baseURL = import.meta.env.VITE_NODE_API_BASE_URL
    ? import.meta.env.VITE_NODE_API_BASE_URL.replace(/\/api\/?$/, "")
    : "http://localhost:5000";

  // Fetch images for this vehicle
  const fetchImages = async () => {
    if (!vehicle?.id) return;
    setLoading(true);
    try {
      const res = await nodeApi.get(`/vehicle-image/vehicle/${vehicle.id}`);
      const list = res?.data?.data || res?.data?.images || res?.data || [];
      if (Array.isArray(list)) {
        const formatted = list.map((item) => {
          const raw = item.image || "";
          const clean = raw.replace(/^.*[/\\]/, "");
          return {
            id: item.id,
            image: raw,
            image_url:
              item.image_url ||
              (clean ? `${baseURL}/uploads/${clean}` : ""),
            status: item.status,
          };
        });
        setImages(formatted);
      } else {
        setImages([]);
      }
    } catch (err) {
      console.error("Fetch vehicle images error:", err);
      // Fallback to vehicle.images if available
      if (Array.isArray(vehicle?.images)) {
        setImages(vehicle.images);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && vehicle?.id) {
      fetchImages();
    } else {
      setImages([]);
      setPreviewImage(null);
    }
  }, [isOpen, vehicle?.id]);

  // Handle deleting an image
  const handleDeleteImage = async (imgId) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;

    try {
      const res = await nodeApi.delete(`/vehicle-image/delete/${imgId}`);
      if (res?.status === 200 || res?.data?.success) {
        toast.success("Image deleted successfully");
        setImages((prev) => prev.filter((img) => img.id !== imgId));
        dispatch(getAllVehicleInfo());
        if (onImagesUpdated) onImagesUpdated();
      } else {
        toast.error(res?.data?.message || "Failed to delete image");
      }
    } catch (err) {
      console.error("Delete image error:", err);
      toast.error("Failed to delete image");
    }
  };

  return (
    <>
      <Modal show={isOpen} size="2xl" onClose={onClose}>
        <Modal.Header className="border-b border-gray-100">
          <div className="flex items-center gap-3 w-full pr-4">
            <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-[#536EFF] shrink-0">
              <MdImage className="text-xl" />
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-lg font-bold text-gray-800">
                Vehicle Images
              </span>

              {vehicle?.vehicle_no && (
                <div className="inline-flex items-stretch border-2 border-gray-900 bg-white rounded-md shadow-xs overflow-hidden select-none font-mono">
                  <div className="bg-[#003893] text-white px-2 py-0.5 flex flex-col items-center justify-center">
                    <span className="text-[6px] font-black text-amber-300 leading-none">●</span>
                    <span className="text-[8px] font-black tracking-tighter leading-none mt-0.5">IND</span>
                  </div>
                  <div className="px-3 py-0.5 bg-gradient-to-b from-white via-gray-50 to-gray-100 flex items-center justify-center">
                    <span className="font-black text-gray-900 text-xs sm:text-sm tracking-widest uppercase">
                      {vehicle.vehicle_no}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Modal.Header>

        <Modal.Body>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Spinner size="xl" color="failure" />
              <p className="text-sm text-gray-500 font-medium">Loading vehicle images...</p>
            </div>
          ) : images.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
                <MdImage className="text-3xl" />
              </div>
              <h3 className="text-base font-semibold text-gray-700">No Images Found</h3>
              <div className="text-xs text-gray-400 mt-2 max-w-sm flex flex-col items-center gap-2">
                <span>No images have been uploaded for vehicle</span>
                {vehicle?.vehicle_no && (
                  <div className="inline-flex items-stretch border border-gray-800 bg-white rounded shadow-2xs overflow-hidden select-none font-mono">
                    <div className="bg-[#003893] text-white px-1.5 py-0.5 flex flex-col items-center justify-center text-[7px] font-black">
                      IND
                    </div>
                    <div className="px-2.5 py-0.5 bg-gray-50 font-extrabold text-gray-900 text-xs tracking-wider uppercase">
                      {vehicle.vehicle_no}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 py-2">
              {images.map((img, idx) => (
                <div
                  key={img.id || idx}
                  className="group relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50 shadow-xs hover:shadow-md transition-all duration-200 aspect-square flex items-center justify-center"
                >
                  <img
                    src={img.image_url || `${baseURL}/uploads/${img.image}`}
                    alt={`Vehicle ${vehicle?.vehicle_no || ""} - ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/400x300?text=Image+Not+Found";
                    }}
                  />

                  {/* Hover Overlay with View and Delete actions */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                    <button
                      type="button"
                      title="Zoom / View Image"
                      onClick={() =>
                        setPreviewImage(
                          img.image_url || `${baseURL}/uploads/${img.image}`
                        )
                      }
                      className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-gray-800 flex items-center justify-center shadow-md transition-transform hover:scale-110 cursor-pointer"
                    >
                      <BsZoomIn className="text-sm" />
                    </button>
                    <button
                      type="button"
                      title="Delete Image"
                      onClick={() => handleDeleteImage(img.id)}
                      className="w-8 h-8 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-md transition-transform hover:scale-110 cursor-pointer"
                    >
                      <MdDelete className="text-base" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Modal.Body>

        <Modal.Footer className="flex justify-between items-center border-t border-gray-100">
          <span className="text-xs font-medium text-gray-500">
            Total Images: <strong className="text-gray-800">{images.length}</strong>
          </span>
          <Button
            color="gray"
            type="button"
            onClick={onClose}
            className="border border-gray-300 font-medium"
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Lightbox / Full-screen Preview Modal */}
      {previewImage && (
        <Modal
          show={!!previewImage}
          size="4xl"
          onClose={() => setPreviewImage(null)}
        >
          <div className="relative p-2 bg-black rounded-lg flex items-center justify-center min-h-[400px]">
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center cursor-pointer transition-colors"
            >
              <MdClose className="text-xl" />
            </button>
            <img
              src={previewImage}
              alt="Vehicle Full Preview"
              className="max-h-[80vh] w-auto max-w-full rounded object-contain shadow-2xl"
            />
          </div>
        </Modal>
      )}
    </>
  );
};

export default ViewVehicleImagesModal;

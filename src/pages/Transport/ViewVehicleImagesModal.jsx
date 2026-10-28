import React, { useEffect, useRef, useState } from "react";
import { Button, Modal, Spinner } from "flowbite-react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { getAllVehicleInfo } from "../../Reducer/VehicleInfoSlice";
import nodeApi from "../../store/nodeApi";
import { MdDelete, MdClose, MdImage, MdCloudUpload } from "react-icons/md";
import { BsZoomIn } from "react-icons/bs";

const ViewVehicleImagesModal = ({ isOpen, onClose, vehicle, onImagesUpdated, uploadMode = false }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [uploadPreviews, setUploadPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
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
      setUploadFiles([]);
      setUploadPreviews([]);
    }
  }, [isOpen, vehicle?.id]);

  // Handle file selection for upload
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const combined = [...uploadFiles, ...files].slice(0, 20);
    setUploadFiles(combined);
    const previews = combined.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
      file,
    }));
    setUploadPreviews(previews);
  };

  const removeUploadFile = (idx) => {
    if (uploadPreviews[idx]?.url) URL.revokeObjectURL(uploadPreviews[idx].url);
    setUploadFiles((prev) => prev.filter((_, i) => i !== idx));
    setUploadPreviews((prev) => prev.filter((_, i) => i !== idx));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const clearUploadFiles = () => {
    uploadPreviews.forEach((p) => p.url && URL.revokeObjectURL(p.url));
    setUploadFiles([]);
    setUploadPreviews([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Handle uploading selected files
  const handleUpload = async () => {
    if (!vehicle?.id || uploadFiles.length === 0) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("vehicle_id", vehicle.id);
      uploadFiles.forEach((file) => formData.append("images", file));
      await nodeApi.post("/vehicle-image/save", formData);
      toast.success(`${uploadFiles.length} image(s) uploaded successfully!`);
      clearUploadFiles();
      fetchImages();
      if (onImagesUpdated) onImagesUpdated();
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Failed to upload images.");
    } finally {
      setUploading(false);
    }
  };

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
          ) : images.length === 0 && !uploadMode ? (
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
            <div className="space-y-4">
              {/* Upload section - only shown in uploadMode */}
              {uploadMode && (
                <div>
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:border-green-400 bg-gray-50/50 hover:bg-green-50/20 transition-colors">
                    <input
                      ref={fileInputRef}
                      id="upload_vehicle_images_input"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="upload_vehicle_images_input"
                      className="cursor-pointer flex flex-col items-center justify-center gap-1.5"
                    >
                      <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-[#16a34a]">
                        <MdCloudUpload className="text-2xl" />
                      </div>
                      <span className="text-xs font-semibold text-gray-700">
                        Click to select vehicle images to upload
                      </span>
                      <span className="text-[11px] text-gray-400">
                        Supports JPG, PNG, WEBP (Max 20 files)
                      </span>
                    </label>
                  </div>

                  {uploadPreviews.length > 0 && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-600">
                          Selected ({uploadPreviews.length})
                        </span>
                        <button
                          type="button"
                          onClick={clearUploadFiles}
                          className="text-xs text-red-600 hover:underline"
                        >
                          Clear all
                        </button>
                      </div>
                      <div className="grid grid-cols-4 gap-2 max-h-36 overflow-y-auto p-1 bg-gray-50 rounded-lg border border-gray-100">
                        {uploadPreviews.map((preview, idx) => (
                          <div
                            key={idx}
                            className="relative group rounded-md overflow-hidden border border-gray-200 aspect-square bg-white shadow-xs"
                          >
                            <img
                              src={preview.url}
                              alt={preview.name}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeUploadFile(idx)}
                              className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full text-xs shadow-md cursor-pointer"
                              title="Remove"
                            >
                              <MdClose className="text-xs" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Existing images grid */}
              {images.length > 0 && (
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
            </div>
          )}
        </Modal.Body>

        <Modal.Footer className="flex justify-between items-center border-t border-gray-100">
          <span className="text-xs font-medium text-gray-500">
            Total Images: <strong className="text-gray-800">{images.length}</strong>
          </span>
          <div className="flex items-center gap-2">
            {uploadMode && uploadFiles.length > 0 && (
              <Button
                type="button"
                onClick={handleUpload}
                disabled={uploading}
                className="bg-[#16a34a] hover:bg-[#15803d] text-white font-medium text-xs"
              >
                {uploading ? "Uploading..." : `Upload ${uploadFiles.length} Image(s)`}
              </Button>
            )}
            <Button
              color="gray"
              type="button"
              onClick={onClose}
              className="border border-gray-300 font-medium"
            >
              Close
            </Button>
          </div>
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

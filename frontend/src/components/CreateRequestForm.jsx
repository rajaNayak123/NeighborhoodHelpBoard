// frontend/src/components/CreateRequestForm.jsx
import { useState } from "react";
import {
  FiX,
  FiUpload,
  FiMapPin,
  FiAlertCircle,
  FiCheck,
} from "react-icons/fi";
import requestService from "../services/requestService";

const CreateRequestForm = ({ userLocation, onClose, onPostSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "other",
    urgency: "medium",
  });
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFiles(e.dataTransfer.files);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userLocation) {
      setError(
        "Could not determine your location. Please enable location services."
      );
      return;
    }
    setError("");
    setLoading(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("urgency", formData.urgency);
    data.append(
      "location",
      JSON.stringify([userLocation.longitude, userLocation.latitude])
    );
    data.append("address", "Dummy Address, City");

    for (let i = 0; i < files.length; i++) {
      data.append("images", files[i]);
    }

    try {
      await requestService.createRequest(data);
      onPostSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create request.");
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200";
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "low":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Create Help Request
            </h2>
            <p className="text-gray-600 mt-1">
              Share what you need help with in your community
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <FiX className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
              <FiAlertCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="form-label">Request Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="What do you need help with?"
            />
          </div>

          {/* Description */}
          <div>
            <label className="form-label">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="form-input resize-none"
              placeholder="Provide more details about what you need help with..."
            />
          </div>

          {/* Category and Urgency */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="form-label">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-input"
              >
                <option value="other">Other</option>
                <option value="groceries">Groceries</option>
                <option value="repairs">Repairs</option>
                <option value="tools">Borrowing Tools</option>
              </select>
            </div>

            <div>
              <label className="form-label">Urgency Level</label>
              <select
                name="urgency"
                value={formData.urgency}
                onChange={handleChange}
                className={`form-input ${getUrgencyColor(formData.urgency)}`}
              >
                <option value="low">Low - Can wait</option>
                <option value="medium">Medium - Soon</option>
                <option value="high">High - Urgent</option>
              </select>
            </div>
          </div>

          {/* Location Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <FiMapPin className="w-5 h-5 text-blue-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-blue-900">Location</p>
                <p className="text-sm text-blue-700">
                  {userLocation
                    ? `Using your current location (${userLocation.latitude.toFixed(
                        4
                      )}, ${userLocation.longitude.toFixed(4)})`
                    : "Location not available"}
                </p>
              </div>
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="form-label">Upload Images (Optional)</label>
            <div
              className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 ${
                dragActive
                  ? "border-blue-400 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                name="images"
                onChange={handleFileChange}
                multiple
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="space-y-2">
                <FiUpload className="w-8 h-8 text-gray-400 mx-auto" />
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-blue-600 hover:text-blue-500">
                    Click to upload
                  </span>{" "}
                  or drag and drop
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB each
                </p>
              </div>
            </div>

            {files.length > 0 && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-2">
                  {files.length} file{files.length !== 1 ? "s" : ""} selected:
                </p>
                <div className="space-y-1">
                  {Array.from(files).map((file, index) => (
                    <div
                      key={index}
                      className="text-sm text-gray-700 bg-gray-50 px-3 py-1 rounded"
                    >
                      {file.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary flex-1 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  <span>Creating Request...</span>
                </>
              ) : (
                <>
                  <FiCheck className="w-4 h-4" />
                  <span>Create Request</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRequestForm;

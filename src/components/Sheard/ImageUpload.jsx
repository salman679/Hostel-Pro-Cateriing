import { useState } from "react";
import axios from "axios";
import { Upload, ImageIcon, Check } from "lucide-react";
import { showAlert } from "./AlertUtils";
import PropTypes from "prop-types";

const ImageUpload = ({
  onImageUpload,
  uploadText = "Upload Image",
  failedText = "Failed to upload image. Please try again.",
  apiKey = "6e8387872b8e8827b2a1b18c44181ca6",
}) => {
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageUrl, setImageUrl] = useState("");

  // Handle image upload to ImageBB
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setLoading(true);
    setUploadProgress(10);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 300);

      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        formData
      );

      clearInterval(progressInterval);
      setUploadProgress(100);
      setImageUrl(response.data.data.url);

      // Call the parent component's callback with the image URL
      if (onImageUpload) {
        onImageUpload(response.data.data.url);
      }

      setTimeout(() => {
        setUploadProgress(0);
      }, 1000);
    } catch (error) {
      console.error("Error uploading image:", error);
      showAlert({
        icon: "error",
        title: "Upload Failed",
        text: failedText,
      });
      setUploadProgress(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Meal Image
      </label>

      {imageUrl ? (
        <div className="relative">
          <img
            src={imageUrl}
            alt="Uploaded preview"
            className="h-32 w-32 object-cover rounded-lg border-2 border-dashed border-gray-300"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg opacity-0 hover:opacity-100 transition-opacity">
            <label className="cursor-pointer bg-white rounded-full p-2 shadow-lg">
              <Upload size={16} className="text-gray-600" />
              <input
                type="file"
                className="hidden"
                onChange={handleImageUpload}
                accept="image/*"
              />
            </label>
          </div>
          <div className="absolute top-1 right-1 bg-green-500 rounded-full p-1">
            <Check size={14} className="text-white" />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 hover:bg-green-50 transition-colors">
          <label className="flex flex-col items-center cursor-pointer">
            <ImageIcon size={24} className="text-gray-400 mb-1" />
            <span className="text-xs text-gray-500">{uploadText}</span>
            <input
              type="file"
              className="hidden"
              onChange={handleImageUpload}
              accept="image/*"
            />
          </label>
        </div>
      )}

      {loading && (
        <div className="w-32">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Uploading...</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;

ImageUpload.propTypes = {
  onImageUpload: PropTypes.func.isRequired,
  uploadText: PropTypes.string,
  changeText: PropTypes.string,
  requiredText: PropTypes.string,
  failedText: PropTypes.string,
  successText: PropTypes.string,
  apiKey: PropTypes.string,
};

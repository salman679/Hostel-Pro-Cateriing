import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import { Upload, ImageIcon, Check, AlertCircle } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

export default function AddMeal() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // Handle form submission
  const onSubmit = async (data) => {
    if (!imageUrl) {
      Swal.fire({
        icon: "error",
        title: "Image Required",
        text: "Please upload an image for the meal",
        confirmButtonColor: "#22c55e",
      });
      return;
    }

    const price = Number(data.price);
    try {
      setLoading(true);
      const response = await axiosSecure.post("/meals", {
        ...data,
        price,
        image: imageUrl,
        likes: 0,
        rating: 0,
        reviews: [],
        distributorName: user?.displayName || user?.name,
        distributorEmail: user?.email,
      });

      if (response.data.insertedId) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Meal added successfully",
          confirmButtonColor: "#22c55e",
        });
        reset();
        setImageUrl("");
        setUploadProgress(0);
        document.getElementById("image").value = "";
      }
    } catch (error) {
      console.error("Error adding meal:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add meal. Please try again.",
        confirmButtonColor: "#22c55e",
      });
    } finally {
      setLoading(false);
    }
  };

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
        "https://api.imgbb.com/1/upload?key=6e8387872b8e8827b2a1b18c44181ca6",
        formData
      );

      clearInterval(progressInterval);
      setUploadProgress(100);
      setImageUrl(response.data.data.url);

      setTimeout(() => {
        setUploadProgress(0);
      }, 1000);
    } catch (error) {
      console.error("Error uploading image:", error);
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: "Failed to upload image. Please try again.",
        confirmButtonColor: "#22c55e",
      });
      setUploadProgress(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Add New Meal</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Meal Title
              </label>
              <input
                type="text"
                id="title"
                {...register("title", { required: "Title is required" })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter meal title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Category
              </label>
              <select
                id="category"
                {...register("category", { required: "Category is required" })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Category</option>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="veg">Vegetarian</option>
                <option value="non-veg">Non-Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="special">Special Meals</option>
                <option value="dessert">Dessert</option>
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.category.message}
                </p>
              )}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meal Image
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
              <div className="space-y-1 text-center">
                {imageUrl ? (
                  <div className="flex flex-col items-center">
                    <div className="relative w-40 h-40 mb-4 rounded-lg overflow-hidden">
                      <img
                        src={imageUrl || "/placeholder.svg"}
                        alt="Meal preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-sm text-green-600 flex items-center">
                      <Check size={16} className="mr-1" />
                      Image uploaded successfully
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setImageUrl("");
                        document.getElementById("image").value = "";
                      }}
                      className="mt-2 text-sm text-red-600 hover:text-red-800"
                    >
                      Remove image
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col items-center">
                      <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-1 text-sm text-gray-600">
                        <span className="font-medium text-blue-600 hover:text-blue-500">
                          Upload an image
                        </span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </div>

                    {uploadProgress > 0 && (
                      <div className="w-full mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Uploading: {uploadProgress}%
                        </p>
                      </div>
                    )}
                  </>
                )}

                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  {...register("image", { required: !imageUrl })}
                  onChange={handleImageUpload}
                  className="sr-only"
                />

                {!imageUrl && (
                  <label
                    htmlFor="image"
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <Upload size={16} className="mr-2" />
                    Select Image
                  </label>
                )}
              </div>
            </div>
            {errors.image && !imageUrl && (
              <p className="mt-1 text-sm text-red-600">Image is required</p>
            )}
          </div>

          {/* Ingredients and Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="ingredients"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Ingredients
              </label>
              <textarea
                id="ingredients"
                {...register("ingredients", {
                  required: "Ingredients are required",
                })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter ingredients separated by commas"
              ></textarea>
              {errors.ingredients && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.ingredients.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                {...register("description", {
                  required: "Description is required",
                })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter meal description"
              ></textarea>
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>

          {/* Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Price ($)
              </label>
              <input
                type="number"
                id="price"
                step="0.01"
                min="0"
                {...register("price", {
                  required: "Price is required",
                  min: { value: 0, message: "Price must be positive" },
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.price.message}
                </p>
              )}
            </div>
          </div>

          {/* Distributor Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="distributorName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Distributor Name
              </label>
              <input
                type="text"
                id="distributorName"
                value={user?.displayName || user?.name || ""}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
              />
            </div>

            <div>
              <label
                htmlFor="distributorEmail"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Distributor Email
              </label>
              <input
                type="email"
                id="distributorEmail"
                value={user?.email || ""}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Adding Meal...
                </>
              ) : (
                "Add Meal"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Tips Section */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-start">
          <AlertCircle className="text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-medium text-blue-800 mb-2">
              Tips for Adding Meals
            </h3>
            <ul className="space-y-2 text-sm text-blue-700">
              <li>• Use high-quality images to showcase your meal</li>
              <li>
                • Provide detailed ingredients list for better user experience
              </li>
              <li>
                • Write a compelling description that highlights the meal&apos;s
                features
              </li>
              <li>• Set a competitive price based on similar meals</li>
              <li>• Choose the most appropriate category for your meal</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

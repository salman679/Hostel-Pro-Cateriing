import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Upload,
  ImageIcon,
  Check,
  Plus,
  Heart,
  ArrowUpDown,
  Send,
} from "lucide-react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useAuth } from "../../../contexts/AuthContext";

export default function UpcomingMeals() {
  const [sortBy, setSortBy] = useState("likes");
  const [showModal, setShowModal] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const itemsPerPage = 10;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const {
    data: upcomingMeals = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["upcomingMeals", sortBy],
    queryFn: async () => {
      const response = await axiosSecure.get(
        `/upcoming-meals?sortBy=${sortBy}`
      );
      return response.data;
    },
  });

  // Handle search input change
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  async function handlePublishMeal(meal) {
    Swal.fire({
      title: "Publish Meal?",
      text: "This will make the meal available to all users",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#22c55e",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, publish it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.post("/meals", meal).then((res) => {
          if (res.data.insertedId) {
            Swal.fire({
              icon: "success",
              title: "Published!",
              text: "Your meal has been published.",
              confirmButtonColor: "#22c55e",
            });

            axiosSecure.delete(`/upcoming-meals/${meal._id}`).then((res) => {
              if (res.data.deletedCount > 0) {
                refetch();
              }
            });
          }
        });
      }
    });
  }

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
      const response = await axiosSecure.post("/upcoming-meals", {
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
        refetch();
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Upcoming meal added successfully",
          confirmButtonColor: "#22c55e",
        });
        reset();
        setImageUrl("");
        setUploadProgress(0);
        setShowModal(false);
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

  // Filter meals based on search query
  const filteredMeals = upcomingMeals.filter(
    (meal) =>
      meal.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meal.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meal.distributorName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMeals = filteredMeals.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMeals.length / itemsPerPage);

  // Change page
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Upcoming Meals</h2>

          <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search meals..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-full sm:w-64"
              />
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Sort Button */}
            <button
              onClick={() => setSortBy(sortBy === "likes" ? "date" : "likes")}
              className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              <ArrowUpDown size={16} className="mr-2" />
              Sort by {sortBy === "likes" ? "Likes" : "Date"}
            </button>

            {/* Add Meal Button */}
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              <Plus size={16} className="mr-2" />
              Add Upcoming Meal
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
            <span className="ml-2 text-gray-600">Loading meals...</span>
          </div>
        ) : filteredMeals.length > 0 ? (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Meal
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        Likes
                        <ArrowUpDown size={14} className="ml-1" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentMeals.map((meal) => (
                    <tr
                      key={meal._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 rounded-full overflow-hidden bg-gray-100">
                            <img
                              src={meal.image || "/placeholder.svg"}
                              alt={meal.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {meal.title}
                            </div>
                            <div className="text-xs text-gray-500">
                              {meal.distributorName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <Heart size={16} className="text-red-500 mr-1" />
                          {meal.likes || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {meal.category}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ${meal.price?.toFixed(2) || "0.00"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handlePublishMeal(meal)}
                          className="inline-flex items-center px-3 py-1 rounded-md text-sm bg-green-50 text-green-600 hover:bg-green-100"
                        >
                          <Send size={14} className="mr-1" />
                          Publish
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {currentMeals.map((meal) => (
                <div
                  key={meal._id}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm"
                >
                  <div className="p-4">
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                        <img
                          src={meal.image || "/placeholder.svg"}
                          alt={meal.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="text-sm font-medium text-gray-900">
                          {meal.title}
                        </h3>
                        <p className="text-xs text-gray-500">{meal.category}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Heart size={14} className="text-red-500 mr-1" />
                        {meal.likes || 0} likes
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        ${meal.price?.toFixed(2) || "0.00"}
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => handlePublishMeal(meal)}
                        className="w-full inline-flex items-center justify-center px-3 py-2 rounded-md text-sm bg-green-50 text-green-600 hover:bg-green-100"
                      >
                        <Send size={14} className="mr-1" />
                        Publish Meal
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <nav className="flex items-center space-x-1">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-2 py-2 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handlePageChange(index + 1)}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === index + 1
                          ? "bg-green-500 text-white"
                          : "text-gray-500 hover:bg-gray-100"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-2 py-2 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={18} />
                  </button>
                </nav>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 text-yellow-600 mb-4">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No upcoming meals found
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              {searchQuery
                ? `No meals matching "${searchQuery}" were found.`
                : "There are no upcoming meals in the system yet."}
            </p>
            {searchQuery ? (
              <button
                onClick={clearSearch}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                Clear Search
              </button>
            ) : (
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                <Plus size={16} className="mr-2" />
                Add Upcoming Meal
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add Upcoming Meal Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                  Add Upcoming Meal
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Title and Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                      {...register("category", {
                        required: "Category is required",
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                              <span className="font-medium text-green-600 hover:text-green-500">
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
                                  className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
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
                        onChange={handleImageUpload}
                        className="sr-only"
                      />

                      {!imageUrl && (
                        <label
                          htmlFor="image"
                          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 cursor-pointer"
                        >
                          <Upload size={16} className="mr-2" />
                          Select Image
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                {/* Ingredients and Description */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.price.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                        Adding...
                      </>
                    ) : (
                      "Add Upcoming Meal"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

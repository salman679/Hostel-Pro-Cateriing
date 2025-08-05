import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Edit,
  Trash2,
  Eye,
  Heart,
  MessageSquare,
  Star,
  ArrowUpDown,
} from "lucide-react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

export default function AllMeals() {
  const [sortBy, setSortBy] = useState("likes");
  const [mealToUpdate, setMealToUpdate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const axiosSecure = useAxiosSecure();
  const itemsPerPage = 10;

  const {
    data: meals = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["meals", sortBy, currentPage],
    queryFn: async () => {
      const response = await axiosSecure.get("/meals", {
        params: { sortBy, page: currentPage },
      });
      return response.data;
    },
  });

  // React Hook Form setup
  const { register, handleSubmit, setValue, reset } = useForm();

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

  const handleUpdate = (meal) => {
    setMealToUpdate(meal);
    setValue("title", meal.title);
    setValue("category", meal.category);
    setValue("image", meal.image);
    setValue("ingredients", meal.ingredients);
    setValue("description", meal.description);
    setValue("price", meal.price);
  };

  const handleUpdateSubmit = async (data) => {
    try {
      const res = await axiosSecure.put(
        `/meals/${mealToUpdate._id}/edit`,
        data
      );
      if (res.data.modifiedCount > 0) {
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Your meal has been updated.",
          confirmButtonColor: "#22c55e",
        });
        setMealToUpdate(null);
        reset();
        refetch();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Meal could not be updated.",
          confirmButtonColor: "#22c55e",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "An error occurred while updating the meal.",
        confirmButtonColor: "#22c55e",
      });
      console.error("Error updating meal:", error);
    }
  };

  const handleDelete = async (mealId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#22c55e",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.delete(`/meals/${mealId}`);
          if (res.data.deletedCount > 0) {
            Swal.fire({
              icon: "success",
              title: "Deleted!",
              text: "Your meal has been deleted.",
              confirmButtonColor: "#22c55e",
            });
            refetch();
          } else {
            Swal.fire({
              icon: "error",
              title: "Error!",
              text: "Meal could not be deleted.",
              confirmButtonColor: "#22c55e",
            });
          }
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: "An error occurred while deleting the meal.",
            confirmButtonColor: "#22c55e",
          });
          console.error("Error deleting meal:", error);
        }
      }
    });
  };

  // Filter meals based on search query
  const filteredMeals = meals.filter(
    (meal) =>
      meal.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meal.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meal.distributorName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredMeals.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMeals = filteredMeals.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">All Meals</h2>

          {/* Search and Sort Controls */}
          <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search meals..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
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

            {/* Sort Controls */}
            <div className="flex space-x-2">
              <button
                onClick={() => setSortBy("likes")}
                className={`inline-flex items-center px-3 py-2 rounded-lg text-sm ${
                  sortBy === "likes"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Heart size={16} className="mr-1" />
                Likes
              </button>
              <button
                onClick={() => setSortBy("reviews_count")}
                className={`inline-flex items-center px-3 py-2 rounded-lg text-sm ${
                  sortBy === "reviews_count"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <MessageSquare size={16} className="mr-1" />
                Reviews
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
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
                      <div className="flex items-center">
                        Reviews
                        <ArrowUpDown size={14} className="ml-1" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Distributor
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
                              {meal.category}
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
                        <div className="flex items-center text-sm text-gray-500">
                          <MessageSquare
                            size={16}
                            className="text-blue-500 mr-1"
                          />
                          {meal.reviews?.length || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <Star
                            size={16}
                            className="text-yellow-500 fill-yellow-500 mr-1"
                          />
                          {meal.rating || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {meal.distributorName || "Unknown"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            to={`/meals/${meal._id}`}
                            className="text-purple-600 hover:text-purple-900 bg-purple-50 px-3 py-1 rounded-md flex items-center"
                          >
                            <Eye size={14} className="mr-1" />
                            View
                          </Link>
                          <button
                            onClick={() => handleUpdate(meal)}
                            className="text-blue-600 hover:text-blue-900 bg-blue-50 px-3 py-1 rounded-md flex items-center"
                          >
                            <Edit size={14} className="mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(meal._id)}
                            className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded-md flex items-center"
                          >
                            <Trash2 size={14} className="mr-1" />
                            Delete
                          </button>
                        </div>
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
                      <div className="flex space-x-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Heart size={14} className="text-red-500 mr-1" />
                          {meal.likes || 0}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <MessageSquare
                            size={14}
                            className="text-blue-500 mr-1"
                          />
                          {meal.reviews?.length || 0}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Star
                            size={14}
                            className="text-yellow-500 fill-yellow-500 mr-1"
                          />
                          {meal.rating || 0}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex justify-between">
                        <div className="text-xs text-gray-500">
                          By: {meal.distributorName || "Unknown"}
                        </div>
                        <div className="flex space-x-2">
                          <Link
                            to={`/meals/${meal._id}`}
                            className="text-xs text-purple-600 hover:text-purple-900 bg-purple-50 px-2 py-1 rounded-md flex items-center"
                          >
                            <Eye size={12} className="mr-1" />
                            View
                          </Link>
                          <button
                            onClick={() => handleUpdate(meal)}
                            className="text-xs text-blue-600 hover:text-blue-900 bg-blue-50 px-2 py-1 rounded-md flex items-center"
                          >
                            <Edit size={12} className="mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(meal._id)}
                            className="text-xs text-red-600 hover:text-red-900 bg-red-50 px-2 py-1 rounded-md flex items-center"
                          >
                            <Trash2 size={12} className="mr-1" />
                            Delete
                          </button>
                        </div>
                      </div>
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
                          ? "bg-blue-500 text-white"
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
              No meals found
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              {searchQuery
                ? `No meals matching "${searchQuery}" were found.`
                : "There are no meals in the system yet."}
            </p>
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>

      {/* Update Meal Modal */}
      {mealToUpdate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Update Meal</h3>
                <button
                  onClick={() => setMealToUpdate(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <form
                onSubmit={handleSubmit(handleUpdateSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meal Title
                    </label>
                    <input
                      {...register("title", { required: true })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <input
                      {...register("category", { required: true })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    {...register("image", { required: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ingredients
                  </label>
                  <textarea
                    {...register("ingredients", { required: true })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    {...register("description", { required: true })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("price", { required: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setMealToUpdate(null)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Update Meal
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

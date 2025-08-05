import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import {
  Heart,
  MessageSquare,
  AlertTriangle,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

export default function RequestedMeals() {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 10;

  const {
    data: requestedMeals = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["requests"],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      const response = await axiosSecure.get(`/user/${user?.email}/requests`, {
        params: { email: user?.email },
      });
      return response.data;
    },
  });

  const cancelMeal = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#22c55e",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, cancel it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axiosSecure.put(`/meals/${id}`, {
            status: "cancelled",
            email: user?.email,
          });
          if (response.data.modifiedCount > 0) {
            refetch();
            Swal.fire({
              icon: "success",
              title: "Cancelled!",
              text: "Your request has been cancelled.",
              confirmButtonColor: "#22c55e",
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Error!",
              text: "Request could not be deleted.",
              confirmButtonColor: "#22c55e",
            });
          }
        } catch (error) {
          console.error("Error deleting request:", error);
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: "An error occurred.",
            confirmButtonColor: "#22c55e",
          });
        }
      }
    });
  };

  // Filter meals based on search query
  const filteredMeals = requestedMeals.filter((meal) =>
    meal.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRequestedMeals = filteredMeals.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredMeals.length / itemsPerPage);

  // Change page
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  // Get status badge style
  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      approved: "bg-green-100 text-green-800 border-green-200",
      served: "bg-blue-100 text-blue-800 border-blue-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
    };

    return statusStyles[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Requested Meals</h2>

          {/* Search Bar */}
          <div className="mt-4 sm:mt-0 relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Search meals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
            <span className="ml-2 text-gray-600">Loading...</span>
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
                      Likes
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reviews
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentRequestedMeals.map((meal) => (
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
                        {meal.requests?.map((request) => (
                          <span
                            key={request.userEmail}
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusBadge(
                              request.status
                            )}`}
                          >
                            {request.status}
                          </span>
                        ))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            to={`/meals/${meal._id}`}
                            className="text-blue-600 hover:text-blue-900 bg-blue-50 px-3 py-1 rounded-md"
                          >
                            View
                          </Link>
                          <button
                            onClick={() => cancelMeal(meal._id)}
                            className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded-md"
                            disabled={meal.requests?.some(
                              (r) => r.status === "cancelled"
                            )}
                          >
                            Cancel
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
              {currentRequestedMeals.map((meal) => (
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
                      {meal.requests?.map((request) => (
                        <span
                          key={request.userEmail}
                          className={`px-2 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(
                            request.status
                          )}`}
                        >
                          {request.status}
                        </span>
                      ))}
                    </div>

                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
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
                      </div>

                      <div className="flex space-x-2">
                        <Link
                          to={`/meals/${meal._id}`}
                          className="text-xs text-blue-600 hover:text-blue-900 bg-blue-50 px-2 py-1 rounded-md"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => cancelMeal(meal._id)}
                          className="text-xs text-red-600 hover:text-red-900 bg-red-50 px-2 py-1 rounded-md"
                          disabled={meal.requests?.some(
                            (r) => r.status === "cancelled"
                          )}
                        >
                          Cancel
                        </button>
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
              No requested meals found
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              {searchQuery
                ? `No meals matching "${searchQuery}" were found.`
                : "You haven't requested any meals yet. Browse our menu to find delicious meals to request."}
            </p>
            {searchQuery ? (
              <button
                onClick={clearSearch}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                Clear Search
              </button>
            ) : (
              <Link
                to="/meals"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                Browse Meals
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

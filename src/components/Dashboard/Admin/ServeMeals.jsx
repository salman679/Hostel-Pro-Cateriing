import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Check,
  Clock,
  Ban,
} from "lucide-react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

export default function ServeMeals() {
  const [searchQuery, setSearchQuery] = useState("");
  const axiosSecure = useAxiosSecure();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const {
    data: requestedMeals = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["serveMeals", searchQuery],
    queryFn: async () => {
      const res = await axiosSecure.get("/serve-meals", {
        params: { search: searchQuery },
      });
      return res.data;
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

  const handleServeMeal = async (meal) => {
    try {
      const res = await axiosSecure.put(`/meals/${meal._id}/serve`, {
        status: "Delivered",
        userEmail: meal.requests.userEmail,
      });
      if (res.data.modifiedCount > 0) {
        refetch();
        Swal.fire({
          icon: "success",
          title: "Served!",
          text: "Meal has been served successfully.",
          confirmButtonColor: "#22c55e",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Meal could not be served.",
          confirmButtonColor: "#22c55e",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "An error occurred while serving the meal.",
        confirmButtonColor: "#22c55e",
      });
      console.error("Error serving meal:", error);
    }
  };

  // Filter meals based on search query
  const filteredMeals = requestedMeals.filter(
    (meal) =>
      meal.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meal.requests?.userName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      meal.requests?.userEmail
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
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

  // Get status badge style
  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Delivered: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
    };

    return statusStyles[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Serve Meals</h2>

          {/* Search Bar */}
          <div className="mt-4 sm:mt-0 relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name or email..."
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
                      User
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
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
                  {currentMeals.map((meal, index) => (
                    <tr
                      key={index}
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
                        <div className="text-sm text-gray-900">
                          {meal.requests.userName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {meal.requests.userEmail}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusBadge(
                            meal.requests.status
                          )}`}
                        >
                          {meal.requests.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {meal.requests.status === "pending" ? (
                          <button
                            onClick={() => handleServeMeal(meal)}
                            className="inline-flex items-center px-3 py-1 rounded-md text-sm bg-green-50 text-green-600 hover:bg-green-100"
                          >
                            <Check size={14} className="mr-1" />
                            Serve
                          </button>
                        ) : meal.requests.status === "Delivered" ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-md text-sm bg-gray-100 text-gray-500">
                            <Check size={14} className="mr-1" />
                            Served
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-md text-sm bg-gray-100 text-gray-500">
                            <Ban size={14} className="mr-1" />
                            Cancelled
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {currentMeals.map((meal, index) => (
                <div
                  key={index}
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
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(
                          meal.requests.status
                        )}`}
                      >
                        {meal.requests.status}
                      </span>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex flex-col space-y-2">
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-500">User:</span>
                          <span className="text-xs font-medium text-gray-900">
                            {meal.requests.userName}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-500">Email:</span>
                          <span className="text-xs text-gray-900">
                            {meal.requests.userEmail}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                      {meal.requests.status === "pending" ? (
                        <button
                          onClick={() => handleServeMeal(meal)}
                          className="inline-flex items-center px-3 py-1 rounded-md text-xs bg-green-50 text-green-600 hover:bg-green-100"
                        >
                          <Check size={12} className="mr-1" />
                          Serve
                        </button>
                      ) : meal.requests.status === "Delivered" ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-md text-xs bg-gray-100 text-gray-500">
                          <Check size={12} className="mr-1" />
                          Served
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-md text-xs bg-gray-100 text-gray-500">
                          <Ban size={12} className="mr-1" />
                          Cancelled
                        </span>
                      )}
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
              No meals to serve
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              {searchQuery
                ? `No meals matching "${searchQuery}" were found.`
                : "There are no pending meal requests at the moment."}
            </p>
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Pending</h3>
            <div className="p-2 rounded-lg bg-yellow-100">
              <Clock size={20} className="text-yellow-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800">
            {
              requestedMeals.filter(
                (meal) => meal.requests.status === "pending"
              ).length
            }
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Meals waiting to be served
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Served</h3>
            <div className="p-2 rounded-lg bg-green-100">
              <Check size={20} className="text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800">
            {
              requestedMeals.filter(
                (meal) => meal.requests.status === "Delivered"
              ).length
            }
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Meals successfully served
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Cancelled</h3>
            <div className="p-2 rounded-lg bg-red-100">
              <Ban size={20} className="text-red-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800">
            {
              requestedMeals.filter(
                (meal) => meal.requests.status === "cancelled"
              ).length
            }
          </p>
          <p className="text-sm text-gray-500 mt-1">Cancelled meal requests</p>
        </div>
      </div>
    </div>
  );
}

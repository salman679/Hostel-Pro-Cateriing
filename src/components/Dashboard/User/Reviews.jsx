import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Edit, Trash2, Eye, Save, X, Star, AlertTriangle } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import SearchBar from "../../Sheard/SearchBar";
import { ConfirmationModal } from "../../Sheard/ConfirmationModal";
import { showAlert } from "../../Sheard/AlertUtils";
import Pagination from "../../Sheard/Pagination";

export default function Reviews() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [editMode, setEditMode] = useState(null);
  const [editedText, setEditedText] = useState("");
  const itemsPerPage = 10;

  const {
    data: reviewsData = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/meals/${user.email}/reviews`);
      return data;
    },
  });

  // Filter reviews based on search query
  const filteredReviews = reviewsData.filter(
    (review) =>
      review.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.reviews?.some((r) =>
        r.text?.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReviews = filteredReviews.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);

  // Change page
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleEdit = (review) => {
    setEditMode(review._id);
    setEditedText(review.reviews[0]?.text || "");
  };

  const saveEdit = (id) => {
    axiosSecure
      .put(`/meals/${id}/reviews`, { email: user?.email, text: editedText })
      .then((res) => {
        if (res.data.modifiedCount > 0) {
          refetch();
          setEditMode(null);
          showAlert({
            icon: "success",
            title: "Updated!",
            text: "Your review has been updated.",
          });
        }
      });
  };

  const cancelEdit = () => {
    setEditMode(null);
    setEditedText("");
  };

  const deleteReview = (id) => {
    const deleteConfirmation = ConfirmationModal({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      confirmButtonText: "Yes, delete it!",
      cancelButtonColor: "#ef4444",
      onConfirm: () => {
        axiosSecure
          .delete(`/meals/${id}/reviews`, {
            params: {
              email: user?.email,
            },
          })
          .then((res) => {
            if (res.data.modifiedCount > 0) {
              refetch();
              showAlert({
                icon: "success",
                title: "Deleted!",
                text: "Your review has been deleted.",
              });
            }
          });
      },
    });

    deleteConfirmation();
  };

  // Render stars based on rating
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={16}
        className={
          i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
        }
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">My Reviews</h2>

          {/* Search Bar */}
          <div className="mt-4 sm:mt-0">
            <SearchBar
              placeholder="Search reviews..."
              searchTerm={searchQuery}
              onSearchChange={setSearchQuery}
              onSubmit={(e) => e.preventDefault()}
              onClearSearch={clearSearch}
              inputClassName="w-full sm:w-64"
              iconClassName="text-gray-400"
              buttonClassName="text-gray-400 hover:text-gray-600"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
            <span className="ml-2 text-gray-600">Loading...</span>
          </div>
        ) : filteredReviews.length > 0 ? (
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
                      Rating
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Review
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentReviews.map((review) => (
                    <tr
                      key={review._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 rounded-full overflow-hidden bg-gray-100">
                            <img
                              src={review.image || "/placeholder.svg"}
                              alt={review.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {review.title}
                            </div>
                            <div className="text-xs text-gray-500">
                              {review.category}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex">
                          {renderStars(
                            review.rating || review.reviews[0]?.rating || 0
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {editMode === review._id ? (
                          <textarea
                            value={editedText}
                            onChange={(e) => setEditedText(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            rows={3}
                          />
                        ) : (
                          <div className="text-sm text-gray-900 max-w-xs">
                            {review.reviews.map((r) => (
                              <div key={r.userEmail} className="line-clamp-2">
                                {r.text}
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {editMode === review._id ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => saveEdit(review._id)}
                              className="text-green-600 hover:text-green-900 bg-green-50 px-3 py-1 rounded-md flex items-center"
                            >
                              <Save size={14} className="mr-1" />
                              Save
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="text-gray-600 hover:text-gray-900 bg-gray-50 px-3 py-1 rounded-md flex items-center"
                            >
                              <X size={14} className="mr-1" />
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(review)}
                              className="text-blue-600 hover:text-blue-900 bg-blue-50 px-3 py-1 rounded-md flex items-center"
                            >
                              <Edit size={14} className="mr-1" />
                              Edit
                            </button>
                            <button
                              onClick={() => deleteReview(review._id)}
                              className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded-md flex items-center"
                            >
                              <Trash2 size={14} className="mr-1" />
                              Delete
                            </button>
                            <Link
                              to={`/meals/${review._id}`}
                              className="text-purple-600 hover:text-purple-900 bg-purple-50 px-3 py-1 rounded-md flex items-center"
                            >
                              <Eye size={14} className="mr-1" />
                              View
                            </Link>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {currentReviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm"
                >
                  <div className="p-4">
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                        <img
                          src={review.image || "/placeholder.svg"}
                          alt={review.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="text-sm font-medium text-gray-900">
                          {review.title}
                        </h3>
                        <div className="flex mt-1">
                          {renderStars(
                            review.rating || review.reviews[0]?.rating || 0
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      {editMode === review._id ? (
                        <textarea
                          value={editedText}
                          onChange={(e) => setEditedText(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          rows={3}
                        />
                      ) : (
                        <p className="text-sm text-gray-600">
                          {review.reviews.map((r) => r.text).join(" ")}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      {editMode === review._id ? (
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => saveEdit(review._id)}
                            className="text-xs text-green-600 hover:text-green-900 bg-green-50 px-2 py-1 rounded-md flex items-center"
                          >
                            <Save size={12} className="mr-1" />
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="text-xs text-gray-600 hover:text-gray-900 bg-gray-50 px-2 py-1 rounded-md flex items-center"
                          >
                            <X size={12} className="mr-1" />
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-between">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(review)}
                              className="text-xs text-blue-600 hover:text-blue-900 bg-blue-50 px-2 py-1 rounded-md flex items-center"
                            >
                              <Edit size={12} className="mr-1" />
                              Edit
                            </button>
                            <button
                              onClick={() => deleteReview(review._id)}
                              className="text-xs text-red-600 hover:text-red-900 bg-red-50 px-2 py-1 rounded-md flex items-center"
                            >
                              <Trash2 size={12} className="mr-1" />
                              Delete
                            </button>
                          </div>
                          <Link
                            to={`/meals/${review._id}`}
                            className="text-xs text-purple-600 hover:text-purple-900 bg-purple-50 px-2 py-1 rounded-md flex items-center"
                          >
                            <Eye size={12} className="mr-1" />
                            View
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 text-yellow-600 mb-4">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No reviews found
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              {searchQuery
                ? `No reviews matching "${searchQuery}" were found.`
                : "You haven't written any reviews yet. Try some meals and share your thoughts!"}
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

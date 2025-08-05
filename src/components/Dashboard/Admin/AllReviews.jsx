import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Search,
  Star,
  ThumbsUp,
  MessageSquare,
  Eye,
  Trash2,
  Calendar,
} from "lucide-react";
import Swal from "sweetalert2";

const AllReviews = () => {
  const [sortBy, setSortBy] = useState("likes");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  // Use TanStack Query to fetch reviews
  const {
    data: reviews = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["reviews", sortBy],
    queryFn: async () => {
      try {
        const response = await axios.get(`/meals/reviews`);
        return Array.isArray(response.data) ? response.data : [];
      } catch (error) {
        console.error("Error fetching reviews:", error);
        return []; // Return empty array in case of error
      }
    },
  });

  console.log(reviews);

  // Filter reviews based on search term
  useEffect(() => {
    if (reviews.length > 0) {
      const filtered = reviews.filter(
        (review) =>
          review.meal_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.review_text.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredReviews(filtered);
    } else {
      setFilteredReviews([]);
    }
  }, [reviews, searchTerm]);

  // Handle sorting
  const handleSort = (field) => {
    setSortBy(field);
  };

  // Handle review deletion
  const handleDelete = (reviewId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Here you would make the API call to delete the review
        console.log(`Delete review with ID: ${reviewId}`);

        // Simulate successful deletion
        Swal.fire("Deleted!", "The review has been deleted.", "success");

        // Refetch the data
        refetch();
      }
    });
  };

  // Handle view review details
  const handleView = (review) => {
    setSelectedReview(review);
    setIsModalOpen(true);
  };

  // Generate random placeholder data for demo
  const demoReviews = [
    {
      id: 1,
      meal_title: "Grilled Chicken Salad",
      user_name: "John Doe",
      user_image: "/placeholder.svg?height=40&width=40",
      review_text:
        "This meal was absolutely delicious! The chicken was perfectly cooked and the vegetables were fresh.",
      rating: 4.5,
      likes: 24,
      reviews_count: 8,
      date: "2023-05-15",
    },
    {
      id: 2,
      meal_title: "Vegetarian Pasta",
      user_name: "Sarah Johnson",
      user_image: "/placeholder.svg?height=40&width=40",
      review_text:
        "The pasta was cooked to perfection and the sauce was flavorful. Would definitely order again!",
      rating: 5,
      likes: 36,
      reviews_count: 12,
      date: "2023-05-10",
    },
    {
      id: 3,
      meal_title: "Beef Stir Fry",
      user_name: "Michael Brown",
      user_image: "/placeholder.svg?height=40&width=40",
      review_text:
        "The beef was a bit tough, but the flavors were good. The vegetables were fresh and crisp.",
      rating: 3.5,
      likes: 15,
      reviews_count: 6,
      date: "2023-05-08",
    },
    {
      id: 4,
      meal_title: "Salmon with Roasted Vegetables",
      user_name: "Emily Wilson",
      user_image: "/placeholder.svg?height=40&width=40",
      review_text:
        "The salmon was cooked perfectly and the vegetables were seasoned well. A healthy and delicious meal!",
      rating: 4.8,
      likes: 42,
      reviews_count: 14,
      date: "2023-05-05",
    },
    {
      id: 5,
      meal_title: "Chicken Curry",
      user_name: "David Lee",
      user_image: "/placeholder.svg?height=40&width=40",
      review_text:
        "The curry had a good balance of spices and the chicken was tender. Would recommend!",
      rating: 4.2,
      likes: 28,
      reviews_count: 9,
      date: "2023-05-03",
    },
    {
      id: 6,
      meal_title: "Vegetable Soup",
      user_name: "Lisa Garcia",
      user_image: "/placeholder.svg?height=40&width=40",
      review_text: "The soup was hearty and flavorful. Perfect for a cold day!",
      rating: 4,
      likes: 20,
      reviews_count: 7,
      date: "2023-05-01",
    },
  ];

  // Use demo data if no reviews are available
  const displayReviews =
    Array.isArray(filteredReviews) && filteredReviews.length > 0
      ? filteredReviews
      : Array.isArray(reviews) && reviews.length > 0
      ? reviews
      : demoReviews;

  // Render star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          className="w-4 h-4 fill-yellow-400 text-yellow-400"
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="w-4 h-4 text-yellow-400" />
          <Star
            className="absolute top-0 left-0 w-4 h-4 fill-yellow-400 text-yellow-400 overflow-hidden"
            style={{ clipPath: "inset(0 50% 0 0)" }}
          />
        </div>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }

    return <div className="flex">{stars}</div>;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">All Reviews</h2>

        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search reviews..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleSort("likes")}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                sortBy === "likes"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <ThumbsUp className="h-4 w-4" />
              <span>Likes</span>
            </button>
            <button
              onClick={() => handleSort("reviews_count")}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                sortBy === "reviews_count"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              <span>Reviews</span>
            </button>
            <button
              onClick={() => handleSort("rating")}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                sortBy === "rating"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Star className="h-4 w-4" />
              <span>Rating</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Reviews</p>
              <p className="text-2xl font-bold text-gray-800">
                {displayReviews.length}
              </p>
            </div>
            <div className="bg-green-500 p-3 rounded-full">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Average Rating</p>
              <p className="text-2xl font-bold text-gray-800">
                {Array.isArray(displayReviews) && displayReviews.length > 0
                  ? (
                      displayReviews.reduce(
                        (acc, review) => acc + review.rating,
                        0
                      ) / displayReviews.length
                    ).toFixed(1)
                  : "N/A"}
              </p>
            </div>
            <div className="bg-blue-500 p-3 rounded-full">
              <Star className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Likes</p>
              <p className="text-2xl font-bold text-gray-800">
                {Array.isArray(displayReviews)
                  ? displayReviews.reduce(
                      (acc, review) => acc + review.likes,
                      0
                    )
                  : 0}
              </p>
            </div>
            <div className="bg-purple-500 p-3 rounded-full">
              <ThumbsUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">5-Star Reviews</p>
              <p className="text-2xl font-bold text-gray-800">
                {displayReviews.filter((review) => review.rating === 5).length}
              </p>
            </div>
            <div className="bg-amber-500 p-3 rounded-full">
              <Star className="h-6 w-6 text-white fill-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline">
            {" "}
            Failed to load reviews. Please try again later.
          </span>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && displayReviews.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">
            No reviews found
          </h3>
          <p className="mt-2 text-gray-500">
            There are no reviews matching your criteria.
          </p>
        </div>
      )}

      {/* Reviews List */}
      {!isLoading && !isError && displayReviews.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <img
                      src={
                        review.user_image ||
                        "/placeholder.svg?height=40&width=40"
                      }
                      alt={review.user_name}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {review.user_name}
                      </h3>
                      <div className="flex items-center gap-1">
                        {renderStars(review.rating)}
                        <span className="text-sm text-gray-500 ml-1">
                          {review.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <Calendar className="h-3 w-3" />
                    <span>{review.date}</span>
                  </div>
                </div>

                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  {review.meal_title}
                </h4>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {review.review_text}
                </p>

                <div className="flex justify-between items-center">
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1 text-gray-500">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{review.likes}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <MessageSquare className="h-4 w-4" />
                      <span>{review.reviews_count}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleView(review)}
                      className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                      aria-label="View review"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="p-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                      aria-label="Delete review"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Detail Modal */}
      {isModalOpen && selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <img
                    src={
                      selectedReview.user_image ||
                      "/placeholder.svg?height=60&width=60"
                    }
                    alt={selectedReview.user_name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {selectedReview.user_name}
                    </h3>
                    <div className="flex items-center mt-1">
                      {renderStars(selectedReview.rating)}
                      <span className="ml-2 text-gray-600">
                        {selectedReview.rating}/5
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-medium text-gray-800 mb-2">
                  Meal: {selectedReview.meal_title}
                </h4>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{selectedReview.date}</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">{selectedReview.review_text}</p>
                </div>
              </div>

              <div className="flex justify-between items-center border-t pt-4">
                <div className="flex gap-6">
                  <div className="flex items-center">
                    <ThumbsUp className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="text-gray-700">
                      {selectedReview.likes} likes
                    </span>
                  </div>
                  <div className="flex items-center">
                    <MessageSquare className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-gray-700">
                      {selectedReview.reviews_count} comments
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    handleDelete(selectedReview.id);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete Review</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllReviews;

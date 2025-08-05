import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Rating from "react-rating-stars-component";
import { useAxiosPublic } from "../../Hooks/useAxiosPublic";
import Swal from "sweetalert2";
import { useAuth } from "../../contexts/AuthContext";
import useUserData from "../../Hooks/useUserData";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import {
  Heart,
  Clock,
  User,
  ChevronLeft,
  Send,
  Share2,
  ShoppingBag,
  Info,
  MessageSquare,
} from "lucide-react";

export default function MealDetail() {
  const [reviewText, setReviewText] = useState("");
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [rating, setRating] = useState(0);
  const { id } = useParams();
  const { userData } = useUserData();
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  console.log(user);

  const {
    data: meal,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["mealDetails", id],
    queryFn: async () => {
      const response = await axiosPublic.get(`/meals/${id}`);
      return response.data;
    },
  });

  const handleLike = async () => {
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "You need to be logged in to like a meal.",
        confirmButtonColor: "#22c55e",
      });
      return;
    }
    try {
      setIsLiked(!isLiked);
      const newLikeCount = isLiked ? likeCount - 1 : likeCount + 1;
      setLikeCount(newLikeCount);

      await axiosSecure.patch(`/meals/${id}/like`, {
        likes: newLikeCount,
      });

      if (!isLiked) {
        Swal.fire({
          icon: "success",
          title: "Liked!",
          text: `You liked ${meal.title}!`,
          confirmButtonColor: "#22c55e",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch {
      // Revert UI state if request fails
      setIsLiked(!isLiked);
      setLikeCount(isLiked ? likeCount + 1 : likeCount - 1);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to like the meal. Please try again later.",
        confirmButtonColor: "#22c55e",
      });
    }
  };

  const handleRequestMeal = async () => {
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "You need to be logged in to request a meal.",
        confirmButtonColor: "#22c55e",
      });
      return;
    }
    if (userData.subscription === "Bronze") {
      Swal.fire({
        icon: "warning",
        title: "Subscription Required",
        text: "You need a package subscription to request a meal.",
        confirmButtonColor: "#22c55e",
      });
      return;
    }

    try {
      await axiosSecure.post(`/meals/${id}/request`, {
        userEmail: user.email,
        userName: user.displayName,
        mealId: id,
        status: "pending",
      });
      refetch();
      Swal.fire({
        icon: "success",
        title: "Request Sent",
        text: "Your meal request has been submitted. You will be notified once it's processed.",
        confirmButtonColor: "#22c55e",
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to send your meal request. Please try again later.",
        confirmButtonColor: "#22c55e",
      });
    }
  };

  const handleReviewSubmit = async () => {
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "You need to be logged in to submit a review.",
        confirmButtonColor: "#22c55e",
      });
      return;
    }

    if (!reviewText.trim() || rating === 0) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Review",
        text: "Please provide both a rating and review text before submitting.",
        confirmButtonColor: "#22c55e",
      });
      return;
    }

    try {
      await axiosPublic
        .post(`/meals/${id}/reviews`, {
          userName: user.displayName,
          userEmail: user.email,
          text: reviewText,
          rating: rating,
          date: new Date().toISOString(),
        })
        .then((response) => {
          if (response.data.modifiedCount > 0) {
            setReviewText("");
            setRating(0);
            refetch();
            Swal.fire({
              icon: "success",
              title: "Review Submitted",
              text: "Thank you for your review!",
              confirmButtonColor: "#22c55e",
              timer: 1500,
              showConfirmButton: false,
            });
          }
        });
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to submit your review. Please try again later.",
        confirmButtonColor: "#22c55e",
      });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: meal.title,
          text: `Check out this delicious meal: ${meal.title}`,
          url: window.location.href,
        })
        .catch((error) => console.log("Error sharing", error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      Swal.fire({
        icon: "success",
        title: "Link Copied!",
        text: "Meal link copied to clipboard",
        confirmButtonColor: "#22c55e",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  useEffect(() => {
    if (meal) {
      setLikeCount(meal.likes || 0);
      // Check if user has already liked this meal (this would require backend support)
      // For now, we'll just use a placeholder
      setIsLiked(false);
    }
  }, [meal]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate time since post
  const getTimeSince = (dateString) => {
    if (!dateString) return "Recently";

    const now = new Date();
    const postDate = new Date(dateString);
    const diffInSeconds = Math.floor((now - postDate) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 31536000)
      return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    return `${Math.floor(diffInSeconds / 31536000)} years ago`;
  };

  // Mock nutritional information (replace with actual data when available)
  const nutritionalInfo = {
    calories: 450,
    protein: 22,
    carbs: 48,
    fat: 18,
    fiber: 6,
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="relative w-20 h-20">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-t-green-500 rounded-full animate-spin"></div>
        </div>
        <p className="ml-4 text-gray-600 font-medium">
          Loading meal details...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
        <div className="text-red-500 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Error Loading Meal
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          We couldn&apos;t load the meal details. Please try again later.
        </p>
        <Link
          to="/meals"
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors"
        >
          Back to Meals
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Back Navigation */}
      <div className="container mx-auto px-4 py-4">
        <Link
          to="/meals"
          className="inline-flex items-center text-green-500 hover:text-green-600 transition-colors"
        >
          <ChevronLeft size={20} />
          <span className="ml-1">Back to Meals</span>
        </Link>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            {/* Image */}
            <div className="w-full md:w-1/2 relative">
              <div className="w-full h-80 rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={meal.image || "/placeholder.svg"}
                  alt={meal.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute top-4 right-4 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                {meal.category}
              </div>
            </div>

            {/* Details */}
            <div className="w-full md:w-1/2">
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                {meal.title}
              </h1>

              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  <Rating
                    count={5}
                    size={20}
                    value={Number(meal.rating.toFixed(1)) || 0}
                    edit={false}
                    activeColor="#ffd700"
                  />
                  <span className="ml-2 text-yellow-400 font-medium">
                    {meal.rating || "No Rating"}
                  </span>
                </div>
                <span className="mx-2 text-gray-400">•</span>
                <span className="text-gray-300">
                  {meal.reviews?.length || 0} reviews
                </span>
              </div>

              <div className="flex items-center text-gray-300 mb-6">
                <Clock size={16} className="mr-1" />
                <span className="text-sm">{getTimeSince(meal.postTime)}</span>
                <span className="mx-2">•</span>
                <User size={16} className="mr-1" />
                <span className="text-sm">
                  By {meal.distributorName || "Unknown Chef"}
                </span>
              </div>

              <div className="flex flex-wrap gap-3 mb-6">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                    isLiked
                      ? "bg-red-500 text-white"
                      : "bg-white/10 hover:bg-white/20 text-white"
                  }`}
                >
                  <Heart size={18} className={isLiked ? "fill-white" : ""} />
                  <span>
                    {likeCount} {likeCount === 1 ? "Like" : "Likes"}
                  </span>
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
                >
                  <Share2 size={18} />
                  <span>Share</span>
                </button>

                <button
                  onClick={handleRequestMeal}
                  disabled={meal?.requests?.some(
                    (request) => request.userEmail === user?.email
                  )}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                    meal?.requests?.some(
                      (request) => request.userEmail === user?.email
                    )
                      ? "bg-gray-500 text-white cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600 text-white"
                  }`}
                >
                  <ShoppingBag size={18} />
                  <span>
                    {meal?.requests?.some(
                      (request) => request.userEmail === user?.email
                    )
                      ? "Request Sent"
                      : "Request Meal"}
                  </span>
                </button>
              </div>

              {!user && (
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6 flex items-start">
                  <Info
                    size={20}
                    className="text-yellow-400 mr-2 flex-shrink-0 mt-0.5"
                  />
                  <p className="text-gray-300 text-sm">
                    <span className="font-medium text-white">
                      Login required:
                    </span>{" "}
                    You need to be logged in to like, request, or review this
                    meal.
                  </p>
                </div>
              )}

              {user && userData?.subscription === "Bronze" && (
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6 flex items-start">
                  <Info
                    size={20}
                    className="text-yellow-400 mr-2 flex-shrink-0 mt-0.5"
                  />
                  <p className="text-gray-300 text-sm">
                    <span className="font-medium text-white">
                      Subscription required:
                    </span>{" "}
                    Upgrade your subscription to request this meal.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="container mx-auto px-4 py-8">
        <div className="border-b border-gray-200 mb-8">
          <div className="flex overflow-x-auto hide-scrollbar">
            <button
              onClick={() => setActiveTab("description")}
              className={`px-6 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                activeTab === "description"
                  ? "border-green-500 text-green-500"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab("ingredients")}
              className={`px-6 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                activeTab === "ingredients"
                  ? "border-green-500 text-green-500"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Ingredients
            </button>
            <button
              onClick={() => setActiveTab("nutrition")}
              className={`px-6 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                activeTab === "nutrition"
                  ? "border-green-500 text-green-500"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Nutrition
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`px-6 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                activeTab === "reviews"
                  ? "border-green-500 text-green-500"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Reviews ({meal.reviews?.length || 0})
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mb-12">
          {/* Description Tab */}
          {activeTab === "description" && (
            <div className="animate-fadeIn">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                About This Meal
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {meal.description || "No description available for this meal."}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Details
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium text-gray-800">
                        {meal.category || "Not specified"}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Distributor:</span>
                      <span className="font-medium text-gray-800">
                        {meal.distributorName || "Not specified"}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Post Date:</span>
                      <span className="font-medium text-gray-800">
                        {formatDate(meal.postTime)}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Rating:</span>
                      <span className="font-medium text-gray-800">
                        {meal.rating.toFixed(1) || "No ratings yet"}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-medium text-green-500">
                        ${meal.price?.toFixed(2) || "N/A"}
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Why You&apos;ll Love It
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="bg-green-100 rounded-full p-1 mr-3 mt-0.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-green-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="text-gray-600">
                        Prepared by expert chefs
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-green-100 rounded-full p-1 mr-3 mt-0.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-green-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="text-gray-600">
                        Made with fresh ingredients
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-green-100 rounded-full p-1 mr-3 mt-0.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-green-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="text-gray-600">
                        Balanced nutritional profile
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-green-100 rounded-full p-1 mr-3 mt-0.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-green-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="text-gray-600">
                        Satisfying portion size
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Ingredients Tab */}
          {activeTab === "ingredients" && (
            <div className="animate-fadeIn">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Ingredients
              </h2>

              {meal.ingredients ? (
                <div className="bg-gray-50 rounded-xl p-6">
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {meal.ingredients.split(",").map((ingredient, index) => (
                      <li key={index} className="flex items-start">
                        <div className="bg-green-100 rounded-full p-1 mr-3 mt-0.5">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-green-500"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          {ingredient.trim()}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-gray-600">
                  No ingredient information available for this meal.
                </p>
              )}

              <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Info className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      <span className="font-medium">Allergy Information:</span>{" "}
                      Please contact our staff for detailed allergy information.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Nutrition Tab */}
          {activeTab === "nutrition" && (
            <div className="animate-fadeIn">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Nutritional Information
              </h2>

              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                  <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                    <div className="text-2xl font-bold text-green-500 mb-1">
                      {nutritionalInfo.calories}
                    </div>
                    <div className="text-gray-500 text-sm">Calories</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                    <div className="text-2xl font-bold text-green-500 mb-1">
                      {nutritionalInfo.protein}g
                    </div>
                    <div className="text-gray-500 text-sm">Protein</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                    <div className="text-2xl font-bold text-green-500 mb-1">
                      {nutritionalInfo.carbs}g
                    </div>
                    <div className="text-gray-500 text-sm">Carbs</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                    <div className="text-2xl font-bold text-green-500 mb-1">
                      {nutritionalInfo.fat}g
                    </div>
                    <div className="text-gray-500 text-sm">Fat</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                    <div className="text-2xl font-bold text-green-500 mb-1">
                      {nutritionalInfo.fiber}g
                    </div>
                    <div className="text-gray-500 text-sm">Fiber</div>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 mb-6">
                This nutritional information is an estimate and may vary based
                on portion size and preparation methods.
              </p>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Health Benefits
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="bg-green-100 rounded-full p-1 mr-3 mt-0.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-green-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">
                        Rich in protein
                      </span>
                      <p className="text-gray-600 text-sm">
                        Helps build and repair tissues, supports immune
                        function, and promotes satiety.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-green-100 rounded-full p-1 mr-3 mt-0.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-green-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">
                        Good source of fiber
                      </span>
                      <p className="text-gray-600 text-sm">
                        Promotes digestive health, helps maintain healthy
                        cholesterol levels, and supports blood sugar control.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-green-100 rounded-full p-1 mr-3 mt-0.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-green-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">
                        Essential vitamins and minerals
                      </span>
                      <p className="text-gray-600 text-sm">
                        Contains various micronutrients that support overall
                        health and wellbeing.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === "reviews" && (
            <div className="animate-fadeIn">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Customer Reviews
              </h2>

              {/* Review Form */}
              {user && (
                <div className="bg-gray-50 rounded-xl p-6 mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Write a Review
                  </h3>

                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Your Rating
                    </label>
                    <Rating
                      count={5}
                      size={30}
                      value={rating}
                      onChange={(newRating) => setRating(newRating)}
                      activeColor="#ffd700"
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="review"
                      className="block text-gray-700 text-sm font-medium mb-2"
                    >
                      Your Review
                    </label>
                    <textarea
                      id="review"
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Share your experience with this meal..."
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                    ></textarea>
                  </div>

                  <button
                    onClick={handleReviewSubmit}
                    className="flex items-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Send size={18} className="mr-2" />
                    Submit Review
                  </button>
                </div>
              )}

              {/* Reviews List */}
              {meal.reviews && meal.reviews.length > 0 ? (
                <div className="space-y-6">
                  {meal.reviews.map((review, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-start">
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-500 font-bold mr-3">
                            {review.userName
                              ? review.userName.charAt(0).toUpperCase()
                              : "U"}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800">
                              {review.userName || "Anonymous"}
                            </h4>
                            {review.rating && (
                              <div className="flex items-center mt-1">
                                <Rating
                                  count={5}
                                  size={16}
                                  value={Number(review.rating) || 0}
                                  edit={false}
                                  activeColor="#ffd700"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">
                          {review.date ? formatDate(review.date) : ""}
                        </span>
                      </div>
                      <p className="text-gray-600">{review.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <MessageSquare
                    size={48}
                    className="mx-auto text-gray-300 mb-4"
                  />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No Reviews Yet
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Be the first to review this meal!
                  </p>
                  {!user && (
                    <Link
                      to="/auth/login"
                      className="text-green-500 hover:text-green-600 font-medium"
                    >
                      Login to Write a Review
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Related Meals Section */}
        {/* <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            You Might Also Like
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 group"
              >
                <div className="relative overflow-hidden h-48">
                  <img
                    src={`/placeholder.svg?height=200&width=300&text=Related${item}`}
                    alt={`Related Meal ${item}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    {["Breakfast", "Lunch", "Dinner", "Dessert"][item - 1]}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-800 group-hover:text-green-600 transition-colors">
                    Related Meal Example {item}
                  </h3>
                  <div className="flex items-center mt-2 mb-3">
                    <Star
                      size={16}
                      className="text-yellow-500 fill-yellow-500"
                    />
                    <span className="ml-1 text-sm text-gray-600">
                      4.{item} (24 reviews)
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-green-500">
                      ${(8.99 + item).toFixed(2)}
                    </span>
                    <Link
                      to={`/meals/${item}`}
                      className="text-sm text-gray-600 hover:text-green-600"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
}

import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useAuth } from "../../contexts/AuthContext";
import {
  Heart,
  Star,
  Clock,
  Filter,
  ChevronDown,
  Info,
  Search,
  Calendar,
  MessageSquare,
  X,
  Loader2,
} from "lucide-react";
import { debounce } from "lodash";

export default function UpcomingMeals() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const axiosSecure = useAxiosSecure();
  const { user, loading } = useAuth();

  const { data: userType = {} } = useQuery({
    queryKey: ["userType", user?.email],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user?.email}`);
      return res.data;
    },
  });

  const {
    data: upcomingMeals = [],
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["meals", activeCategory, debouncedSearchQuery],
    queryFn: async () => {
      setIsSearching(true);
      try {
        const res = await axiosSecure.get("/upcoming-meals", {
          params: {
            category: activeCategory !== "all" ? activeCategory : undefined,
            search: debouncedSearchQuery || undefined,
          },
        });
        return res.data;
      } finally {
        setIsSearching(false);
      }
    },
  });

  // Debounce search input to prevent too many API calls
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((query) => {
      setDebouncedSearchQuery(query);
    }, 500),
    []
  );

  // Update debounced search when searchQuery changes
  useEffect(() => {
    debouncedSearch(searchQuery);
    // Don't include debouncedSearch in dependencies as it would create a new debounce function on each render
  }, [searchQuery, debouncedSearch]);

  const handleLike = async (meal) => {
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "You need to be logged in to like meals.",
        confirmButtonColor: "#22c55e",
      });
      return;
    }

    if (["Silver", "Gold", "Platinum"].includes(userType.subscription)) {
      try {
        const response = await axiosSecure.patch(
          `/upcoming-meals/${meal._id}/like`,
          {
            userEmail: user.email,
          }
        );

        if (response.data.modifiedCount > 0) {
          refetch();
          Swal.fire({
            icon: "success",
            title: "Liked!",
            text: `You liked ${meal.title}.`,
            confirmButtonColor: "#22c55e",
            timer: 1500,
            showConfirmButton: false,
          });
        }
      } catch (error) {
        if (error.response?.status === 400) {
          Swal.fire({
            icon: "warning",
            title: "Already Liked",
            text: "You have already liked this meal.",
            confirmButtonColor: "#22c55e",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Something went wrong. Please try again later.",
            confirmButtonColor: "#22c55e",
          });
        }
      }
    } else {
      Swal.fire({
        icon: "info",
        title: "Premium Feature",
        text: "Only Silver, Gold, and Platinum subscribers can like upcoming meals.",
        confirmButtonText: "Upgrade Now",
        confirmButtonColor: "#22c55e",
        showCancelButton: true,
        cancelButtonText: "Maybe Later",
      });
    }
  };

  // Check if user has already liked a meal
  const hasUserLikedMeal = (meal) => {
    return meal.likedBy?.includes(user?.email);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Coming Soon";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get all unique categories from meals
  const categories = [
    "all",
    ...new Set(upcomingMeals.map((meal) => meal.category).filter(Boolean)),
  ];

  // Filter meals based on search and category
  const filteredMeals = upcomingMeals.filter((meal) => {
    const matchesCategory =
      activeCategory === "all" || meal.category === activeCategory;
    const matchesSearch =
      !debouncedSearchQuery ||
      meal.title?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      meal.ingredients
        ?.toLowerCase()
        .includes(debouncedSearchQuery.toLowerCase()) ||
      meal.distributorName
        ?.toLowerCase()
        .includes(debouncedSearchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Highlight search matches in text
  const highlightMatch = (text, query) => {
    if (!query || !text) return text;

    const regex = new RegExp(
      `(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi"
    );
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark
          key={index}
          className="bg-yellow-200 text-gray-800 px-0.5 rounded"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
  };

  // if (userLoading || mealsLoading) {
  //   return (

  //   );
  // }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="container mx-auto px-4 py-12 sm:py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Upcoming Meals
            </h1>
            <p className="text-gray-300 text-lg mb-8">
              Preview and influence our future menu by liking meals you&apos;d
              like to see
            </p>

            {/* Real-time Search Bar */}
            <div className="relative max-w-md mx-auto mb-8">
              <input
                type="text"
                placeholder="Search upcoming meals..."
                className="w-full px-5 py-3 pl-12 pr-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />

              {/* Show spinner when searching */}
              {isSearching || isFetching ? (
                <Loader2
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 animate-spin"
                  size={20}
                />
              ) : searchQuery ? (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              ) : null}
            </div>

            {/* Search Status */}
            {debouncedSearchQuery && (
              <div className="text-gray-300 text-sm mb-6">
                {isSearching || isFetching ? (
                  <span className="flex items-center justify-center">
                    <Loader2 size={16} className="animate-spin mr-2" />
                    Searching for &quot;{debouncedSearchQuery}&quot;...
                  </span>
                ) : (
                  <span>
                    Found {filteredMeals.length} result
                    {filteredMeals.length !== 1 ? "s" : ""} for &quot;
                    {debouncedSearchQuery}&quot;
                  </span>
                )}
              </div>
            )}

            {/* Premium User Info */}
            {user &&
              !["Silver", "Gold", "Platinum"].includes(
                userType.subscription
              ) && (
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 max-w-2xl mx-auto">
                  <div className="flex items-start">
                    <Info
                      size={20}
                      className="text-yellow-400 mr-3 flex-shrink-0 mt-0.5"
                    />
                    <p className="text-gray-300 text-sm text-left">
                      <span className="font-medium text-white">
                        Premium Feature:
                      </span>{" "}
                      Upgrade to a Silver, Gold, or Platinum plan to like
                      upcoming meals and influence our menu!
                    </p>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        {/* Category Filters */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Browse Upcoming Meals
              {filteredMeals.length > 0 && (
                <span className="text-gray-500 text-lg font-normal ml-2">
                  ({filteredMeals.length})
                </span>
              )}
            </h2>

            {/* Mobile Filter Button */}
            <button
              className="md:hidden flex items-center justify-center space-x-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-full"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Filter size={18} />
              <span>Filters</span>
              <ChevronDown
                size={16}
                className={`transform transition-transform ${
                  isFilterOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {/* Desktop Category Pills */}
          <div className="hidden md:flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          {/* Mobile Filters (Collapsible) */}
          {isFilterOpen && (
            <div className="md:hidden mt-4 bg-white p-4 rounded-xl shadow-lg border border-gray-100 animate-slideDown">
              <h3 className="font-medium text-gray-800 mb-3">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setActiveCategory(category);
                      setIsFilterOpen(false);
                    }}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      activeCategory === category
                        ? "bg-green-500 text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Active Filters */}
          {(activeCategory !== "all" || debouncedSearchQuery) && (
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="text-sm text-gray-600 mr-1 py-1">
                Active filters:
              </span>

              {activeCategory !== "all" && (
                <button
                  onClick={() => setActiveCategory("all")}
                  className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200 transition-colors"
                >
                  {activeCategory.charAt(0).toUpperCase() +
                    activeCategory.slice(1)}
                  <X size={14} />
                </button>
              )}

              {debouncedSearchQuery && (
                <button
                  onClick={clearSearch}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
                >
                  Search: {debouncedSearchQuery}
                  <X size={14} />
                </button>
              )}

              <button
                onClick={() => {
                  setActiveCategory("all");
                  clearSearch();
                }}
                className="text-sm text-gray-500 hover:text-gray-700 py-1 ml-1"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Meals Grid */}
        {isSearching && filteredMeals.length === 0 ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 size={30} className="text-green-500 animate-spin mr-3" />
            <p className="text-gray-600">Searching for meals...</p>
          </div>
        ) : filteredMeals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMeals.map((meal, index) => (
              <div
                key={meal._id || index}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 group animate-fadeIn"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={meal.image || "/placeholder.svg"}
                    alt={meal.title}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    {meal.category || "Uncategorized"}
                  </div>

                  {/* Coming Soon Badge */}
                  <div className="absolute top-3 left-3 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                    <Calendar size={12} className="mr-1" />
                    <span>Coming Soon</span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-gray-800 line-clamp-1 group-hover:text-green-600 transition-colors">
                      {debouncedSearchQuery
                        ? highlightMatch(meal.title, debouncedSearchQuery)
                        : meal.title}
                    </h3>
                    {meal.rating && (
                      <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
                        <Star
                          size={16}
                          className="text-yellow-500 fill-yellow-500"
                        />
                        <span className="ml-1 text-sm font-medium">
                          {meal.rating || meal.retting}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center text-gray-500 text-sm mb-3">
                    <Clock size={14} className="mr-1" />
                    <span>{formatDate(meal.postTime)}</span>
                  </div>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {meal.ingredients ? (
                      <span>
                        <span className="font-medium">Ingredients:</span>{" "}
                        {debouncedSearchQuery
                          ? highlightMatch(
                              meal.ingredients,
                              debouncedSearchQuery
                            )
                          : meal.ingredients}
                      </span>
                    ) : (
                      "A delicious upcoming meal prepared with fresh ingredients by our expert chefs."
                    )}
                  </p>

                  <div className="flex items-center text-gray-500 text-sm mb-4">
                    <span className="font-medium">By:</span>
                    <span className="ml-1">
                      {debouncedSearchQuery
                        ? highlightMatch(
                            meal.distributorName || "Hostel Pro Chef",
                            debouncedSearchQuery
                          )
                        : meal.distributorName || "Hostel Pro Chef"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-lg font-bold text-green-500">
                      $
                      {typeof meal.price === "number"
                        ? meal.price.toFixed(2)
                        : meal.price}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleLike(meal)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-colors ${
                          hasUserLikedMeal(meal)
                            ? "bg-red-50 text-red-500"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                        disabled={
                          !user ||
                          (!["Silver", "Gold", "Platinum"].includes(
                            userType.subscription
                          ) &&
                            !hasUserLikedMeal(meal))
                        }
                      >
                        <Heart
                          size={16}
                          className={
                            hasUserLikedMeal(meal) ? "fill-red-500" : ""
                          }
                        />
                        <span>{meal.likes || 0}</span>
                      </button>

                      <button
                        className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                        onClick={() => {
                          Swal.fire({
                            title: meal.title,
                            html: `
                              <div class="text-left">
                                <p class="mb-3">${
                                  meal.description ||
                                  "No description available."
                                }</p>
                                <p class="text-sm text-gray-500 mb-2">Coming soon to our menu!</p>
                                
                                <h3 class="font-semibold mt-4 mb-2">Ingredients:</h3>
                                <p>${
                                  meal.ingredients ||
                                  "Ingredients information will be available soon."
                                }</p>
                                
                                <h3 class="font-semibold mt-4 mb-2">Reviews:</h3>
                                <p>${
                                  meal.reviews?.length > 0
                                    ? `${meal.reviews.length} reviews available`
                                    : "No reviews yet."
                                }</p>
                              </div>
                            `,
                            imageUrl: meal.image,
                            imageHeight: 200,
                            imageAlt: meal.title,
                            confirmButtonColor: "#22c55e",
                          });
                        }}
                      >
                        <MessageSquare size={16} />
                        <span>{meal.reviews?.length || 0}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-xl">
            <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Upcoming Meals Found
            </h3>
            <p className="text-gray-500 mb-6">
              {debouncedSearchQuery
                ? `We couldn't find any upcoming meals matching "${debouncedSearchQuery}".`
                : "There are no upcoming meals at the moment. Check back later!"}
            </p>
            {(debouncedSearchQuery || activeCategory !== "all") && (
              <button
                onClick={() => {
                  clearSearch();
                  setActiveCategory("all");
                }}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

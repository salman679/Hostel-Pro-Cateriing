import { useState, useEffect, useRef, useCallback } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useAxiosPublic } from "../../Hooks/useAxiosPublic";
import InfiniteScroll from "react-infinite-scroller";
import {
  Filter,
  ChevronDown,
  Star,
  ArrowRight,
  Heart,
  X,
  Search,
} from "lucide-react";
import SearchBar from "../Sheard/SearchBar";

const MealsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeView, setActiveView] = useState("grid");
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );
  const searchInputRef = useRef(null);
  const axiosPublic = useAxiosPublic();

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 768) {
        setIsFilterOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Focus search input on mount
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  // Fetch meals with pagination using infiniteQuery
  const { data, fetchNextPage, hasNextPage, isLoading, isError, refetch } =
    useInfiniteQuery({
      queryKey: ["meals", searchQuery, category, priceRange],
      queryFn: async ({ pageParam = 1 }) => {
        const response = await axiosPublic("/all-meals", {
          params: {
            search: searchQuery,
            category: category,
            minPrice: priceRange.min,
            maxPrice: priceRange.max,
            page: pageParam,
            limit: 6, // Load 6 meals per request
          },
        });

        return response.data;
      },
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length === 6 ? allPages.length + 1 : undefined;
      },
    });

  // Flatten paginated meals data
  const meals = data?.pages.flat() || [];

  const handleSearch = (e) => {
    e.preventDefault();
    refetch();
  };

  const handleCategoryChange = (selectedCategory) => {
    setCategory(selectedCategory === category ? "" : selectedCategory);
    setTimeout(() => refetch(), 100);
  };

  const handlePriceRangeChange = (e) => {
    const { name, value } = e.target;
    setPriceRange((prev) => ({ ...prev, [name]: value }));
  };

  const applyPriceFilter = () => {
    refetch();
    if (windowWidth < 768) {
      setIsFilterOpen(false);
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setCategory("");
    setPriceRange({ min: 0, max: 1000 });
    setTimeout(() => refetch(), 100);
  };

  // Categories array
  const categories = ["Breakfast", "Lunch", "Dinner", "Dessert"];

  // Fetch featured meal from backend
  const [featuredMeal, setFeaturedMeal] = useState(null);
  const [featuredMealLoading, setFeaturedMealLoading] = useState(true);

  const fetchFeaturedMeal = useCallback(async () => {
    try {
      const response = await axiosPublic.get("/featured-meal");
      setFeaturedMeal(response.data);
    } catch (error) {
      console.error("Error fetching featured meal:", error);
      // Fallback to mock data if fetch fails
      setFeaturedMeal({
        _id: "featured123",
        title: "Chef's Special Mediterranean Platter",
        description:
          "A delightful combination of hummus, falafel, tabbouleh, and warm pita bread. Served with our signature tahini sauce and pickled vegetables.",
        image: "https://i.ibb.co.com/Pjxy4gj/p0c0tpbh-jpg.webp",
        price: 24.99,
        rating: 4.9,
        category: "Lunch",
        prepTime: "25 mins",
        calories: 650,
      });
    } finally {
      setFeaturedMealLoading(false);
    }
  }, []);

  // Initial fetch - show first meal immediately
  useEffect(() => {
    fetchFeaturedMeal();
  }, [fetchFeaturedMeal]);

  // Auto change featured meal every 10 seconds (first change after 10 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setFeaturedMealLoading(true);
      fetchFeaturedMeal();
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchFeaturedMeal]);

  return (
    <div className="min-h-screen bg-white">
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes slideInLeft {
            from { opacity: 0; transform: translateX(-20px); }
            to { opacity: 1; transform: translateX(0); }
          }
          
          @keyframes slideInRight {
            from { opacity: 0; transform: translateX(20px); }
            to { opacity: 1; transform: translateX(0); }
          }
          
          @keyframes slideInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .animate-fade-in {
            animation: fadeIn 0.8s ease-out forwards;
          }
          
          .animate-slide-in-left {
            animation: slideInLeft 0.5s ease-out forwards;
          }
          
          .animate-slide-in-right {
            animation: slideInRight 0.5s ease-out forwards;
          }
          
          .animate-slide-in-up {
            animation: slideInUp 0.5s ease-out forwards;
          }
        `}
      </style>
      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-700 to-teal-800">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
          <div
            className="w-full h-full bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Ccircle cx=%2250%22 cy=%2250%22 r=%221%22 fill=%22%23ffffff%22/%3E%3C/svg%3E')] bg-repeat"
            style={{ backgroundSize: "20px 20px" }}
          ></div>
        </div>

        <div className="container relative z-10 px-4 py-16 mx-auto sm:py-24">
          <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
            {/* Left Content - Text and Search */}
            <div className="w-full text-center lg:w-1/2 lg:text-left">
              <h1 className="mb-6 text-4xl font-extrabold leading-tight text-white sm:text-5xl md:text-6xl">
                Discover <span className="text-yellow-300">Delicious</span>{" "}
                Meals
              </h1>
              <p className="max-w-lg mx-auto mb-10 text-lg text-emerald-100 lg:mx-0">
                Explore our diverse menu featuring fresh, locally-sourced
                ingredients and chef-inspired creations.
              </p>

              {featuredMealLoading && (
                <div className="flex justify-center lg:justify-start">
                  <div className="w-32 h-4 bg-emerald-600 rounded-lg animate-pulse"></div>
                </div>
              )}
              <p className="max-w-lg mx-auto mb-10 text-lg text-emerald-100 lg:mx-0">
                Find your favorite meals from our extensive collection. Filter
                by category, price, or search for specific dishes.
              </p>

              {/* Enhanced Search Bar */}
              <div className="relative max-w-xl mx-auto mb-10 lg:mx-0">
                <SearchBar
                  placeholder="Search meals by name, ingredient, or category..."
                  searchTerm={searchQuery}
                  onSearchChange={setSearchQuery}
                  onSubmit={handleSearch}
                  className="w-full"
                  inputClassName="w-full px-6 py-4 pl-14 text-base text-gray-800 placeholder-gray-500 border-0 rounded-full shadow-lg focus:outline-none focus:ring-4 focus:ring-amber-300/50"
                  iconClassName="text-gray-500"
                  buttonClassName="absolute right-2 top-2 text-white transition-colors bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 px-5 py-2.5 rounded-full font-semibold shadow-md hover:shadow-lg"
                />
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
                <button
                  onClick={() => handleCategoryChange("")}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                    category === ""
                      ? "bg-amber-400 text-gray-900 shadow-md"
                      : "bg-white/15 text-white hover:bg-white/25"
                  }`}
                >
                  All Meals
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                      category === cat
                        ? "bg-amber-400 text-gray-900 shadow-md"
                        : "bg-white/15 text-white hover:bg-white/25"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Content - Enhanced Featured Meal Card with Animation */}
            <div className="w-full lg:w-1/2">
              {featuredMeal && (
                <div className="relative overflow-hidden transition-all duration-500 bg-white rounded-2xl shadow-xl hover:shadow-2xl group animate-fade-in">
                  <div className="flex flex-col sm:flex-row h-64">
                    <div className="relative w-full sm:w-2/5 h-full">
                      <img
                        src={featuredMeal.image}
                        alt={featuredMeal.title}
                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4 px-3 py-1 text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-700 rounded-full animate-pulse">
                        Popular Choice
                      </div>
                    </div>
                    <div className="flex flex-col justify-between p-6 sm:w-3/5 h-full">
                      <div>
                        <div className="flex items-center mb-3">
                          <span className="px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 rounded-full animate-slide-in-left">
                            {featuredMeal.category}
                          </span>
                          <div className="flex items-center px-3 py-1.5 ml-3 rounded-full bg-amber-50 animate-slide-in-right">
                            <Star
                              size={16}
                              className="text-amber-500 fill-amber-500"
                            />
                            <span className="ml-1 text-sm font-bold text-amber-700">
                              {featuredMeal.rating || featuredMeal.likes || 0}
                            </span>
                          </div>
                        </div>
                        <h3 className="mb-3 text-xl font-bold text-gray-900 sm:text-2xl animate-slide-in-left">
                          {featuredMeal.title}
                        </h3>
                        <p className="mb-4 text-sm text-gray-600 line-clamp-2 animate-fade-in">
                          {featuredMeal.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100 animate-slide-in-up">
                        <span className="text-2xl font-bold text-emerald-600">
                          ${(featuredMeal.price || 0).toFixed(2)}
                        </span>
                        <Link
                          to={`/meals/${featuredMeal._id}`}
                          className="flex items-center px-5 py-2.5 text-sm font-bold text-white transition-colors bg-gradient-to-r from-emerald-600 to-teal-700 rounded-full hover:from-emerald-700 hover:to-teal-800"
                        >
                          View Details
                          <ArrowRight
                            size={18}
                            className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                          />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container px-4 py-12 mx-auto">
        {/* Filters and View Toggle */}
        <div className="flex flex-col items-start justify-between gap-4 mb-8 sm:flex-row sm:items-center">
          <h2 className="text-2xl font-bold text-gray-800 sm:text-3xl">
            {category ? `${category} Meals` : "All Meals"}
            {meals.length > 0 && (
              <span className="ml-2 text-lg font-normal text-gray-500">
                ({meals.length})
              </span>
            )}
          </h2>

          <div className="flex items-center gap-3">
            {/* Filter Button (Mobile) */}
            <button
              className="flex items-center justify-center px-4 py-2 space-x-1 text-gray-700 bg-gray-100 rounded-full sm:hidden"
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

            {/* View Toggle */}
            <div className="hidden p-1 bg-gray-100 rounded-full sm:flex">
              <button
                onClick={() => setActiveView("grid")}
                className={`p-2 rounded-full ${
                  activeView === "grid"
                    ? "bg-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                aria-label="Grid view"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                </svg>
              </button>
              <button
                onClick={() => setActiveView("list")}
                className={`p-2 rounded-full ${
                  activeView === "list"
                    ? "bg-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                aria-label="List view"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="8" y1="6" x2="21" y2="6"></line>
                  <line x1="8" y1="12" x2="21" y2="12"></line>
                  <line x1="8" y1="18" x2="21" y2="18"></line>
                  <line x1="3" y1="6" x2="3.01" y2="6"></line>
                  <line x1="3" y1="12" x2="3.01" y2="12"></line>
                  <line x1="3" y1="18" x2="3.01" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Desktop Price Filter */}
            <div className="items-center hidden px-4 py-2 bg-gray-100 rounded-full sm:flex">
              <span className="mr-2 text-sm text-gray-700">Price:</span>
              <input
                type="number"
                placeholder="Min"
                name="min"
                className="w-16 text-sm text-gray-700 bg-transparent border-b border-gray-300 focus:border-green-500 focus:outline-none"
                value={priceRange.min}
                onChange={handlePriceRangeChange}
              />
              <span className="mx-2 text-gray-500">-</span>
              <input
                type="number"
                placeholder="Max"
                name="max"
                className="w-16 text-sm text-gray-700 bg-transparent border-b border-gray-300 focus:border-green-500 focus:outline-none"
                value={priceRange.max}
                onChange={handlePriceRangeChange}
              />
              <button
                onClick={applyPriceFilter}
                className="p-1 ml-2 text-white transition-colors bg-green-500 rounded-full hover:bg-green-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 10 4 15 9 20"></polyline>
                  <path d="M20 4v7a4 4 0 0 1-4 4H4"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Filters (Collapsible) */}
        {isFilterOpen && (
          <div className="p-4 mb-8 bg-white border border-gray-100 shadow-lg sm:hidden rounded-xl animate-slideDown">
            <div className="space-y-4">
              {/* Price Range Filter */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Price Range
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    name="min"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={priceRange.min}
                    onChange={handlePriceRangeChange}
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    name="max"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={priceRange.max}
                    onChange={handlePriceRangeChange}
                  />
                </div>
                <div className="flex justify-between mt-4">
                  <button
                    onClick={applyPriceFilter}
                    className="px-4 py-2 text-sm text-white transition-colors bg-green-500 rounded-lg hover:bg-green-600"
                  >
                    Apply Filters
                  </button>
                  <button
                    onClick={resetFilters}
                    className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-green-600"
                  >
                    <X size={16} className="mr-1" /> Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters */}
        {(category || priceRange.min > 0 || priceRange.max < 1000) && (
          <div className="flex flex-wrap gap-2 mb-8">
            <span className="mr-2 text-sm text-gray-600">Active filters:</span>
            {category && (
              <span className="inline-flex items-center px-3 py-1 text-sm text-green-700 bg-green-100 rounded-full">
                {category}
                <button
                  onClick={() => {
                    setCategory("");
                    setTimeout(() => refetch(), 100);
                  }}
                  className="ml-2 text-green-700 hover:text-green-900"
                >
                  <X size={14} />
                </button>
              </span>
            )}
            {(priceRange.min > 0 || priceRange.max < 1000) && (
              <span className="inline-flex items-center px-3 py-1 text-sm text-green-700 bg-green-100 rounded-full">
                ${priceRange.min} - ${priceRange.max}
                <button
                  onClick={() => {
                    setPriceRange({ min: 0, max: 1000 });
                    setTimeout(() => refetch(), 100);
                  }}
                  className="ml-2 text-green-700 hover:text-green-900"
                >
                  <X size={14} />
                </button>
              </span>
            )}
          </div>
        )}

        {/* Meals List with Infinite Scroll */}
        {isLoading && meals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative w-20 h-20">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-full border-4 rounded-full border-t-green-500 animate-spin"></div>
            </div>
            <p className="mt-4 font-medium text-gray-600">
              Loading delicious meals...
            </p>
          </div>
        ) : isError ? (
          <div className="py-16 text-center bg-white border border-gray-100 shadow-sm rounded-xl">
            <div className="mb-4 text-red-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-16 h-16 mx-auto"
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
            <h3 className="mb-2 text-xl font-semibold text-gray-800">
              Failed to Load Meals
            </h3>
            <p className="mb-4 text-gray-600">
              There was an error loading the meals. Please try again.
            </p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 text-white transition-colors bg-green-500 rounded-lg hover:bg-green-600"
            >
              Try Again
            </button>
          </div>
        ) : (
          <InfiniteScroll
            pageStart={0}
            loadMore={fetchNextPage}
            hasMore={hasNextPage}
            loader={
              <div className="my-8 text-center">
                <div className="inline-block w-12 h-12 border-4 border-gray-200 rounded-full border-t-green-500 animate-spin"></div>
                <p className="mt-2 text-gray-600">Loading more meals...</p>
              </div>
            }
          >
            {meals.length > 0 ? (
              activeView === "grid" ? (
                // Grid View
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 sm:gap-8">
                  {meals.map((meal, index) => (
                    <div
                      key={meal?._id}
                      className="overflow-hidden transition-all duration-300 bg-white border border-gray-100 shadow-sm group rounded-xl hover:shadow-md animate-fadeIn"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="relative overflow-hidden">
                        <img
                          src={meal?.image || "/placeholder.svg"}
                          alt={meal?.title}
                          className="object-cover w-full h-56 transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute px-2 py-1 text-xs text-white bg-green-500 rounded-full top-3 right-3">
                          {meal?.category}
                        </div>
                        <button className="absolute p-2 text-gray-700 transition-colors rounded-full top-3 left-3 bg-white/80 backdrop-blur-sm hover:text-red-500">
                          <Heart size={18} />
                        </button>
                      </div>
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-2">
                          <h2 className="text-xl font-semibold text-gray-800 transition-colors line-clamp-1 group-hover:text-green-600">
                            {meal?.title}
                          </h2>
                          <div className="flex items-center px-2 py-1 rounded-full bg-yellow-50">
                            <Star
                              size={16}
                              className="text-yellow-500 fill-yellow-500"
                            />
                            <span className="ml-1 text-sm font-medium">
                              {meal?.rating?.toFixed(1)}
                            </span>
                          </div>
                        </div>
                        <p className="mb-4 text-sm text-gray-600 line-clamp-2">
                          {meal?.description ||
                            "A delicious meal prepared with fresh ingredients by our expert chefs."}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-green-500">
                            $
                            {typeof meal?.price === "number"
                              ? meal?.price?.toFixed(2)
                              : meal?.price}
                          </span>
                          <Link
                            to={`/meals/${meal?._id}`}
                            className="px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-300 bg-gray-100 rounded-full hover:bg-green-500 hover:text-white"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // List View
                <div className="space-y-4">
                  {meals.map((meal, index) => (
                    <div
                      key={meal?._id}
                      className="flex flex-col overflow-hidden transition-all duration-300 bg-white border border-gray-100 shadow-sm group rounded-xl hover:shadow-md sm:flex-row animate-fadeIn"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="relative w-full h-48 overflow-hidden sm:w-1/3 sm:h-auto">
                        <img
                          src={meal?.image || "/placeholder.svg"}
                          alt={meal?.title}
                          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute px-2 py-1 text-xs text-white bg-green-500 rounded-full top-3 right-3">
                          {meal?.category}
                        </div>
                        <button className="absolute p-2 text-gray-700 transition-colors rounded-full top-3 left-3 bg-white/80 backdrop-blur-sm hover:text-red-500">
                          <Heart size={18} />
                        </button>
                      </div>
                      <div className="flex flex-col justify-between flex-1 p-5">
                        <div>
                          <div className="flex items-start justify-between mb-2">
                            <h2 className="text-xl font-semibold text-gray-800 transition-colors group-hover:text-green-600">
                              {meal?.title}
                            </h2>
                            <div className="flex items-center px-2 py-1 ml-2 rounded-full bg-yellow-50">
                              <Star
                                size={16}
                                className="text-yellow-500 fill-yellow-500"
                              />
                              <span className="ml-1 text-sm font-medium">
                                {meal?.rating}
                              </span>
                            </div>
                          </div>
                          <p className="mb-4 text-sm text-gray-600">
                            {meal?.description ||
                              "A delicious meal prepared with fresh ingredients by our expert chefs."}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-green-500">
                            $
                            {typeof meal?.price === "number"
                              ? meal?.price?.toFixed(2)
                              : meal?.price}
                          </span>
                          <Link
                            to={`/meals/${meal?._id}`}
                            className="px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-300 bg-gray-100 rounded-full hover:bg-green-500 hover:text-white"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="py-16 text-center bg-white border border-gray-100 shadow-sm rounded-xl">
                <div className="mb-4 text-gray-400">
                  <Search size={48} className="mx-auto" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-800">
                  No Meals Found
                </h3>
                <p className="mb-4 text-gray-600">
                  We couldn&apos;t find any meals matching your search criteria.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 text-white transition-colors bg-green-500 rounded-lg hover:bg-green-600"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
};

export default MealsPage;

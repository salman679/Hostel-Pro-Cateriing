import { useState } from "react";
import Membership from "../components/Membership/Membership";
import SpecialOffers from "../components/SpecialOffers/SpecialOffers";
import Testimonials from "../components/Testimonials/Testimonials";
import { ArrowRight, Clock, Star } from "lucide-react";
import { Link } from "react-router-dom";
import MealsByCategory from "../components/Meals/MealsByCategory";
import SearchBar from "../components/Sheard/SearchBar";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");

  // // Smooth scroll to meals section
  // const scrollToMeals = () => {
  //   document.getElementById("meals-section")?.scrollIntoView({
  //     behavior: "smooth",
  //   });
  // };

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const handleCategoryChange = (selectedCategory) => {
    setCategory(selectedCategory === category ? "" : selectedCategory);
  };

  const categories = ["Breakfast", "Lunch", "Dinner", "Dessert"];

  // Mock data for featured meal
  const featuredMeal = {
    _id: "679bbf6451b84a49e23f159a",
    title: "Chef's Special Mediterranean Platter",
    description:
      "A delightful combination of hummus, falafel, tabbouleh, and warm pita bread. Served with our signature tahini sauce and pickled vegetables.",
    image: "https://i.ibb.co.com/Pjxy4gj/p0c0tpbh-jpg.webp",
    price: 24.99,
    rating: 4.9,
    category: "Lunch",
    prepTime: "25 mins",
    calories: 650,
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Featured Meal */}
      <div className="relative overflow-hidden text-white bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fillRule="evenodd"%3E%3Cg fill="%23ffffff" fillOpacity="0.2"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
              backgroundSize: "24px 24px",
            }}
          ></div>
        </div>

        <div className="container relative z-10 px-4 py-16 mx-auto sm:py-24">
          <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-12">
            {/* Left Content */}
            <div className="w-full text-center lg:w-1/2 lg:text-left">
              <h1 className="mb-4 text-4xl font-bold leading-tight sm:text-5xl">
                Discover <span className="text-green-400">Culinary</span>{" "}
                Excellence
              </h1>
              <p className="max-w-xl mx-auto mb-8 text-lg text-gray-300 lg:mx-0">
                Explore our diverse menu of delicious meals prepared with fresh
                ingredients by our expert chefs.
              </p>

              {/* Search Bar */}
              <div className="relative max-w-md mx-auto mb-8 lg:mx-0">
                <SearchBar
                  placeholder="Search for meals..."
                  searchTerm={searchQuery}
                  onSearchChange={setSearchQuery}
                  onSubmit={handleSearch}
                  className="w-full"
                  inputClassName="w-full px-5 py-4 pl-12 text-white placeholder-gray-400 border rounded-full bg-white/10 backdrop-blur-sm border-white/20 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                  iconClassName="text-gray-400"
                  buttonClassName="text-white transition-colors bg-green-500 rounded-full p-2 hover:bg-green-600"
                />
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap justify-center gap-2 lg:justify-start">
                <button
                  onClick={() => handleCategoryChange("")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    category === ""
                      ? "bg-green-500 text-white"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      category === cat
                        ? "bg-green-500 text-white"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Featured Meal Card */}
            <div className="w-full mt-8 lg:w-1/2 lg:mt-0">
              <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-all group">
                <div className="absolute inset-0 transition-opacity bg-black opacity-20 group-hover:opacity-10"></div>
                <img
                  src={featuredMeal.image}
                  alt={featuredMeal.title}
                  className="object-cover w-full h-64 sm:h-80"
                  onError={(e) =>
                    (e.target.src =
                      "https://i.ibb.co/com/Pjxy4gj/p0c0tpbh-jpg.webp")
                  }
                />
                <div className="absolute px-3 py-1 text-xs font-medium text-white bg-green-500 rounded-full top-4 right-4">
                  Featured
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-center mb-2">
                    <div className="flex items-center px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                      <Star
                        size={14}
                        className="text-yellow-400 fill-yellow-400"
                      />
                      <span className="ml-1 text-xs font-medium text-white">
                        {featuredMeal.rating}
                      </span>
                    </div>
                    <div className="flex items-center px-2 py-1 ml-2 rounded-full bg-white/20 backdrop-blur-sm">
                      <Clock size={14} className="text-white" />
                      <span className="ml-1 text-xs font-medium text-white">
                        {featuredMeal.prepTime}
                      </span>
                    </div>
                    <div className="flex items-center px-2 py-1 ml-2 rounded-full bg-white/20 backdrop-blur-sm">
                      <span className="text-xs font-medium text-white">
                        {featuredMeal.calories} cal
                      </span>
                    </div>
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-white sm:text-2xl">
                    {featuredMeal.title}
                  </h3>
                  <p className="mb-4 text-sm text-gray-300 line-clamp-2">
                    {featuredMeal.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-green-400">
                      ${featuredMeal.price}
                    </span>
                    <Link
                      to={`/meals/${featuredMeal._id}`}
                      className="flex items-center px-4 py-2 text-sm font-medium text-white transition-colors bg-green-500 rounded-full hover:bg-green-600"
                    >
                      View Details
                      <ArrowRight size={16} className="ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="relative">
        <Slider searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        <button
          onClick={scrollToMeals}
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full p-3 transition-all duration-300 animate-bounce hidden sm:flex"
          aria-label="Scroll to meals"
        >
          <ArrowDown size={20} />
        </button>
      </div> */}

      {/* Meals By Category Section */}
      <div id="meals-section" className="bg-white">
        <MealsByCategory />
      </div>

      {/* Special Offers Section - Enhanced */}
      <div className="bg-gray-50 py-2">
        <SpecialOffers />
      </div>

      {/* Membership Plans Section - Enhanced */}
      <div className="bg-white py-2" id="meals-plans">
        <Membership />
      </div>

      {/* Testimonials Section - Enhanced */}
      <div className="bg-gray-50 py-2">
        <Testimonials />
      </div>

      {/* Call to Action Section */}
      <div className="bg-gradient-to-br from-[#22C35D] to-[#22C35D] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Elevate Your Hostel Dining Experience?
          </h2>
          <p className="text-green-100 mb-8 max-w-2xl mx-auto">
            Join Hostel Pro today and enjoy delicious, nutritious meals without
            the hassle.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-green-600 hover:bg-green-50 px-6 py-3 rounded-lg font-medium transition-colors">
              Join Now
            </button>
            <button className="bg-transparent border border-white text-white hover:bg-white/10 px-6 py-3 rounded-lg font-medium transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

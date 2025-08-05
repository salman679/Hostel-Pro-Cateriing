import { useState } from "react";
import { Search, X, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

export default function Slider({ searchQuery, setSearchQuery }) {
  const [searchValue, setSearchValue] = useState(searchQuery || "");

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (setSearchQuery && typeof setSearchQuery === "function") {
      setSearchQuery(searchValue);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchValue("");
    if (setSearchQuery && typeof setSearchQuery === "function") {
      setSearchQuery("");
    }
  };

  return (
    <div className="relative bg-gradient-to-r from-green-600 to-green-500 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
        >
          <defs>
            <pattern
              id="grid"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 10 0 L 0 0 0 10"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Decorative Elements */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-400 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-green-400 rounded-full opacity-20 blur-3xl"></div>

      <div className="container mx-auto px-4 py-16 md:py-24 lg:py-20 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Content */}
          <div className="w-full lg:w-1/2 text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Elevate Your Hostel Dining Experience
            </h1>
            <p className="text-lg md:text-xl text-green-50 mb-8 max-w-xl">
              Enjoy delicious, nutritious meals delivered right to your hostel.
              Manage your meal plans, discover new dishes, and share your
              experiences.
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="mb-8 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for meals..."
                  className="w-full px-5 py-4 pl-12 pr-10 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                <Search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70"
                  size={20}
                />

                {searchValue && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-14 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors"
                  >
                    <X size={18} />
                  </button>
                )}

                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-green-600 p-2 rounded-lg transition-colors hover:bg-green-50"
                >
                  <Search size={20} />
                </button>
              </div>
            </form>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link
                to="/meals"
                className="bg-white text-green-600 hover:bg-green-50 px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
              >
                Explore Meals
                <ArrowRight size={18} className="ml-2" />
              </Link>
              <Link
                to="#meals-plans"
                className="bg-transparent border border-white text-white hover:bg-white/10 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                View Plans
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mt-12">
              <div className="text-center">
                <p className="text-3xl font-bold">500+</p>
                <p className="text-green-100 text-sm">Meals Available</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">10k+</p>
                <p className="text-green-100 text-sm">Happy Students</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">4.8</p>
                <p className="text-green-100 text-sm">Average Rating</p>
              </div>
            </div>
          </div>

          {/* Right Content - Image */}
          <div className="w-full lg:w-1/2">
            <div className="relative">
              {/* Main Image */}
              <img
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                alt="Delicious meal spread"
                className="rounded-2xl shadow-2xl w-full h-auto object-cover"
              />

              {/* Floating Card 1 */}
              <div className="absolute -top-6 -left-6 md:top-8 md:-left-12 bg-white p-4 rounded-xl shadow-lg hidden sm:block">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium">Fast Delivery</p>
                    <p className="text-gray-500 text-sm">Within 30 minutes</p>
                  </div>
                </div>
              </div>

              {/* Floating Card 2 */}
              <div className="absolute -bottom-6 -right-6 md:bottom-8 md:-right-12 bg-white p-4 rounded-xl shadow-lg hidden sm:block">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium">Quality Food</p>
                    <p className="text-gray-500 text-sm">Fresh ingredients</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave Divider */}
      {/* <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-16 md:h-24"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25"
            className="fill-white"
          ></path>
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5"
            className="fill-white"
          ></path>
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            className="fill-white"
          ></path>
        </svg>
      </div> */}
    </div>
  );
}

Slider.propTypes = {
  searchQuery: PropTypes.string,
  setSearchQuery: PropTypes.func,
};

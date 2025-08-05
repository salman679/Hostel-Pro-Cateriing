import { useState } from "react";
import MealsByCategory from "../components/Meals/MealsByCategory";
import Membership from "../components/Membership/Membership";
import Slider from "../components/Slider/Slider";
import SpecialOffers from "../components/SpecialOffers/SpecialOffers";
import Testimonials from "../components/Testimonials/Testimonials";
import { ArrowDown } from "lucide-react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  // Smooth scroll to meals section
  const scrollToMeals = () => {
    document.getElementById("meals-section")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Slider Section */}
      <div className="relative">
        <Slider searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {/* Scroll Down Button */}
        <button
          onClick={scrollToMeals}
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full p-3 transition-all duration-300 animate-bounce hidden sm:flex"
          aria-label="Scroll to meals"
        >
          <ArrowDown size={20} />
        </button>
      </div>

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

import { Link } from "react-router-dom";
import logo from "../../../assets/hostel-pro-high-resolution-logo-transparent.png";
import {
  Facebook,
  Instagram,
  Twitter,
  MapPin,
  Phone,
  Mail,
  Clock,
} from "lucide-react";

export default function Footer() {
  // Smooth scroll to meals section
  const scrollToMealsPlans = () => {
    document.getElementById("meals-plans")?.scrollIntoView({
      behavior: "smooth",
    });
  };
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-green-500 to-green-400"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-500/5 rounded-full"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-green-500/5 rounded-full"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* About Section */}
          <div>
            <div className="mb-6">
              <Link to="/">
                <img
                  src={logo || "/placeholder.svg"}
                  alt="Hostel Pro Logo"
                  className="h-12 object-contain"
                />
              </Link>
            </div>
            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
              Making hostel dining a premium experience with quality meals and
              excellent service. We&apos;re committed to providing nutritious,
              delicious options for students.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-green-500 hover:text-white transition-colors duration-300"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-green-500 hover:text-white transition-colors duration-300"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-green-500 hover:text-white transition-colors duration-300"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 relative inline-block">
              Quick Links
              <div className="absolute -bottom-2 left-0 w-12 h-1 bg-green-500 rounded-full"></div>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-green-400 transition-colors duration-300 flex items-center"
                >
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/meals"
                  className="text-gray-400 hover:text-green-400 transition-colors duration-300 flex items-center"
                >
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Meals
                </Link>
              </li>
              <li>
                <Link
                  to="/meals/upcoming-meals"
                  className="text-gray-400 hover:text-green-400 transition-colors duration-300 flex items-center"
                >
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Upcoming Meals
                </Link>
              </li>
              <li>
                <Link
                  onClick={scrollToMealsPlans}
                  className="text-gray-400 hover:text-green-400 transition-colors duration-300 flex items-center"
                >
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Meal Plans
                </Link>
              </li>
              <li>
                <Link
                  to="/contact-us"
                  className="text-gray-400 hover:text-green-400 transition-colors duration-300 flex items-center"
                >
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6 relative inline-block">
              Contact Info
              <div className="absolute -bottom-2 left-0 w-12 h-1 bg-green-500 rounded-full"></div>
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-green-500 mr-3 flex-shrink-0">
                  <MapPin size={16} />
                </div>
                <span className="text-gray-400 text-sm leading-tight pt-1">
                  123 University Ave, Campus Area
                  <br />
                  City, State 12345
                </span>
              </li>
              <li className="flex items-start">
                <div className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-green-500 mr-3 flex-shrink-0">
                  <Phone size={16} />
                </div>
                <span className="text-gray-400 text-sm leading-tight pt-1">
                  +1 (555) 123-4567
                  <br />
                  Mon-Fri, 8:00 AM - 6:00 PM
                </span>
              </li>
              <li className="flex items-start">
                <div className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-green-500 mr-3 flex-shrink-0">
                  <Mail size={16} />
                </div>
                <span className="text-gray-400 text-sm leading-tight pt-1">
                  info@hostelpro.com
                  <br />
                  support@hostelpro.com
                </span>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="text-lg font-semibold mb-6 relative inline-block">
              Opening Hours
              <div className="absolute -bottom-2 left-0 w-12 h-1 bg-green-500 rounded-full"></div>
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-green-500 mr-3 flex-shrink-0">
                  <Clock size={16} />
                </div>
                <div>
                  <p className="text-white font-medium">Breakfast</p>
                  <p className="text-gray-400 text-sm">7:00 AM - 9:30 AM</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-green-500 mr-3 flex-shrink-0">
                  <Clock size={16} />
                </div>
                <div>
                  <p className="text-white font-medium">Lunch</p>
                  <p className="text-gray-400 text-sm">12:00 PM - 2:30 PM</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-green-500 mr-3 flex-shrink-0">
                  <Clock size={16} />
                </div>
                <div>
                  <p className="text-white font-medium">Dinner</p>
                  <p className="text-gray-400 text-sm">6:00 PM - 9:00 PM</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-green-500 mr-3 flex-shrink-0">
                  <Clock size={16} />
                </div>
                <div>
                  <p className="text-white font-medium">Weekend Brunch</p>
                  <p className="text-gray-400 text-sm">9:00 AM - 1:00 PM</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter & Copyright */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Hostel Pro. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <Link
                to="/privacy-policy"
                className="text-gray-400 hover:text-green-400 text-sm"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms-and-conditions"
                className="text-gray-400 hover:text-green-400 text-sm"
              >
                Terms of Service
              </Link>
              <Link
                to="/faq"
                className="text-gray-400 hover:text-green-400 text-sm"
              >
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

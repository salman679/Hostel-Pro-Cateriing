import { Link, useNavigate } from "react-router-dom";
import logo from "../../../assets/hostel-pro-high-resolution-logo-transparent.png";
import { useAuth } from "../../../contexts/AuthContext";
import Swal from "sweetalert2";
import {
  Bell,
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";

export default function Header() {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );
  const dropdownRef = useRef(null);

  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logOut().then(() => {
        navigate("/");
        Swal.fire({
          title: "Success",
          text: "Logout Successful",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
          background: "#ffffff",
          iconColor: "#22c55e",
        });
      });
    } catch {
      Swal.fire({
        title: "Error",
        text: "Logout Failed",
        icon: "error",
        confirmButtonColor: "#22c55e",
      });
    }
    setIsDropdownOpen(false);
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-md py-2"
          : "bg-white py-3"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img
                src={logo || "/placeholder.svg"}
                alt="Hostel Pro Logo"
                className="max-w-24 lg:max-w-32 transition-all duration-300"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className="px-4 py-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors duration-200 font-medium"
            >
              Home
            </Link>
            <Link
              to="/meals"
              className="px-4 py-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors duration-200 font-medium"
            >
              Meals
            </Link>
            <Link
              to="/meals/upcoming-meals"
              className="px-4 py-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors duration-200 font-medium"
            >
              Upcoming Meals
            </Link>
          </div>

          {/* Right side navigation */}
          <div className="flex items-center space-x-3">
            {/* Notification Bell */}
            <button
              className="p-2 rounded-full text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors duration-200 relative"
              aria-label="Notifications"
            >
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-green-600 rounded-full"></span>
            </button>

            {/* User Profile or Login Button */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 p-1 rounded-full hover:bg-green-50 transition-colors duration-200"
                >
                  <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-green-100">
                    {user.photoURL ? (
                      <img
                        src={user?.photoURL || "/placeholder.svg"}
                        alt={user.displayName || "User"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-green-500 flex items-center justify-center text-white font-medium">
                        {user?.displayName ? (
                          user.displayName.charAt(0).toUpperCase()
                        ) : (
                          <User size={18} />
                        )}
                      </div>
                    )}
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-gray-600 transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Profile Dropdown */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-100 transform origin-top-right transition-all duration-200 animate-dropdown">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {user.displayName || "User"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>
                    <ul>
                      <li>
                        <Link
                          to={`/dashboard`}
                          state={{ email: user.email }}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <LayoutDashboard size={16} className="mr-2" />
                          Dashboard
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600"
                        >
                          <LogOut size={16} className="mr-2" />
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/auth/login">
                <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors duration-200 font-medium hidden sm:block">
                  Join Us
                </button>
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white py-4 mt-3 border-t border-gray-100 animate-slideDown">
            <div className="flex flex-col space-y-2">
              <Link
                to="/"
                className="text-gray-700 hover:text-green-600 font-medium px-4 py-2 hover:bg-green-50 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/meals"
                className="text-gray-700 hover:text-green-600 font-medium px-4 py-2 hover:bg-green-50 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Meals
              </Link>
              <Link
                to="/meals/upcoming-meals"
                className="text-gray-700 hover:text-green-600 font-medium px-4 py-2 hover:bg-green-50 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Upcoming Meals
              </Link>
              {!user && (
                <Link to="/auth/login">
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-left mx-4 mt-2 w-[calc(100%-2rem)] transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Join Us
                  </button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

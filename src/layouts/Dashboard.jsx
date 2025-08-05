import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import useRole from "../Hooks/useRole";
import {
  Home,
  Users,
  Utensils,
  Plus,
  MessageSquare,
  History,
  Calendar,
  ClipboardList,
  Menu,
  X,
  ChevronRight,
  LogOut,
  User,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import useUserData from "../Hooks/useUserData";

export default function DashboardLayout() {
  const [role] = useRole();
  const [showSidebar, setShowSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const { logOut } = useAuth();
  const { userData } = useUserData();

  // Check if current route is active
  const isActive = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  // Handle window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setShowSidebar(true);
      } else {
        setShowSidebar(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Function to handle menu click, close sidebar on mobile
  const handleMenuClick = () => {
    if (isMobile) {
      setShowSidebar(false);
    }
  };

  // Admin menu items
  const adminMenuItems = [
    {
      path: "/dashboard",
      name: "Dashboard",
      icon: <Home size={20} />,
    },
    {
      path: "/dashboard/admin-profile",
      name: "Admin Profile",
      icon: <User size={20} />,
    },
    {
      path: "/dashboard/manage-users",
      name: "Manage Users",
      icon: <Users size={20} />,
    },
    {
      path: "/dashboard/all-meals",
      name: "All Meals",
      icon: <Utensils size={20} />,
    },
    {
      path: "/dashboard/add-meal",
      name: "Add Meal",
      icon: <Plus size={20} />,
    },
    {
      path: "/dashboard/serve-meals",
      name: "Serve Meals",
      icon: <ClipboardList size={20} />,
    },
    {
      path: "/dashboard/upcoming-meals",
      name: "Upcoming Meals",
      icon: <Calendar size={20} />,
    },
    {
      path: "/dashboard/all-reviews",
      name: "All Reviews",
      icon: <MessageSquare size={20} />,
    },
  ];

  // User menu items
  const userMenuItems = [
    {
      path: "/dashboard",
      name: "Dashboard",
      icon: <Home size={20} />,
    },
    {
      path: "/dashboard/user-profile",
      name: "My Profile",
      icon: <User size={20} />,
    },
    {
      path: "/dashboard/requested-meals",
      name: "Requested Meals",
      icon: <Utensils size={20} />,
    },
    {
      path: "/dashboard/reviews",
      name: "My Reviews",
      icon: <MessageSquare size={20} />,
    },
    {
      path: "/dashboard/payment-history",
      name: "Payment History",
      icon: <History size={20} />,
    },
  ];

  // Select menu items based on role
  const menuItems = role === "admin" ? adminMenuItems : userMenuItems;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Overlay for mobile */}
      {isMobile && showSidebar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setShowSidebar(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative z-30 h-full bg-white shadow-xl transition-all duration-300 ease-in-out
          ${
            showSidebar ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }
          ${isMobile ? "w-72" : "w-72 lg:w-80"}
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
              HP
            </div>
            <span className="text-xl font-bold text-gray-800">Hostel Pro</span>
          </Link>
          {isMobile && (
            <button
              onClick={() => setShowSidebar(false)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <X size={20} className="text-gray-600" />
            </button>
          )}
        </div>

        {/* User Profile Section */}
        <div className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-green-500">
                {userData?.image ? (
                  <img
                    src={userData.image || "/placeholder.svg"}
                    alt={userData.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={24} className="text-gray-500" />
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-medium text-gray-900 truncate">
                {userData?.name || "User"}
              </h2>
              <p className="text-xs text-gray-500 truncate">
                {role === "admin"
                  ? "Administrator"
                  : userData?.subscription || "User"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)] pb-32">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                ${
                  isActive(item.path)
                    ? "bg-green-50 text-green-600 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }
              `}
              onClick={handleMenuClick}
            >
              <span
                className={
                  isActive(item.path) ? "text-green-600" : "text-gray-500"
                }
              >
                {item.icon}
              </span>
              <span>{item.name}</span>
              {isActive(item.path) && (
                <span className="ml-auto">
                  <ChevronRight size={16} className="text-green-600" />
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
          <Link
            to="/"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Home size={20} className="text-gray-500" />
            <span>Back to Home</span>
          </Link>
          <button
            onClick={logOut}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm py-4 px-6 flex items-center justify-between">
          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            <Menu size={24} className="text-gray-600" />
          </button>

          {/* Page Title */}
          <h1 className="text-xl font-semibold text-gray-800 hidden sm:block">
            {location.pathname === "/dashboard"
              ? "Dashboard"
              : menuItems.find((item) => isActive(item.path))?.name ||
                "Dashboard"}
          </h1>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              <Home size={20} />
            </Link>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

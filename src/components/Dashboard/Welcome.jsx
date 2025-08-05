import useUserData from "../../Hooks/useUserData";
import { Calendar, Clock, CreditCard, User, Users } from "lucide-react";
import { Link } from "react-router-dom";
import useRole from "../../Hooks/useRole";

export default function Welcome() {
  const { userData } = useUserData();
  const [role] = useRole();

  // Get current time
  const getCurrentTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "morning";
    if (hour < 18) return "afternoon";
    return "evening";
  };

  // Format date
  const formatDate = () => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get current time
  const formatTime = () => {
    return new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // User dashboard cards
  const userCards = [
    {
      title: "My Profile",
      description: "View and edit your profile information",
      icon: <User size={24} className="text-blue-500" />,
      link: "/dashboard/user-profile",
      color: "bg-blue-50 border-blue-200",
    },
    {
      title: "Requested Meals",
      description: "Manage your meal requests",
      icon: <Calendar size={24} className="text-green-500" />,
      link: "/dashboard/requested-meals",
      color: "bg-green-50 border-green-200",
    },
    {
      title: "My Reviews",
      description: "See and manage your meal reviews",
      icon: <Users size={24} className="text-purple-500" />,
      link: "/dashboard/reviews",
      color: "bg-purple-50 border-purple-200",
    },
    {
      title: "Payment History",
      description: "View your payment records",
      icon: <CreditCard size={24} className="text-amber-500" />,
      link: "/dashboard/payment-history",
      color: "bg-amber-50 border-amber-200",
    },
  ];

  // Admin dashboard cards
  const adminCards = [
    {
      title: "Admin Profile",
      description: "View and edit your admin profile",
      icon: <User size={24} className="text-blue-500" />,
      link: "/dashboard/admin-profile",
      color: "bg-blue-50 border-blue-200",
    },
    {
      title: "Manage Users",
      description: "View and manage all users",
      icon: <Users size={24} className="text-green-500" />,
      link: "/dashboard/manage-users",
      color: "bg-green-50 border-green-200",
    },
    {
      title: "All Meals",
      description: "Manage all meals in the system",
      icon: <Calendar size={24} className="text-purple-500" />,
      link: "/dashboard/all-meals",
      color: "bg-purple-50 border-purple-200",
    },
    {
      title: "Add Meal",
      description: "Add a new meal to the system",
      icon: <CreditCard size={24} className="text-amber-500" />,
      link: "/dashboard/add-meal",
      color: "bg-amber-50 border-amber-200",
    },
  ];

  // Select cards based on role
  const dashboardCards = role === "admin" ? adminCards : userCards;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Good {getCurrentTime()}, {userData?.name || "User"}!
            </h1>
            <p className="text-gray-600 mt-1 flex items-center">
              <Calendar size={16} className="mr-2" />
              {formatDate()}
              <span className="mx-2">•</span>
              <Clock size={16} className="mr-2" />
              {formatTime()}
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <div className="inline-flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              {role === "admin"
                ? "Administrator"
                : userData?.subscription || "User"}
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardCards.map((card, index) => (
          <Link
            key={index}
            to={card.link}
            className={`block p-6 rounded-xl border shadow-sm transition-all hover:shadow-md ${card.color}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-white shadow-sm">
                {card.icon}
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              {card.title}
            </h3>
            <p className="text-gray-600 text-sm mt-1">{card.description}</p>
          </Link>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Quick Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <h3 className="text-sm font-medium text-blue-700">Subscription</h3>
            <p className="text-2xl font-bold text-blue-800 mt-1">
              {userData?.subscription || "None"}
            </p>
          </div>

          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
            <h3 className="text-sm font-medium text-green-700">
              Account Status
            </h3>
            <p className="text-2xl font-bold text-green-800 mt-1">Active</p>
          </div>

          <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
            <h3 className="text-sm font-medium text-purple-700">Role</h3>
            <p className="text-2xl font-bold text-purple-800 mt-1 capitalize">
              {role || "User"}
            </p>
          </div>

          <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
            <h3 className="text-sm font-medium text-amber-700">Member Since</h3>
            <p className="text-lg font-bold text-amber-800 mt-1">
              {new Date().toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

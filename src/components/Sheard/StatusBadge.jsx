import { useState } from "react";

const StatusBadge = ({ status, type = "default" }) => {
  // Define badge styles based on type and status
  const getBadgeStyle = (statusType, statusValue) => {
    // User subscription badges
    if (statusType === "subscription") {
      const subscriptionStyles = {
        Bronze: "bg-amber-100 text-amber-800 border-amber-200",
        Silver: "bg-gray-100 text-gray-800 border-gray-200",
        Gold: "bg-yellow-100 text-yellow-800 border-yellow-200",
        Platinum: "bg-blue-100 text-blue-800 border-blue-200",
      };
      
      return subscriptionStyles[statusValue] || "bg-red-100 text-red-800 border-red-200";
    }
    
    // Meal request status badges
    if (statusType === "request") {
      const requestStyles = {
        pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
        approved: "bg-green-100 text-green-800 border-green-200",
        served: "bg-blue-100 text-blue-800 border-blue-200",
        cancelled: "bg-red-100 text-red-800 border-red-200",
      };
      
      return requestStyles[statusValue] || "bg-gray-100 text-gray-800 border-gray-200";
    }
    
    // Default status badges
    const defaultStyles = {
      active: "bg-green-100 text-green-800 border-green-200",
      inactive: "bg-red-100 text-red-800 border-red-200",
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      approved: "bg-green-100 text-green-800 border-green-200",
      delivered: "bg-blue-100 text-blue-800 border-blue-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
      admin: "bg-purple-100 text-purple-800 border-purple-200",
      user: "bg-gray-100 text-gray-800 border-gray-200",
    };
    
    return defaultStyles[statusValue] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const badgeStyle = getBadgeStyle(type, status);

  return (
    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${badgeStyle}`}>
      {status}
    </span>
  );
};

export default StatusBadge;

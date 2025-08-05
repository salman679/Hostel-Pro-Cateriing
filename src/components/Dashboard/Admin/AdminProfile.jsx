import { useQuery } from "@tanstack/react-query";
import { User, Utensils, Award, Calendar, Clock } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

export default function AdminProfile() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: adminStats = {}, isLoading } = useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/meals/admin", {
        params: { email: user?.email },
      });
      return res.data;
    },
  });

  // Format date
  const formatDate = () => {
    return new Date().toLocaleDateString("en-US", {
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

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Cover Photo */}
        <div className="h-40 bg-gradient-to-r from-blue-500 to-indigo-600 relative"></div>

        {/* Profile Info */}
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end -mt-12 sm:-mt-16 mb-6">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white bg-white shadow-md overflow-hidden z-20">
              <img
                src={user?.photoURL || "https://i.ibb.co/HBx04n5/images.jpg"}
                alt={user?.displayName || "Admin"}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                {user?.displayName || "Admin Name"}
              </h1>
              <div className="flex items-center mt-1">
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                  Administrator
                </span>
              </div>
            </div>
          </div>

          {/* Admin Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Contact Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <User size={20} className="text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-800">
                      {user?.email || "admin@example.com"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Calendar size={20} className="text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="text-gray-800">{formatDate()}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Clock size={20} className="text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="text-gray-800">{formatTime()}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Admin Statistics
              </h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Utensils size={20} className="text-blue-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Meals Added</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {isLoading ? "..." : adminStats.mealsLength || 0}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Award size={20} className="text-green-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Role</p>
                    <p className="text-gray-800 font-medium">Administrator</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Total Meals</h3>
            <div className="p-2 rounded-lg bg-blue-100">
              <Utensils size={20} className="text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800">
            {isLoading ? "..." : adminStats.totalMeals || 0}
          </p>
          <p className="text-sm text-gray-500 mt-1">Meals in the system</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Upcoming</h3>
            <div className="p-2 rounded-lg bg-green-100">
              <Calendar size={20} className="text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800">
            {isLoading ? "..." : adminStats.totalUpcomingMeals || 0}
          </p>
          <p className="text-sm text-gray-500 mt-1">Upcoming meals</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Users</h3>
            <div className="p-2 rounded-lg bg-purple-100">
              <User size={20} className="text-purple-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800">
            {isLoading ? "..." : adminStats.totalUsers || 0}
          </p>
          <p className="text-sm text-gray-500 mt-1">Registered users</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Reviews</h3>
            <div className="p-2 rounded-lg bg-amber-100">
              <Award size={20} className="text-amber-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800">
            {isLoading ? "..." : adminStats.totalReviews || 0}
          </p>
          <p className="text-sm text-gray-500 mt-1">Total reviews</p>
        </div>
      </div>
    </div>
  );
}

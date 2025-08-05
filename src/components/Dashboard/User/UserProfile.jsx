import { useState } from "react";
import {
  Edit,
  Mail,
  Phone,
  MapPin,
  Calendar,
  UserIcon,
  Save,
  X,
} from "lucide-react";
import Swal from "sweetalert2";
import useUserData from "../../../Hooks/useUserData";

export default function UserProfile() {
  const { userData } = useUserData();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userData?.name || "",
    phone: userData?.phone || "",
    address: userData?.address || "",
  });

  // Dynamic subscription styles
  const getSubscriptionStyles = () => {
    const styles = {
      Gold: "bg-yellow-100 text-yellow-800 border-yellow-300",
      Bronze: "bg-amber-100 text-amber-800 border-amber-300",
      Platinum: "bg-blue-100 text-blue-800 border-blue-300",
      Silver: "bg-gray-100 text-gray-800 border-gray-300",
    };

    return (
      styles[userData?.subscription] ||
      "bg-gray-100 text-gray-500 border-gray-300"
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Here you would typically make an API call to update the user data
    // For now, we'll just show a success message

    Swal.fire({
      icon: "success",
      title: "Profile Updated!",
      text: "Your profile information has been updated successfully.",
      confirmButtonColor: "#22c55e",
    });

    setIsEditing(false);
  };

  const cancelEdit = () => {
    setFormData({
      name: userData?.name || "",
      phone: userData?.phone || "",
      address: userData?.address || "",
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Cover Photo */}
        <div className="h-40 bg-gradient-to-r from-green-400 to-blue-500 relative">
          {isEditing ? (
            <div className="absolute bottom-4 right-4 flex space-x-2">
              <button
                onClick={handleSubmit}
                className="p-2 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-colors"
              >
                <Save size={20} />
              </button>
              <button
                onClick={cancelEdit}
                className="p-2 bg-white text-red-500 rounded-full shadow-lg hover:bg-red-50 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="absolute bottom-4 right-4 p-2 bg-white text-gray-700 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
            >
              <Edit size={20} />
            </button>
          )}
        </div>

        {/* Profile Info */}
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end -mt-12 sm:-mt-16 mb-6">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white bg-white shadow-md overflow-hidden z-20">
              <img
                src={userData?.image || "https://via.placeholder.com/150"}
                alt={userData?.name || "User"}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-6">
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="text-2xl sm:text-3xl font-bold text-gray-800 bg-gray-50 border border-gray-300 rounded-md px-3 py-2 w-full sm:w-auto"
                />
              ) : (
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                  {userData?.name || "User"}
                </h1>
              )}
              <div className="flex items-center mt-1">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium border ${getSubscriptionStyles()}`}
                >
                  {userData?.subscription || "No Subscription"}
                </span>
                <span className="ml-2 text-gray-500 text-sm">Member</span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Contact Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail size={20} className="text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-800">
                      {userData?.email || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Phone size={20} className="text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    {isEditing ? (
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="text-gray-800 bg-gray-50 border border-gray-300 rounded-md px-3 py-1 w-full"
                        placeholder="Enter your phone number"
                      />
                    ) : (
                      <p className="text-gray-800">
                        {userData?.phone || "Not provided"}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center">
                  <MapPin size={20} className="text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    {isEditing ? (
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="text-gray-800 bg-gray-50 border border-gray-300 rounded-md px-3 py-1 w-full"
                        placeholder="Enter your address"
                      />
                    ) : (
                      <p className="text-gray-800">
                        {userData?.address || "Not provided"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Account Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <UserIcon size={20} className="text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Account Type</p>
                    <p className="text-gray-800">{userData?.role || "User"}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Calendar size={20} className="text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p className="text-gray-800">
                      {userData?.createdAt
                        ? new Date(userData.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            }
                          )
                        : "Not available"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Information */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Subscription Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500">Current Plan</h3>
            <p className="text-xl font-bold text-gray-800 mt-1">
              {userData?.subscription || "No Plan"}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500">Status</h3>
            <p className="text-xl font-bold text-green-600 mt-1">Active</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500">Next Billing</h3>
            <p className="text-xl font-bold text-gray-800 mt-1">
              {new Date(
                Date.now() + 30 * 24 * 60 * 60 * 1000
              ).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
            Upgrade Plan
          </button>
        </div>
      </div>
    </div>
  );
}

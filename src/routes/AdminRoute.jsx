import { Navigate, useLocation } from "react-router-dom";
import useAdmin from "../Hooks/useAdmin";
import PropTypes from "prop-types";
import { useAuth } from "../contexts/AuthContext";

export default function AdminRoute({ children }) {
  const { user, loading, logOut } = useAuth();
  const [isAdmin, isAdminLoading] = useAdmin();
  const location = useLocation();

  if (loading || isAdminLoading) {
    return (
      <div className="col-span-full flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    );
  }

  if (user && isAdmin) {
    return children;
  }

  if (user && !isAdmin) {
    logOut();
  }

  return <Navigate to="/" state={{ from: location }} replace></Navigate>;
}

AdminRoute.propTypes = {
  children: PropTypes.node,
};

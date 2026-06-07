import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner fullScreen />;

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const redirectMap = {
      admin: "/admin",
      student: "/student",
      instructor: "/instructor",
      visitor: "/",
    };
    return <Navigate to={redirectMap[user.role] || "/"} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

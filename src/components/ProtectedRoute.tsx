
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth, UserRole } from "../contexts/AuthContext";
import { Loader } from "lucide-react";

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles = [] }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // If auth is still loading, show a loading spinner
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If specific roles are required and user doesn't have them
  if (
    allowedRoles.length > 0 &&
    user &&
    user.role && 
    !allowedRoles.includes(user.role)
  ) {
    // Redirect to the appropriate dashboard based on user role
    if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user.role === "accountant") {
      return <Navigate to="/accountant/dashboard" replace />;
    } else if (user.role === "student") {
      return <Navigate to="/student/dashboard" replace />;
    } else {
      // Fallback to login if role is unknown
      return <Navigate to="/login" replace />;
    }
  }

  // If user is authenticated and has the required role, render the children
  return <Outlet />;
};

export default ProtectedRoute;

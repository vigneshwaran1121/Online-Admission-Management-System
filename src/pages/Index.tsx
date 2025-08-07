
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user, isAuthenticated } = useAuth();

  // If user is authenticated, redirect to appropriate dashboard
  if (isAuthenticated && user) {
    switch (user.role) {
      case "admin":
        return <Navigate to="/admin/dashboard" replace />;
      case "accountant":
        return <Navigate to="/accountant/dashboard" replace />;
      case "student":
        return <Navigate to="/student/dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  // If not authenticated, redirect to login page
  return <Navigate to="/login" replace />;
};

export default Index;

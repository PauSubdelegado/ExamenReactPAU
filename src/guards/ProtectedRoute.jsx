import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function ProtectedRoute() {
  const location = useLocation();
  const { isAuthenticated, token, loading } = useAuth(); 

  if (loading) return null; 

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
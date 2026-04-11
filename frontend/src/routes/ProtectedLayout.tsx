import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedLayout() {
  const authContext = useAuth();

  if (!authContext || !authContext.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
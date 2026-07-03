import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedLayout() {
  const authContext = useAuth();
  console.log("ProtectedLayout authContext:", authContext);
  if (!authContext || !authContext.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
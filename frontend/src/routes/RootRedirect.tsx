import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RootRedirect() {
    const authContext = useAuth();
    if (authContext?.isAuthenticated) {
        return <Navigate to="/home" replace />;
    } else {
        return <Navigate to="/login" replace />;
    }
}
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/auth";

export default function RootRedirect() {
    const authContext = useAuth();
    if (authContext?.isAuthenticated) {
        return <Navigate to="/home" replace />;
    } else {
        return <Navigate to="/login" replace />;
    }
}

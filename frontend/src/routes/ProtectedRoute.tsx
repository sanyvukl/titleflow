import { Navigate, Outlet, useLocation } from "react-router";
import { useAppSelector } from "../store/hooks";

function ProtectedRoute() {
    const location = useLocation();

    const { isAuthenticated, accessToken } = useAppSelector(
        (state) => state.auth
    );

    if (!isAuthenticated || !accessToken) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <Outlet />;
}

export default ProtectedRoute;
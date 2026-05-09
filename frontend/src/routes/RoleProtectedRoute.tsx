import { Alert, Card, CardContent, Stack, Typography } from "@mui/material";
import { Navigate, Outlet } from "react-router";
import type { RoleName } from "../auth/authTypes";
import { useAppSelector } from "../store/hooks";

interface RoleProtectedRouteProps {
    allowedRoles: RoleName[];
}

function RoleProtectedRoute({ allowedRoles }: RoleProtectedRouteProps) {
    const { user, isAuthenticated, accessToken, status } = useAppSelector(
        (state) => state.auth
    );

    if (!isAuthenticated || !accessToken) {
        return <Navigate to="/login" replace />;
    }

    if (status === "loading" && !user) {
        return (
            <Card sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 4 }}>
                    <Typography color="text.secondary">Loading access...</Typography>
                </CardContent>
            </Card>
        );
    }

    const hasAllowedRole =
        user?.roles.some((role) => allowedRoles.includes(role)) ?? false;

    if (!hasAllowedRole) {
        return (
            <Stack spacing={3}>
                <Alert severity="error">You do not have access to this page.</Alert>

                <Card sx={{ borderRadius: 3 }}>
                    <CardContent sx={{ p: 4 }}>
                        <Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>
                            Access denied
                        </Typography>

                        <Typography color="text.secondary" sx={{ mt: 1 }}>
                            This page is restricted to: {allowedRoles.join(", ")}.
                        </Typography>
                    </CardContent>
                </Card>
            </Stack>
        );
    }

    return <Outlet />;
}

export default RoleProtectedRoute;
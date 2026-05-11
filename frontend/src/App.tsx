import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router";
import { useAppDispatch, useAppSelector } from "./store/hooks";

import { loadCurrentUser } from "./auth/authSlice";

import DashboardLayout from "./layouts/DashboardLayout";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import DashboardPage from "./pages/dashboard/DashboardPage";

import AuditLogsPage from "./pages/auditLogs/AuditLogsPage";
import AuditLogDetailsPage from "./pages/auditLogs/AuditLogDetailsPage";
import DmvReviewPage from "./pages/dmvReview/DmvReviewPage";
import DmvReviewDetailsPage from "./pages/dmvReview/DmvReviewDetailsPage";
import TitleApplicationsPage from "./pages/titleApplications/TitleApplicationsPage";
import TitleApplicationDetailsPage from "./pages/titleApplications/TitleApplicationDetailsPage";
import CreateTitleApplicationPage from "./pages/titleApplications/CreateTitleApplicationPage";

import ProtectedRoute from "./routes/ProtectedRoute";
import RoleProtectedRoute from "./routes/RoleProtectedRoute.tsx";

function App() {
    const dispatch = useAppDispatch();

    const { accessToken, user, status } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (accessToken && !user && status !== "loading") {
            dispatch(loadCurrentUser());
        }
    }, [accessToken, user, status, dispatch]);

    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                    <Route path="/dashboard" element={<DashboardPage />} />

                    <Route element={<RoleProtectedRoute allowedRoles={["DEALER"]} />}>
                        <Route path="/dashboard/title-applications" element={<TitleApplicationsPage />} />
                        <Route path="/dashboard/title-applications/:id" element={<TitleApplicationDetailsPage />} />
                        <Route path="/dashboard/title-applications/new" element={<CreateTitleApplicationPage />} />
                    </Route>

                    <Route element={<RoleProtectedRoute allowedRoles={["DMV_CLERK"]} />}>
                        <Route path="/dashboard/dmv-review" element={<DmvReviewPage />} />
                        <Route path="/dashboard/dmv-review/:id" element={<DmvReviewDetailsPage />} />
                    </Route>

                    <Route element={<RoleProtectedRoute allowedRoles={["DMV_CLERK", "ADMIN"]} />}>
                        <Route path="/dashboard/audit-logs" element={<AuditLogsPage />} />
                        <Route path="/dashboard/audit-logs/:id" element={<AuditLogDetailsPage />} />
                    </Route>
                </Route>
            </Route>
        </Routes>
    );
}

export default App;
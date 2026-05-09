import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router";
import { useAppDispatch, useAppSelector } from "./store/hooks";

import { loadCurrentUser } from "./auth/authSlice";

import DashboardLayout from "./layouts/DashboardLayout";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import DashboardPage from "./pages/dashboard/DashboardPage";

import AuditLogsPage from "./pages/auditLogs/AuditLogsPage";
import DmvReviewPage from "./pages/dmvReview/DmvReviewPage";
import DocumentsPage from "./pages/documents/DocumentsPage";
import LiensPage from "./pages/liens/LiensPage";
import TitleApplicationsPage from "./pages/titleApplications/TitleApplicationsPage";

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
                        <Route
                            path="/dashboard/title-applications"
                            element={<TitleApplicationsPage />}
                        />
                    </Route>

                    <Route element={<RoleProtectedRoute allowedRoles={["DMV_CLERK"]} />}>
                        <Route path="/dashboard/dmv-review" element={<DmvReviewPage />} />
                    </Route>

                    <Route
                        element={
                            <RoleProtectedRoute allowedRoles={["DEALER", "DMV_CLERK", "ADMIN"]} />
                        }
                    >
                        <Route path="/dashboard/documents" element={<DocumentsPage />} />
                    </Route>

                    <Route
                        element={
                            <RoleProtectedRoute
                                allowedRoles={["LENDER", "DEALER", "DMV_CLERK", "ADMIN"]}
                            />
                        }
                    >
                        <Route path="/dashboard/liens" element={<LiensPage />} />
                    </Route>

                    <Route element={<RoleProtectedRoute allowedRoles={["DMV_CLERK", "ADMIN"]} />}>
                        <Route path="/dashboard/audit-logs" element={<AuditLogsPage />} />
                    </Route>
                </Route>
            </Route>
        </Routes>
    );
}

export default App;
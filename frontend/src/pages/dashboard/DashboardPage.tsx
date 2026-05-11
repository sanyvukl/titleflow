import type { ReactNode } from "react";
import { Link as RouterLink } from "react-router";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Paper,
    Stack,
    Typography,
} from "@mui/material";

import ArticleIcon from "@mui/icons-material/Article";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import HistoryIcon from "@mui/icons-material/History";
import ShieldIcon from "@mui/icons-material/Shield";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

import PageHeader from "../../components/common/PageHeader";
import type { RoleName } from "../../auth/authTypes";
import { useAppSelector } from "../../store/hooks";

interface QuickAction {
    title: string;
    description: string;
    path: string;
    roles: RoleName[];
    icon: ReactNode;
    buttonLabel: string;
}

const quickActions: QuickAction[] = [
    {
        title: "Title Applications",
        description: "Create and manage dealer title applications.",
        path: "/dashboard/title-applications",
        roles: ["DEALER"],
        icon: <ArticleIcon />,
        buttonLabel: "Open Applications",
    },
    {
        title: "DMV Review",
        description: "Review submitted applications and process decisions.",
        path: "/dashboard/dmv-review",
        roles: ["DMV_CLERK"],
        icon: <FactCheckIcon />,
        buttonLabel: "Open Review Queue",
    },
    {
        title: "Audit Logs",
        description: "Inspect application audit trails and workflow history.",
        path: "/dashboard/audit-logs",
        roles: ["DMV_CLERK", "ADMIN"],
        icon: <HistoryIcon />,
        buttonLabel: "View Audit Logs",
    },
];

function DashboardPage() {
    const { user, status, error } = useAppSelector((state) => state.auth);

    const visibleQuickActions = quickActions.filter((action) =>
        action.roles.some((role) => user?.roles.includes(role))
    );

    return (
        <Box>
            <PageHeader
                title="Dashboard"
                subtitle="Welcome to your secure TitleFlow workspace."
            />

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <Paper
                sx={{
                    p: { xs: 3, md: 4 },
                    mb: 3,
                    overflow: "hidden",
                    position: "relative",
                    background:
                        "linear-gradient(135deg, #061E3A 0%, #082B55 52%, #123E73 100%)",
                    color: "white",
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        width: 280,
                        height: 280,
                        borderRadius: "50%",
                        right: -90,
                        top: -110,
                        background:
                            "radial-gradient(circle, rgba(79, 125, 243, 0.42), transparent 68%)",
                    }}
                />

                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={3}
                    sx={{
                        position: "relative",
                        justifyContent: "space-between",
                        alignItems: { xs: "flex-start", md: "center" },
                    }}
                >
                    <Stack spacing={2} sx={{ maxWidth: 720 }}>
                        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                            <Box
                                sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: "16px",
                                    display: "grid",
                                    placeItems: "center",
                                    background:
                                        "linear-gradient(135deg, #4F7DF3 0%, #2F80ED 100%)",
                                    boxShadow: "0 14px 28px rgba(79, 125, 243, 0.34)",
                                }}
                            >
                                <ShieldIcon />
                            </Box>

                            <Box>
                                <Typography variant="h5" sx={{ color: "white", fontWeight: 900 }}>
                                    TitleFlow Console
                                </Typography>

                                <Typography
                                    variant="body2"
                                    sx={{ color: "rgba(255, 255, 255, 0.72)" }}
                                >
                                    Digital title processing workspace
                                </Typography>
                            </Box>
                        </Stack>

                        <Box>
                            <Typography
                                variant="h3"
                                sx={{
                                    color: "white",
                                    fontWeight: 900,
                                    letterSpacing: "-0.05em",
                                    lineHeight: 1.05,
                                    mb: 1.5,
                                }}
                            >
                                Secure title workflows, documents, and review tracking.
                            </Typography>

                            <Typography
                                variant="body1"
                                sx={{
                                    color: "rgba(255, 255, 255, 0.76)",
                                    maxWidth: 650,
                                }}
                            >
                                Use role-based tools to manage dealer applications, DMV review,
                                document uploads, and audit history.
                            </Typography>
                        </Box>
                    </Stack>

                    {user && (
                        <Card
                            sx={{
                                minWidth: { xs: "100%", md: 320 },
                                backgroundColor: "rgba(255, 255, 255, 0.1)",
                                border: "1px solid rgba(255, 255, 255, 0.16)",
                                boxShadow: "none",
                                backdropFilter: "blur(10px)",
                            }}
                        >
                            <CardContent sx={{ p: 3 }}>
                                <Stack spacing={2}>
                                    <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                                        <VerifiedUserIcon sx={{ color: "white" }} />

                                        <Box>
                                            <Typography sx={{ color: "white", fontWeight: 800 }}>
                                                {user.firstName} {user.lastName}
                                            </Typography>

                                            <Typography
                                                variant="body2"
                                                sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                                            >
                                                {user.email}
                                            </Typography>
                                        </Box>
                                    </Stack>

                                    <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.14)" }} />

                                    <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1 }}>
                                        {user.roles.map((role) => (
                                            <Chip
                                                key={role}
                                                label={role}
                                                size="small"
                                                sx={{
                                                    color: "white",
                                                    borderColor: "rgba(255, 255, 255, 0.32)",
                                                    backgroundColor: "rgba(255, 255, 255, 0.12)",
                                                    fontWeight: 800,
                                                }}
                                                variant="outlined"
                                            />
                                        ))}
                                    </Stack>

                                    <Chip
                                        label={user.status}
                                        size="small"
                                        color={user.status === "ACTIVE" ? "success" : "default"}
                                    />
                                </Stack>
                            </CardContent>
                        </Card>
                    )}
                </Stack>
            </Paper>

            <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                sx={{ mb: 3 }}
            >
                <Paper sx={{ p: 2.5, flex: 1 }}>
                    <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                        <Box
                            sx={{
                                width: 44,
                                height: 44,
                                borderRadius: "14px",
                                display: "grid",
                                placeItems: "center",
                                backgroundColor: "#EEF5FF",
                                color: "primary.main",
                            }}
                        >
                            <DashboardIcon />
                        </Box>

                        <Box>
                            <Typography variant="body2" color="text.secondary">
                                Workspace Status
                            </Typography>

                            <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                Ready
                            </Typography>
                        </Box>
                    </Stack>
                </Paper>

                <Paper sx={{ p: 2.5, flex: 1 }}>
                    <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                        <Box
                            sx={{
                                width: 44,
                                height: 44,
                                borderRadius: "14px",
                                display: "grid",
                                placeItems: "center",
                                backgroundColor: "#EAF7EA",
                                color: "success.main",
                            }}
                        >
                            <ShieldIcon />
                        </Box>

                        <Box>
                            <Typography variant="body2" color="text.secondary">
                                Authentication
                            </Typography>

                            <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                JWT Secured
                            </Typography>
                        </Box>
                    </Stack>
                </Paper>

                <Paper sx={{ p: 2.5, flex: 1 }}>
                    <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                        <Box
                            sx={{
                                width: 44,
                                height: 44,
                                borderRadius: "14px",
                                display: "grid",
                                placeItems: "center",
                                backgroundColor: "#EEF5FF",
                                color: "info.main",
                            }}
                        >
                            <VerifiedUserIcon />
                        </Box>

                        <Box>
                            <Typography variant="body2" color="text.secondary">
                                Current Role
                            </Typography>

                            <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                {user?.roles[0] ?? "Loading"}
                            </Typography>
                        </Box>
                    </Stack>
                </Paper>
            </Stack>

            <Paper sx={{ p: 3 }}>
                <Stack spacing={2}>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>
                            Available Modules
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                            Your navigation is based on your account role.
                        </Typography>
                    </Box>

                    <Divider />

                    {status === "loading" && (
                        <Typography color="text.secondary">Loading user workspace...</Typography>
                    )}

                    {visibleQuickActions.length === 0 && status !== "loading" ? (
                        <Typography color="text.secondary">
                            No workflow modules are available for this role yet.
                        </Typography>
                    ) : (
                        <Stack
                            direction={{ xs: "column", md: "row" }}
                            spacing={2}
                        >
                            {visibleQuickActions.map((action) => (
                                <Card key={action.title} sx={{ flex: 1 }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <Stack spacing={2}>
                                            <Box
                                                sx={{
                                                    width: 46,
                                                    height: 46,
                                                    borderRadius: "14px",
                                                    display: "grid",
                                                    placeItems: "center",
                                                    background:
                                                        "linear-gradient(135deg, #4F7DF3 0%, #2F80ED 100%)",
                                                    color: "white",
                                                }}
                                            >
                                                {action.icon}
                                            </Box>

                                            <Box>
                                                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                                    {action.title}
                                                </Typography>

                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{ mt: 0.75 }}
                                                >
                                                    {action.description}
                                                </Typography>
                                            </Box>

                                            <Button
                                                component={RouterLink}
                                                to={action.path}
                                                variant="outlined"
                                            >
                                                {action.buttonLabel}
                                            </Button>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            ))}
                        </Stack>
                    )}
                </Stack>
            </Paper>
        </Box>
    );
}

export default DashboardPage;
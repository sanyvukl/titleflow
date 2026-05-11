import { useEffect } from "react";
import { Link as RouterLink } from "react-router";

import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";

import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingActionsIcon from "@mui/icons-material/PendingActions";

import PageHeader from "../../components/common/PageHeader";
import { fetchMyApplications } from "../../features/titleApplications/titleApplicationsSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

function getStatusColor(
    status: string
): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" {
    switch (status) {
        case "DRAFT":
            return "default";
        case "SUBMITTED":
            return "info";
        case "UNDER_REVIEW":
            return "warning";
        case "NEEDS_MORE_INFO":
            return "warning";
        case "APPROVED":
            return "success";
        case "REJECTED":
            return "error";
        case "TITLE_ISSUED":
            return "success";
        default:
            return "default";
    }
}

function formatStatus(status: string): string {
    return status
        .split("_")
        .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
        .join(" ");
}

export default function TitleApplicationsPage() {
    const dispatch = useAppDispatch();

    const { applications, status, error } = useAppSelector(
        (state) => state.titleApplications
    );

    useEffect(() => {
        dispatch(fetchMyApplications());
    }, [dispatch]);

    const isLoading = status === "loading";

    const draftCount = applications.filter(
        (application) => application.status === "DRAFT"
    ).length;

    const submittedCount = applications.filter(
        (application) =>
            application.status === "SUBMITTED" ||
            application.status === "UNDER_REVIEW" ||
            application.status === "NEEDS_MORE_INFO"
    ).length;

    const completedCount = applications.filter(
        (application) =>
            application.status === "APPROVED" ||
            application.status === "REJECTED" ||
            application.status === "TITLE_ISSUED"
    ).length;

    return (
        <Box>
            <PageHeader
                title="Title Applications"
                subtitle="Create, track, and manage dealer title applications through the DMV workflow."
                actions={
                    <Button
                        component={RouterLink}
                        to="/dashboard/title-applications/new"
                        variant="contained"
                    >
                        Create Application
                    </Button>
                }
            />

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {!isLoading && applications.length > 0 && (
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
                                <AssignmentOutlinedIcon />
                            </Box>

                            <Box>
                                <Typography variant="body2" color="text.secondary">
                                    Total Applications
                                </Typography>

                                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                                    {applications.length}
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
                                    backgroundColor: "#FFF4E5",
                                    color: "warning.main",
                                }}
                            >
                                <PendingActionsIcon />
                            </Box>

                            <Box>
                                <Typography variant="body2" color="text.secondary">
                                    Drafts
                                </Typography>

                                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                                    {draftCount}
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
                                <CheckCircleIcon />
                            </Box>

                            <Box>
                                <Typography variant="body2" color="text.secondary">
                                    Completed
                                </Typography>

                                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                                    {completedCount}
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
                                <PendingActionsIcon />
                            </Box>

                            <Box>
                                <Typography variant="body2" color="text.secondary">
                                    In Review
                                </Typography>

                                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                                    {submittedCount}
                                </Typography>
                            </Box>
                        </Stack>
                    </Paper>
                </Stack>
            )}

            {isLoading ? (
                <Paper sx={{ p: 6 }}>
                    <Stack sx={{ alignItems: "center" }} spacing={2}>
                        <CircularProgress />
                        <Typography color="text.secondary">
                            Loading title applications...
                        </Typography>
                    </Stack>
                </Paper>
            ) : applications.length === 0 ? (
                <Paper
                    sx={{
                        p: { xs: 4, md: 6 },
                        textAlign: "center",
                        background:
                            "linear-gradient(135deg, #FFFFFF 0%, #EEF5FF 100%)",
                    }}
                >
                    <Stack spacing={2} sx={{ alignItems: "center" }}>
                        <Box
                            sx={{
                                width: 72,
                                height: 72,
                                borderRadius: "24px",
                                display: "grid",
                                placeItems: "center",
                                background:
                                    "linear-gradient(135deg, #4F7DF3 0%, #2F80ED 100%)",
                                color: "white",
                                boxShadow: "0 14px 30px rgba(79, 125, 243, 0.28)",
                            }}
                        >
                            <AssignmentOutlinedIcon fontSize="large" />
                        </Box>

                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 800 }}>
                                No title applications yet
                            </Typography>

                            <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 520 }}>
                                Create your first title application to start the dealer
                                workflow and submit it for DMV review.
                            </Typography>
                        </Box>

                        <Button
                            component={RouterLink}
                            to="/dashboard/title-applications/new"
                            variant="contained"
                        >
                            Create Application
                        </Button>
                    </Stack>
                </Paper>
            ) : (
                <Paper sx={{ overflow: "hidden" }}>
                    <Box sx={{ px: 3, py: 2.5 }}>
                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={1}
                            sx={{
                                justifyContent: "space-between",
                                alignItems: { xs: "flex-start", sm: "center" },
                            }}
                        >
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                    Application Queue
                                </Typography>

                                <Typography variant="body2" color="text.secondary">
                                    {applications.length} application
                                    {applications.length === 1 ? "" : "s"} available
                                </Typography>
                            </Box>
                        </Stack>
                    </Box>

                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Application #</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Vehicle</TableCell>
                                    <TableCell>VIN</TableCell>
                                    <TableCell>Created</TableCell>
                                    <TableCell align="right">Action</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {applications.map((application) => (
                                    <TableRow
                                        key={application.id}
                                        hover
                                        sx={{
                                            "&:last-child td": {
                                                borderBottom: 0,
                                            },
                                        }}
                                    >
                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                sx={{ fontWeight: 800, color: "primary.main" }}
                                            >
                                                {application.applicationNumber}
                                            </Typography>
                                        </TableCell>

                                        <TableCell>
                                            <Chip
                                                label={formatStatus(application.status)}
                                                color={getStatusColor(application.status)}
                                                size="small"
                                            />
                                        </TableCell>

                                        <TableCell>
                                            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                                {application.vehicle.year} {application.vehicle.make}{" "}
                                                {application.vehicle.model}
                                            </Typography>
                                        </TableCell>

                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    fontFamily:
                                                        '"SFMono-Regular", Consolas, "Liberation Mono", monospace',
                                                    color: "text.secondary",
                                                }}
                                            >
                                                {application.vehicle.vin}
                                            </Typography>
                                        </TableCell>

                                        <TableCell>
                                            {new Date(application.createdAt).toLocaleDateString()}
                                        </TableCell>

                                        <TableCell align="right">
                                            <Button
                                                component={RouterLink}
                                                to={`/dashboard/title-applications/${application.id}`}
                                                size="small"
                                                variant="outlined"
                                            >
                                                Open
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}
        </Box>
    );
}
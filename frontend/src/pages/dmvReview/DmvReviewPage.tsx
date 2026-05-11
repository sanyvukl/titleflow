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
import FactCheckIcon from "@mui/icons-material/FactCheck";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import PageHeader from "../../components/common/PageHeader";
import { fetchDmvReviewQueue } from "../../features/dmvReview/dmvReviewSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

function getStatusColor(
    status: string
): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" {
    switch (status) {
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

function DmvReviewPage() {
    const dispatch = useAppDispatch();

    const { applications, status, error } = useAppSelector(
        (state) => state.dmvReview
    );

    useEffect(() => {
        dispatch(fetchDmvReviewQueue());
    }, [dispatch]);

    const isLoading = status === "loading";

    const submittedCount = applications.filter(
        (application) => application.status === "SUBMITTED"
    ).length;

    const underReviewCount = applications.filter(
        (application) => application.status === "UNDER_REVIEW"
    ).length;

    const needsMoreInfoCount = applications.filter(
        (application) => application.status === "NEEDS_MORE_INFO"
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
                title="DMV Review Queue"
                subtitle="Review submitted title applications and process DMV decisions."
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
                                    Total Queue
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
                                    backgroundColor: "#EEF5FF",
                                    color: "info.main",
                                }}
                            >
                                <PendingActionsIcon />
                            </Box>

                            <Box>
                                <Typography variant="body2" color="text.secondary">
                                    Submitted
                                </Typography>

                                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                                    {submittedCount}
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
                                <FactCheckIcon />
                            </Box>

                            <Box>
                                <Typography variant="body2" color="text.secondary">
                                    Under Review
                                </Typography>

                                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                                    {underReviewCount}
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
                </Stack>
            )}

            {!isLoading && needsMoreInfoCount > 0 && (
                <Alert severity="warning" sx={{ mb: 3 }}>
                    {needsMoreInfoCount} application
                    {needsMoreInfoCount === 1 ? "" : "s"} currently require more
                    information from the dealer.
                </Alert>
            )}

            {isLoading ? (
                <Paper sx={{ p: 6 }}>
                    <Stack sx={{ alignItems: "center" }} spacing={2}>
                        <CircularProgress />

                        <Typography color="text.secondary">
                            Loading DMV review queue...
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
                            <FactCheckIcon fontSize="large" />
                        </Box>

                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 800 }}>
                                No applications waiting for DMV review
                            </Typography>

                            <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 560 }}>
                                Submitted applications will appear here when dealers send
                                them into the DMV review workflow.
                            </Typography>
                        </Box>
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
                                    Review Queue
                                </Typography>

                                <Typography variant="body2" color="text.secondary">
                                    {applications.length} application
                                    {applications.length === 1 ? "" : "s"} available for DMV processing
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
                                    <TableCell>Dealer</TableCell>
                                    <TableCell>Submitted</TableCell>
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
                                                sx={{
                                                    fontWeight: 800,
                                                    color: "primary.main",
                                                }}
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
                                            <Typography variant="body2" color="text.secondary">
                                                {application.dealerEmail}
                                            </Typography>
                                        </TableCell>

                                        <TableCell>
                                            {application.submittedAt
                                                ? new Date(
                                                    application.submittedAt
                                                ).toLocaleDateString()
                                                : "N/A"}
                                        </TableCell>

                                        <TableCell align="right">
                                            <Button
                                                component={RouterLink}
                                                to={`/dashboard/dmv-review/${application.id}`}
                                                size="small"
                                                variant="outlined"
                                            >
                                                Review
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

export default DmvReviewPage;
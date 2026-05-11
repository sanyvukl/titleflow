import { useEffect } from "react";
import { Link as RouterLink, useParams } from "react-router";

import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Divider,
    Paper,
    Stack,
    Typography,
} from "@mui/material";

import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import PersonIcon from "@mui/icons-material/Person";
import StorefrontIcon from "@mui/icons-material/Storefront";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

import PageHeader from "../../components/common/PageHeader";

import {
    approveDmvApplication,
    fetchDmvApplicationById,
    rejectDmvApplication,
    requestDmvMoreInfo,
    startDmvReview,
} from "../../features/dmvReview/dmvReviewSlice";

import { fetchDocuments } from "../../features/documents/documentSlice";
import { fetchAuditLogs } from "../../features/auditLogs/auditLogsSlice";

import AuditLogList from "../../features/auditLogs/AuditLogList";
import DocumentList from "../../features/documents/DocumentList";
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

function formatDate(value: string | null): string {
    if (!value) {
        return "N/A";
    }

    return new Date(value).toLocaleString();
}

interface DetailRowProps {
    label: string;
    value: string | number | null;
}

function DetailRow({ label, value }: DetailRowProps) {
    return (
        <Box>
            <Typography variant="caption" color="text.secondary">
                {label}
            </Typography>

            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {value ?? "N/A"}
            </Typography>
        </Box>
    );
}

function DmvReviewDetailsPage() {
    const dispatch = useAppDispatch();
    const { id } = useParams();

    const { selectedApplication, status, error } = useAppSelector(
        (state) => state.dmvReview
    );

    useEffect(() => {
        if (id) {
            const applicationId = Number(id);

            dispatch(fetchDmvApplicationById(applicationId));
            dispatch(fetchDocuments(applicationId));
            dispatch(fetchAuditLogs(applicationId));
        }
    }, [dispatch, id]);

    const isLoading = status === "loading";

    const handleStartReview = async () => {
        if (selectedApplication) {
            await dispatch(startDmvReview(selectedApplication.id));
        }
    };

    const handleRequestMoreInfo = async () => {
        if (selectedApplication) {
            await dispatch(requestDmvMoreInfo(selectedApplication.id));
        }
    };

    const handleApprove = async () => {
        if (selectedApplication) {
            await dispatch(approveDmvApplication(selectedApplication.id));
        }
    };

    const handleReject = async () => {
        if (selectedApplication) {
            await dispatch(rejectDmvApplication(selectedApplication.id));
        }
    };

    if (isLoading && !selectedApplication) {
        return (
            <Paper sx={{ p: 6 }}>
                <Stack sx={{ alignItems: "center" }} spacing={2}>
                    <CircularProgress />

                    <Typography color="text.secondary">
                        Loading DMV review details...
                    </Typography>
                </Stack>
            </Paper>
        );
    }

    if (!selectedApplication) {
        return <Alert severity="warning">Application was not found.</Alert>;
    }

    const canStartReview = selectedApplication.status === "SUBMITTED";
    const canDecide = selectedApplication.status === "UNDER_REVIEW";
    const isFinalDecision =
        selectedApplication.status === "APPROVED" ||
        selectedApplication.status === "REJECTED" ||
        selectedApplication.status === "TITLE_ISSUED";

    return (
        <Box>
            <PageHeader
                title={`DMV Review ${selectedApplication.applicationNumber}`}
                subtitle="Review title application details, supporting documents, and process a DMV decision."
                actions={
                    <Button
                        component={RouterLink}
                        to="/dashboard/dmv-review"
                        variant="outlined"
                    >
                        Back to Review Queue
                    </Button>
                }
            />

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <Paper
                sx={{
                    mb: 3,
                    overflow: "hidden",
                    background:
                        "linear-gradient(135deg, #061E3A 0%, #082B55 55%, #123E73 100%)",
                    color: "white",
                }}
            >
                <Box sx={{ p: { xs: 3, md: 4 } }}>
                    <Stack
                        direction={{ xs: "column", md: "row" }}
                        spacing={3}
                        sx={{
                            justifyContent: "space-between",
                            alignItems: { xs: "flex-start", md: "center" },
                        }}
                    >
                        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                            <Box
                                sx={{
                                    width: 56,
                                    height: 56,
                                    borderRadius: "18px",
                                    display: "grid",
                                    placeItems: "center",
                                    background:
                                        "linear-gradient(135deg, #4F7DF3 0%, #2F80ED 100%)",
                                    boxShadow: "0 14px 30px rgba(79, 125, 243, 0.32)",
                                }}
                            >
                                <FactCheckIcon />
                            </Box>

                            <Box>
                                <Typography
                                    variant="h5"
                                    sx={{ color: "white", fontWeight: 900 }}
                                >
                                    DMV Decision Workspace
                                </Typography>

                                <Typography
                                    variant="body2"
                                    sx={{ color: "rgba(255, 255, 255, 0.72)", mt: 0.5 }}
                                >
                                    Validate application data, review documents, and update workflow status.
                                </Typography>
                            </Box>
                        </Stack>

                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={1.5}
                            sx={{ alignItems: { xs: "flex-start", sm: "center" } }}
                        >
                            <Chip
                                label={formatStatus(selectedApplication.status)}
                                color={getStatusColor(selectedApplication.status)}
                                sx={{ fontWeight: 800 }}
                            />

                            <Chip
                                label={`Submitted ${formatDate(selectedApplication.submittedAt)}`}
                                sx={{
                                    color: "white",
                                    backgroundColor: "rgba(255, 255, 255, 0.12)",
                                    border: "1px solid rgba(255, 255, 255, 0.18)",
                                    fontWeight: 800,
                                }}
                            />
                        </Stack>
                    </Stack>
                </Box>
            </Paper>

            {canStartReview && (
                <Alert severity="info" sx={{ mb: 3 }}>
                    This application has been submitted by the dealer and is ready to enter DMV review.
                </Alert>
            )}

            {canDecide && (
                <Alert severity="warning" sx={{ mb: 3 }}>
                    This application is currently under review. Choose a final decision or request more information.
                </Alert>
            )}

            {isFinalDecision && (
                <Alert severity="success" sx={{ mb: 3 }}>
                    This application already has a final DMV decision.
                </Alert>
            )}

            <Stack spacing={3}>
                <Paper sx={{ overflow: "hidden" }}>
                    <Box
                        sx={{
                            px: { xs: 3, md: 4 },
                            py: 3,
                            backgroundColor: "#F8FBFF",
                            borderBottom: "1px solid #E2E8F0",
                        }}
                    >
                        <Stack
                            direction={{ xs: "column", md: "row" }}
                            spacing={2}
                            sx={{
                                justifyContent: "space-between",
                                alignItems: { xs: "flex-start", md: "center" },
                            }}
                        >
                            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
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
                                    <AssignmentTurnedInIcon />
                                </Box>

                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                        Review Actions
                                    </Typography>

                                    <Typography variant="body2" color="text.secondary">
                                        Process the next valid workflow transition.
                                    </Typography>
                                </Box>
                            </Stack>

                            <Stack
                                direction={{ xs: "column", sm: "row" }}
                                spacing={1.5}
                                sx={{ alignItems: { xs: "stretch", sm: "center" } }}
                            >
                                {canStartReview && (
                                    <Button
                                        variant="contained"
                                        disabled={isLoading}
                                        onClick={handleStartReview}
                                    >
                                        Start Review
                                    </Button>
                                )}

                                {canDecide && (
                                    <>
                                        <Button
                                            variant="outlined"
                                            color="warning"
                                            disabled={isLoading}
                                            startIcon={<WarningAmberIcon />}
                                            onClick={handleRequestMoreInfo}
                                        >
                                            Request More Info
                                        </Button>

                                        <Button
                                            variant="contained"
                                            color="success"
                                            disabled={isLoading}
                                            onClick={handleApprove}
                                        >
                                            Approve
                                        </Button>

                                        <Button
                                            variant="contained"
                                            color="error"
                                            disabled={isLoading}
                                            onClick={handleReject}
                                        >
                                            Reject
                                        </Button>
                                    </>
                                )}

                                {!canStartReview && !canDecide && (
                                    <Chip
                                        label="No actions available"
                                        variant="outlined"
                                        sx={{ fontWeight: 800 }}
                                    />
                                )}
                            </Stack>
                        </Stack>
                    </Box>

                    <Stack spacing={0} divider={<Divider />}>
                        <Box sx={{ p: { xs: 3, md: 4 } }}>
                            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 3 }}>
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
                                    <DirectionsCarIcon />
                                </Box>

                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                        Vehicle Information
                                    </Typography>

                                    <Typography variant="body2" color="text.secondary">
                                        Vehicle data submitted by the dealer.
                                    </Typography>
                                </Box>
                            </Stack>

                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
                                    gap: 2,
                                }}
                            >
                                <DetailRow label="VIN" value={selectedApplication.vehicle.vin} />
                                <DetailRow label="Year" value={selectedApplication.vehicle.year} />
                                <DetailRow label="Make" value={selectedApplication.vehicle.make} />
                                <DetailRow label="Model" value={selectedApplication.vehicle.model} />
                                <DetailRow label="Color" value={selectedApplication.vehicle.color} />
                                <DetailRow label="Odometer" value={selectedApplication.vehicle.odometer} />
                            </Box>
                        </Box>

                        <Box sx={{ p: { xs: 3, md: 4 } }}>
                            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 3 }}>
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
                                    <PersonIcon />
                                </Box>

                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                        Buyer Information
                                    </Typography>

                                    <Typography variant="body2" color="text.secondary">
                                        New owner information for title processing.
                                    </Typography>
                                </Box>
                            </Stack>

                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
                                    gap: 2,
                                }}
                            >
                                <DetailRow
                                    label="Name"
                                    value={`${selectedApplication.buyerOwner.firstName ?? ""} ${
                                        selectedApplication.buyerOwner.lastName ?? ""
                                    }`.trim()}
                                />
                                <DetailRow label="Owner Type" value={selectedApplication.buyerOwner.ownerType} />
                                <DetailRow label="City" value={selectedApplication.buyerOwner.city} />
                                <DetailRow label="State" value={selectedApplication.buyerOwner.state} />
                                <DetailRow label="ZIP Code" value={selectedApplication.buyerOwner.zipCode} />
                                <DetailRow
                                    label="Address"
                                    value={selectedApplication.buyerOwner.addressLine1}
                                />
                            </Box>
                        </Box>

                        <Box sx={{ p: { xs: 3, md: 4 } }}>
                            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 3 }}>
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
                                    <StorefrontIcon />
                                </Box>

                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                        Seller Information
                                    </Typography>

                                    <Typography variant="body2" color="text.secondary">
                                        Previous owner or seller information.
                                    </Typography>
                                </Box>
                            </Stack>

                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
                                    gap: 2,
                                }}
                            >
                                <DetailRow
                                    label="Name"
                                    value={`${selectedApplication.sellerOwner.firstName ?? ""} ${
                                        selectedApplication.sellerOwner.lastName ?? ""
                                    }`.trim()}
                                />
                                <DetailRow label="Owner Type" value={selectedApplication.sellerOwner.ownerType} />
                                <DetailRow label="City" value={selectedApplication.sellerOwner.city} />
                                <DetailRow label="State" value={selectedApplication.sellerOwner.state} />
                                <DetailRow label="ZIP Code" value={selectedApplication.sellerOwner.zipCode} />
                                <DetailRow
                                    label="Address"
                                    value={selectedApplication.sellerOwner.addressLine1}
                                />
                            </Box>
                        </Box>
                    </Stack>
                </Paper>

                <DocumentList applicationId={selectedApplication.id} />

                <AuditLogList />
            </Stack>
        </Box>
    );
}

export default DmvReviewDetailsPage;
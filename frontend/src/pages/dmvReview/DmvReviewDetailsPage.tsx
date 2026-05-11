import type { ReactNode } from "react";
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

interface VehicleReviewRecord {
    vin: string;
    year: number;
    make: string;
    model: string;
    bodyType: string | null;
    color: string | null;
    odometer: number | null;
}

interface OwnerReviewRecord {
    firstName: string | null;
    lastName: string | null;
    businessName: string | null;
    addressLine1: string;
    addressLine2: string | null;
    city: string;
    state: string;
    zipCode: string;
    phone: string | null;
    email: string | null;
    ownerType: string;
}

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

function formatOwnerType(ownerType: string): string {
    if (ownerType === "INDIVIDUAL") {
        return "Individual person";
    }

    if (ownerType === "BUSINESS") {
        return "Business or dealership";
    }

    return formatStatus(ownerType);
}

function formatDate(value: string | null): string {
    if (!value) {
        return "N/A";
    }

    return new Date(value).toLocaleString();
}

function formatFullName(owner: OwnerReviewRecord): string {
    if (owner.ownerType === "BUSINESS") {
        return owner.businessName || "N/A";
    }

    return `${owner.firstName ?? ""} ${owner.lastName ?? ""}`.trim() || "N/A";
}

function formatAddress(owner: OwnerReviewRecord): string {
    const parts = [
        owner.addressLine1,
        owner.addressLine2,
        owner.city,
        owner.state,
        owner.zipCode,
    ].filter(Boolean);

    return parts.join(", ");
}

interface DetailRowProps {
    label: string;
    value: string | number | null | undefined;
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

            <ReviewStatusBanner
                status={selectedApplication.status}
                submittedAt={selectedApplication.submittedAt}
            />

            <ReviewWorkflowAlert
                canStartReview={canStartReview}
                canDecide={canDecide}
                isFinalDecision={isFinalDecision}
            />

            <Stack spacing={3}>
                <Paper sx={{ overflow: "hidden" }}>
                    <ReviewActionsPanel
                        isLoading={isLoading}
                        canStartReview={canStartReview}
                        canDecide={canDecide}
                        onStartReview={handleStartReview}
                        onRequestMoreInfo={handleRequestMoreInfo}
                        onApprove={handleApprove}
                        onReject={handleReject}
                    />

                    <Stack spacing={0} divider={<Divider />}>
                        <VehicleReviewSection vehicle={selectedApplication.vehicle} />

                        <OwnerReviewSection
                            title="Buyer / New Owner"
                            subtitle="New owner information submitted for title processing."
                            icon={<PersonIcon />}
                            iconBackground="#EAF7EA"
                            iconColor="success.main"
                            owner={selectedApplication.buyerOwner}
                        />

                        <OwnerReviewSection
                            title="Seller / Previous Owner"
                            subtitle="Previous owner or selling party information."
                            icon={<StorefrontIcon />}
                            iconBackground="#FFF4E5"
                            iconColor="warning.main"
                            owner={selectedApplication.sellerOwner}
                        />
                    </Stack>
                </Paper>

                <DocumentList applicationId={selectedApplication.id} />

                <AuditLogList />
            </Stack>
        </Box>
    );
}

interface ReviewStatusBannerProps {
    status: string;
    submittedAt: string | null;
}

function ReviewStatusBanner({ status, submittedAt }: ReviewStatusBannerProps) {
    return (
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
                                sx={{
                                    color: "rgba(255, 255, 255, 0.72)",
                                    mt: 0.5,
                                }}
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
                            label={formatStatus(status)}
                            color={getStatusColor(status)}
                            sx={{ fontWeight: 800 }}
                        />

                        <Chip
                            label={`Submitted ${formatDate(submittedAt)}`}
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
    );
}

interface ReviewWorkflowAlertProps {
    canStartReview: boolean;
    canDecide: boolean;
    isFinalDecision: boolean;
}

function ReviewWorkflowAlert({
                                 canStartReview,
                                 canDecide,
                                 isFinalDecision,
                             }: ReviewWorkflowAlertProps) {
    if (canStartReview) {
        return (
            <Alert severity="info" sx={{ mb: 3 }}>
                This application has been submitted by the dealer and is ready to enter DMV review.
            </Alert>
        );
    }

    if (canDecide) {
        return (
            <Alert severity="warning" sx={{ mb: 3 }}>
                This application is currently under review. Choose a final decision or request more information.
            </Alert>
        );
    }

    if (isFinalDecision) {
        return (
            <Alert severity="success" sx={{ mb: 3 }}>
                This application already has a final DMV decision.
            </Alert>
        );
    }

    return null;
}

interface ReviewActionsPanelProps {
    isLoading: boolean;
    canStartReview: boolean;
    canDecide: boolean;
    onStartReview: () => void;
    onRequestMoreInfo: () => void;
    onApprove: () => void;
    onReject: () => void;
}

function ReviewActionsPanel({
                                isLoading,
                                canStartReview,
                                canDecide,
                                onStartReview,
                                onRequestMoreInfo,
                                onApprove,
                                onReject,
                            }: ReviewActionsPanelProps) {
    return (
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
                            onClick={onStartReview}
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
                                onClick={onRequestMoreInfo}
                            >
                                Request More Info
                            </Button>

                            <Button
                                variant="contained"
                                color="success"
                                disabled={isLoading}
                                onClick={onApprove}
                            >
                                Approve
                            </Button>

                            <Button
                                variant="contained"
                                color="error"
                                disabled={isLoading}
                                onClick={onReject}
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
    );
}

interface SectionHeaderProps {
    title: string;
    subtitle: string;
    icon: ReactNode;
    iconBackground: string;
    iconColor: string;
}

function SectionHeader({
                           title,
                           subtitle,
                           icon,
                           iconBackground,
                           iconColor,
                       }: SectionHeaderProps) {
    return (
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 3 }}>
            <Box
                sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "14px",
                    display: "grid",
                    placeItems: "center",
                    backgroundColor: iconBackground,
                    color: iconColor,
                    flexShrink: 0,
                }}
            >
                {icon}
            </Box>

            <Box>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    {title}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                    {subtitle}
                </Typography>
            </Box>
        </Stack>
    );
}

interface VehicleReviewSectionProps {
    vehicle: VehicleReviewRecord;
}

function VehicleReviewSection({ vehicle }: VehicleReviewSectionProps) {
    return (
        <Box sx={{ p: { xs: 3, md: 4 } }}>
            <SectionHeader
                title="Vehicle Record"
                subtitle="Vehicle data submitted by the dealer."
                icon={<DirectionsCarIcon />}
                iconBackground="#EEF5FF"
                iconColor="primary.main"
            />

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
                    gap: 2,
                }}
            >
                <DetailRow label="VIN" value={vehicle.vin} />
                <DetailRow label="Model Year" value={vehicle.year} />
                <DetailRow label="Make" value={vehicle.make} />
                <DetailRow label="Model" value={vehicle.model} />
                <DetailRow label="Body Style" value={vehicle.bodyType} />
                <DetailRow label="Exterior Color" value={vehicle.color} />
                <DetailRow label="Odometer Reading" value={vehicle.odometer} />
            </Box>
        </Box>
    );
}

interface OwnerReviewSectionProps {
    title: string;
    subtitle: string;
    icon: ReactNode;
    iconBackground: string;
    iconColor: string;
    owner: OwnerReviewRecord;
}

function OwnerReviewSection({
                                title,
                                subtitle,
                                icon,
                                iconBackground,
                                iconColor,
                                owner,
                            }: OwnerReviewSectionProps) {
    const isBusiness = owner.ownerType === "BUSINESS";

    return (
        <Box sx={{ p: { xs: 3, md: 4 } }}>
            <SectionHeader
                title={title}
                subtitle={subtitle}
                icon={icon}
                iconBackground={iconBackground}
                iconColor={iconColor}
            />

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
                    gap: 2,
                }}
            >
                <DetailRow label="Ownership Type" value={formatOwnerType(owner.ownerType)} />

                <DetailRow
                    label={isBusiness ? "Business Name" : "Full Name"}
                    value={formatFullName(owner)}
                />

                {!isBusiness && (
                    <>
                        <DetailRow label="First Name" value={owner.firstName} />
                        <DetailRow label="Last Name" value={owner.lastName} />
                    </>
                )}

                {isBusiness && (
                    <DetailRow label="Business Name" value={owner.businessName} />
                )}

                <DetailRow label="Street Address" value={owner.addressLine1} />
                <DetailRow
                    label="Apartment, Suite, Unit"
                    value={owner.addressLine2}
                />
                <DetailRow label="City" value={owner.city} />
                <DetailRow label="State" value={owner.state} />
                <DetailRow label="ZIP Code" value={owner.zipCode} />
                <DetailRow label="Phone Number" value={owner.phone} />
                <DetailRow label="Email Address" value={owner.email} />
                <DetailRow label="Full Mailing Address" value={formatAddress(owner)} />
            </Box>
        </Box>
    );
}

export default DmvReviewDetailsPage;
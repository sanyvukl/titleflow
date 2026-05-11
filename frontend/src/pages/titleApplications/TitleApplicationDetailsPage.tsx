import type { ChangeEventHandler, SubmitEventHandler } from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

import {
    Alert,
    Box,
    Button,
    Chip,
    Divider,
    Paper,
    Stack,
    TextField,
    Typography,
    CircularProgress,
} from "@mui/material";

import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PersonIcon from "@mui/icons-material/Person";
import StorefrontIcon from "@mui/icons-material/Storefront";
import LockIcon from "@mui/icons-material/Lock";
import EditNoteIcon from "@mui/icons-material/EditNote";

import PageHeader from "../../components/common/PageHeader";
import { fetchDocuments } from "../../features/documents/documentSlice";
import { fetchAuditLogs } from "../../features/auditLogs/auditLogsSlice";

import AuditLogList from "../../features/auditLogs/AuditLogList";
import DocumentList from "../../features/documents/DocumentList";
import DocumentUpload from "../../features/documents/DocumentUpload";

import {
    fetchApplicationById,
    submitTitleApplication,
    updateTitleApplication,
} from "../../features/titleApplications/titleApplicationsSlice";

import { useAppDispatch, useAppSelector } from "../../store/hooks";

import type {
    OwnerRequest,
    VehicleRequest,
} from "../../types/titleApplicationTypes";

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

function parseOptionalNumber(value: string): number | null {
    if (value.trim() === "") {
        return null;
    }

    return Number(value);
}

function TitleApplicationDetailsPage() {
    const dispatch = useAppDispatch();
    const { id } = useParams();

    const { selectedApplication, status, error } = useAppSelector(
        (state) => state.titleApplications
    );

    const [vehicle, setVehicle] = useState<VehicleRequest | null>(null);
    const [buyerOwner, setBuyerOwner] = useState<OwnerRequest | null>(null);
    const [sellerOwner, setSellerOwner] = useState<OwnerRequest | null>(null);

    useEffect(() => {
        if (id) {
            const applicationId = Number(id);

            dispatch(fetchApplicationById(applicationId));
            dispatch(fetchDocuments(applicationId));
            dispatch(fetchAuditLogs(applicationId));
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (selectedApplication) {
            setVehicle({
                vin: selectedApplication.vehicle.vin,
                year: selectedApplication.vehicle.year,
                make: selectedApplication.vehicle.make,
                model: selectedApplication.vehicle.model,
                bodyType: selectedApplication.vehicle.bodyType,
                color: selectedApplication.vehicle.color,
                odometer: selectedApplication.vehicle.odometer,
            });

            setBuyerOwner({
                firstName: selectedApplication.buyerOwner.firstName,
                lastName: selectedApplication.buyerOwner.lastName,
                businessName: selectedApplication.buyerOwner.businessName,
                addressLine1: selectedApplication.buyerOwner.addressLine1,
                addressLine2: selectedApplication.buyerOwner.addressLine2,
                city: selectedApplication.buyerOwner.city,
                state: selectedApplication.buyerOwner.state,
                zipCode: selectedApplication.buyerOwner.zipCode,
                phone: selectedApplication.buyerOwner.phone,
                email: selectedApplication.buyerOwner.email,
                ownerType: selectedApplication.buyerOwner.ownerType,
            });

            setSellerOwner({
                firstName: selectedApplication.sellerOwner.firstName,
                lastName: selectedApplication.sellerOwner.lastName,
                businessName: selectedApplication.sellerOwner.businessName,
                addressLine1: selectedApplication.sellerOwner.addressLine1,
                addressLine2: selectedApplication.sellerOwner.addressLine2,
                city: selectedApplication.sellerOwner.city,
                state: selectedApplication.sellerOwner.state,
                zipCode: selectedApplication.sellerOwner.zipCode,
                phone: selectedApplication.sellerOwner.phone,
                email: selectedApplication.sellerOwner.email,
                ownerType: selectedApplication.sellerOwner.ownerType,
            });
        }
    }, [selectedApplication]);

    const isLoading = status === "loading";
    const canEditApplication =
        selectedApplication?.status === "DRAFT" ||
        selectedApplication?.status === "NEEDS_MORE_INFO";

    const isDraft = selectedApplication?.status === "DRAFT";
    const needsMoreInfo = selectedApplication?.status === "NEEDS_MORE_INFO";
    const isReadOnly = !canEditApplication;

    const canUploadDocuments =
        selectedApplication?.status === "DRAFT" ||
        selectedApplication?.status === "NEEDS_MORE_INFO";

    const handleVehicleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        const { name, value } = event.target;

        setVehicle((currentVehicle) => {
            if (!currentVehicle) {
                return currentVehicle;
            }

            return {
                ...currentVehicle,
                [name]:
                    name === "year"
                        ? Number(value)
                        : name === "odometer"
                            ? parseOptionalNumber(value)
                            : value,
            };
        });
    };

    const handleBuyerChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        const { name, value } = event.target;

        setBuyerOwner((currentBuyer) => {
            if (!currentBuyer) {
                return currentBuyer;
            }

            return {
                ...currentBuyer,
                [name]: value,
            };
        });
    };

    const handleSellerChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        const { name, value } = event.target;

        setSellerOwner((currentSeller) => {
            if (!currentSeller) {
                return currentSeller;
            }

            return {
                ...currentSeller,
                [name]: value,
            };
        });
    };

    const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();

        if (!selectedApplication || !vehicle || !buyerOwner || !sellerOwner) {
            return;
        }

        await dispatch(
            updateTitleApplication({
                applicationId: selectedApplication.id,
                request: {
                    vehicle,
                    buyerOwner,
                    sellerOwner,
                },
            })
        );
    };

    const handleSubmitApplication = async () => {
        if (!selectedApplication) {
            return;
        }

        await dispatch(submitTitleApplication(selectedApplication.id));
    };

    if (isLoading && !selectedApplication) {
        return (
            <Paper sx={{ p: 6 }}>
                <Stack sx={{ alignItems: "center" }} spacing={2}>
                    <CircularProgress />
                    <Typography color="text.secondary">
                        Loading title application...
                    </Typography>
                </Stack>
            </Paper>
        );
    }

    if (!selectedApplication || !vehicle || !buyerOwner || !sellerOwner) {
        return <Alert severity="warning">Title application was not found.</Alert>;
    }

    return (
        <Box>
            <PageHeader
                title={`Application ${selectedApplication.applicationNumber}`}
                subtitle={
                    canEditApplication
                        ? needsMoreInfo
                            ? "Update the requested information and resubmit this application."
                            : "Edit draft application details before DMV submission."
                        : "Review submitted application details and supporting records."
                }
                actions={
                    <Button
                        type="button"
                        variant="outlined"
                        onClick={() => history.back()}
                    >
                        Back
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
                        isDraft
                            ? "linear-gradient(135deg, #061E3A 0%, #082B55 55%, #123E73 100%)"
                            : "linear-gradient(135deg, #0B2545 0%, #0B2D57 55%, #34516F 100%)",
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
                                    width: 54,
                                    height: 54,
                                    borderRadius: "18px",
                                    display: "grid",
                                    placeItems: "center",
                                    background:
                                        "linear-gradient(135deg, #4F7DF3 0%, #2F80ED 100%)",
                                    boxShadow: "0 14px 30px rgba(79, 125, 243, 0.32)",
                                }}
                            >
                                {isDraft ? <EditNoteIcon /> : <LockIcon />}
                            </Box>

                            <Box>
                                <Typography
                                    variant="h5"
                                    sx={{ color: "white", fontWeight: 900 }}
                                >
                                    {isDraft ? "Draft Application" : "Locked Application"}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    sx={{ color: "rgba(255, 255, 255, 0.72)", mt: 0.5 }}
                                >
                                    {isDraft
                                        ? "You can still update this application before submitting it."
                                        : "This application is read-only after submission."}
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

                            {selectedApplication.submittedAt && (
                                <Chip
                                    label={`Submitted ${new Date(
                                        selectedApplication.submittedAt
                                    ).toLocaleDateString()}`}
                                    sx={{
                                        color: "white",
                                        backgroundColor: "rgba(255, 255, 255, 0.12)",
                                        border: "1px solid rgba(255, 255, 255, 0.18)",
                                        fontWeight: 800,
                                    }}
                                />
                            )}
                        </Stack>
                    </Stack>
                </Box>
            </Paper>

            {isReadOnly && (
                <Alert severity="info" sx={{ mb: 3 }}>
                    This application has already been submitted and cannot be edited.
                    Documents and audit history remain available below.
                </Alert>
            )}

            <Paper component="form" onSubmit={handleSubmit} sx={{ overflow: "hidden" }}>
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
                                    Core title data tied to the vehicle record.
                                </Typography>
                            </Box>
                        </Stack>

                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                                gap: 2,
                            }}
                        >
                            <TextField
                                label="VIN"
                                name="vin"
                                value={vehicle.vin}
                                onChange={handleVehicleChange}
                                disabled={isReadOnly}
                                required
                                fullWidth
                            />

                            <TextField
                                label="Year"
                                name="year"
                                type="number"
                                value={vehicle.year}
                                onChange={handleVehicleChange}
                                disabled={isReadOnly}
                                required
                                fullWidth
                            />

                            <TextField
                                label="Make"
                                name="make"
                                value={vehicle.make}
                                onChange={handleVehicleChange}
                                disabled={isReadOnly}
                                required
                                fullWidth
                            />

                            <TextField
                                label="Model"
                                name="model"
                                value={vehicle.model}
                                onChange={handleVehicleChange}
                                disabled={isReadOnly}
                                required
                                fullWidth
                            />

                            <TextField
                                label="Color"
                                name="color"
                                value={vehicle.color ?? ""}
                                onChange={handleVehicleChange}
                                disabled={isReadOnly}
                                fullWidth
                            />

                            <TextField
                                label="Odometer"
                                name="odometer"
                                type="number"
                                value={vehicle.odometer ?? ""}
                                onChange={handleVehicleChange}
                                disabled={isReadOnly}
                                fullWidth
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
                                    New owner information for the title application.
                                </Typography>
                            </Box>
                        </Stack>

                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                                gap: 2,
                            }}
                        >
                            <TextField
                                label="First Name"
                                name="firstName"
                                value={buyerOwner.firstName ?? ""}
                                onChange={handleBuyerChange}
                                disabled={isReadOnly}
                                required
                                fullWidth
                            />

                            <TextField
                                label="Last Name"
                                name="lastName"
                                value={buyerOwner.lastName ?? ""}
                                onChange={handleBuyerChange}
                                disabled={isReadOnly}
                                required
                                fullWidth
                            />

                            <TextField
                                label="Address Line 1"
                                name="addressLine1"
                                value={buyerOwner.addressLine1}
                                onChange={handleBuyerChange}
                                disabled={isReadOnly}
                                required
                                fullWidth
                                sx={{ gridColumn: { xs: "auto", md: "1 / -1" } }}
                            />

                            <TextField
                                label="City"
                                name="city"
                                value={buyerOwner.city}
                                onChange={handleBuyerChange}
                                disabled={isReadOnly}
                                required
                                fullWidth
                            />

                            <TextField
                                label="State"
                                name="state"
                                value={buyerOwner.state}
                                onChange={handleBuyerChange}
                                disabled={isReadOnly}
                                required
                                fullWidth
                            />

                            <TextField
                                label="Zip Code"
                                name="zipCode"
                                value={buyerOwner.zipCode}
                                onChange={handleBuyerChange}
                                disabled={isReadOnly}
                                required
                                fullWidth
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
                                    Previous owner or selling party details.
                                </Typography>
                            </Box>
                        </Stack>

                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                                gap: 2,
                            }}
                        >
                            <TextField
                                label="First Name"
                                name="firstName"
                                value={sellerOwner.firstName ?? ""}
                                onChange={handleSellerChange}
                                disabled={isReadOnly}
                                required
                                fullWidth
                            />

                            <TextField
                                label="Last Name"
                                name="lastName"
                                value={sellerOwner.lastName ?? ""}
                                onChange={handleSellerChange}
                                disabled={isReadOnly}
                                required
                                fullWidth
                            />

                            <TextField
                                label="Address Line 1"
                                name="addressLine1"
                                value={sellerOwner.addressLine1}
                                onChange={handleSellerChange}
                                disabled={isReadOnly}
                                required
                                fullWidth
                                sx={{ gridColumn: { xs: "auto", md: "1 / -1" } }}
                            />

                            <TextField
                                label="City"
                                name="city"
                                value={sellerOwner.city}
                                onChange={handleSellerChange}
                                disabled={isReadOnly}
                                required
                                fullWidth
                            />

                            <TextField
                                label="State"
                                name="state"
                                value={sellerOwner.state}
                                onChange={handleSellerChange}
                                disabled={isReadOnly}
                                required
                                fullWidth
                            />

                            <TextField
                                label="Zip Code"
                                name="zipCode"
                                value={sellerOwner.zipCode}
                                onChange={handleSellerChange}
                                disabled={isReadOnly}
                                required
                                fullWidth
                            />
                        </Box>
                    </Box>

                    {canEditApplication && (
                        <Box
                            sx={{
                                px: { xs: 3, md: 4 },
                                py: 3,
                                backgroundColor: "#F8FBFF",
                            }}
                        >
                            <Stack
                                direction={{ xs: "column", sm: "row" }}
                                spacing={2}
                                sx={{
                                    justifyContent: "flex-end",
                                    alignItems: { xs: "stretch", sm: "center" },
                                }}
                            >
                                <Button type="submit" variant="contained" disabled={isLoading}>
                                    {isLoading ? "Saving..." : "Save Changes"}
                                </Button>

                                <Button
                                    type="button"
                                    variant="outlined"
                                    color="success"
                                    disabled={isLoading}
                                    onClick={handleSubmitApplication}
                                >
                                    {needsMoreInfo ? "Resubmit Application" : "Submit Application"}
                                </Button>
                            </Stack>
                        </Box>
                    )}
                </Stack>
            </Paper>

            <Stack spacing={3} sx={{ mt: 3 }}>
                <DocumentUpload
                    applicationId={selectedApplication.id}
                    canUpload={canUploadDocuments}
                />

                <DocumentList applicationId={selectedApplication.id} />

                <AuditLogList />
            </Stack>
        </Box>
    );
}

export default TitleApplicationDetailsPage;
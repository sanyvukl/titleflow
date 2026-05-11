import type { ChangeEventHandler, ReactNode, SubmitEventHandler } from "react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";

import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Divider,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";

import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PersonIcon from "@mui/icons-material/Person";
import StorefrontIcon from "@mui/icons-material/Storefront";
import LockIcon from "@mui/icons-material/Lock";
import EditNoteIcon from "@mui/icons-material/EditNote";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import PageHeader from "../../components/common/PageHeader";
import { fetchDocuments } from "../../features/documents/documentSlice";
import { fetchAuditLogs } from "../../features/auditLogs/auditLogsSlice";

import AuditLogList from "../../features/auditLogs/AuditLogList";
import DocumentList from "../../features/documents/DocumentList";
import DocumentUpload from "../../features/documents/DocumentUpload";

import { downloadGeneratedTitlePdf } from "../../utils/generatedTitlePdf";

import {
    fetchApplicationById,
    submitTitleApplication,
    updateTitleApplication,
} from "../../features/titleApplications/titleApplicationsSlice";

import { useAppDispatch, useAppSelector } from "../../store/hooks";

import type {
    OwnerRequest,
    UpdateTitleApplicationRequest,
    VehicleRequest,
} from "../../types/titleApplicationTypes";

type OwnerTypeValue = OwnerRequest["ownerType"];

const bodyStyleOptions = [
    "Sedan",
    "SUV",
    "Truck",
    "Coupe",
    "Convertible",
    "Van",
    "Wagon",
    "Hatchback",
    "Motorcycle",
    "Trailer",
    "Other",
];

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

function normalizeOptionalText(value: string): string | null {
    if (value.trim() === "") {
        return null;
    }

    return value;
}

function getBannerTitle(status: string): string {
    switch (status) {
        case "DRAFT":
            return "Draft Application";
        case "NEEDS_MORE_INFO":
            return "More Information Required";
        case "SUBMITTED":
            return "Submitted for DMV Review";
        case "UNDER_REVIEW":
            return "Under DMV Review";
        case "APPROVED":
            return "Approved Application";
        case "REJECTED":
            return "Rejected Application";
        case "TITLE_ISSUED":
            return "Title Issued";
        default:
            return "Application Status";
    }
}

function getBannerDescription(status: string): string {
    switch (status) {
        case "DRAFT":
            return "You can update this application before submitting it to DMV review.";
        case "NEEDS_MORE_INFO":
            return "DMV requested more information. Update the application or upload documents, then resubmit it.";
        case "SUBMITTED":
            return "This application has been submitted and is waiting for DMV review.";
        case "UNDER_REVIEW":
            return "This application is currently being reviewed by a DMV clerk.";
        case "APPROVED":
            return "This application has been approved by DMV and is now read-only.";
        case "REJECTED":
            return "This application has been rejected by DMV and is now read-only.";
        case "TITLE_ISSUED":
            return "The title has been issued and this application is now read-only.";
        default:
            return "Review the current workflow status for this application.";
    }
}

function getBannerIcon(status: string) {
    if (status === "DRAFT") {
        return <EditNoteIcon />;
    }

    if (status === "NEEDS_MORE_INFO") {
        return <WarningAmberIcon />;
    }

    if (status === "APPROVED" || status === "TITLE_ISSUED") {
        return <CheckCircleIcon />;
    }

    return <LockIcon />;
}

function TitleApplicationDetailsPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    const formRef = useRef<HTMLFormElement | null>(null);

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

    const handleBodyTypeChange = (event: SelectChangeEvent<string>) => {
        setVehicle((currentVehicle) => {
            if (!currentVehicle) {
                return currentVehicle;
            }

            return {
                ...currentVehicle,
                bodyType: event.target.value,
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
                [name]:
                    name === "businessName" || name === "addressLine2"
                        ? normalizeOptionalText(value)
                        : value,
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
                [name]:
                    name === "businessName" || name === "addressLine2"
                        ? normalizeOptionalText(value)
                        : value,
            };
        });
    };

    const handleBuyerOwnerTypeChange = (event: SelectChangeEvent<OwnerTypeValue>) => {
        const ownerType = event.target.value as OwnerTypeValue;

        setBuyerOwner((currentBuyer) => {
            if (!currentBuyer) {
                return currentBuyer;
            }

            return {
                ...currentBuyer,
                ownerType,
                firstName: ownerType === "INDIVIDUAL" ? currentBuyer.firstName ?? "" : null,
                lastName: ownerType === "INDIVIDUAL" ? currentBuyer.lastName ?? "" : null,
                businessName:
                    ownerType === "BUSINESS" ? currentBuyer.businessName ?? "" : null,
            };
        });
    };

    const handleSellerOwnerTypeChange = (
        event: SelectChangeEvent<OwnerTypeValue>
    ) => {
        const ownerType = event.target.value as OwnerTypeValue;

        setSellerOwner((currentSeller) => {
            if (!currentSeller) {
                return currentSeller;
            }

            return {
                ...currentSeller,
                ownerType,
                firstName:
                    ownerType === "INDIVIDUAL" ? currentSeller.firstName ?? "" : null,
                lastName: ownerType === "INDIVIDUAL" ? currentSeller.lastName ?? "" : null,
                businessName:
                    ownerType === "BUSINESS" ? currentSeller.businessName ?? "" : null,
            };
        });
    };

    const buildUpdateRequest = (): UpdateTitleApplicationRequest | null => {
        if (!vehicle || !buyerOwner || !sellerOwner) {
            return null;
        }

        return {
            vehicle,
            buyerOwner,
            sellerOwner,
        };
    };

    const isFormValid = (): boolean => {
        const form = formRef.current;

        if (!form) {
            return true;
        }

        if (!form.checkValidity()) {
            form.reportValidity();
            return false;
        }

        return true;
    };

    const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();

        if (!isFormValid()) {
            return;
        }

        if (!selectedApplication) {
            return;
        }

        const request = buildUpdateRequest();

        if (!request) {
            return;
        }

        const updateResult = await dispatch(
            updateTitleApplication({
                applicationId: selectedApplication.id,
                request,
            })
        );

        if (updateTitleApplication.fulfilled.match(updateResult)) {
            dispatch(fetchAuditLogs(selectedApplication.id));
        }
    };

    const handleSubmitApplication = async () => {
        if (!isFormValid()) {
            return;
        }

        if (!selectedApplication) {
            return;
        }

        const request = buildUpdateRequest();

        if (!request) {
            return;
        }

        const updateResult = await dispatch(
            updateTitleApplication({
                applicationId: selectedApplication.id,
                request,
            })
        );

        if (!updateTitleApplication.fulfilled.match(updateResult)) {
            return;
        }

        const submitResult = await dispatch(
            submitTitleApplication(selectedApplication.id)
        );

        if (submitTitleApplication.fulfilled.match(submitResult)) {
            dispatch(fetchApplicationById(selectedApplication.id));
            dispatch(fetchAuditLogs(selectedApplication.id));
        }
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

    const statusLabel = selectedApplication.status;
    const canGenerateTitle = selectedApplication.status === "APPROVED";

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
                        onClick={() => navigate("/dashboard/title-applications")}
                    >
                        Back to Applications
                    </Button>
                }
            />

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <StatusBanner
                status={statusLabel}
                submittedAt={selectedApplication.submittedAt}
                canEditApplication={canEditApplication}
            />

            {isReadOnly && (
                <Alert severity="info" sx={{ mb: 3 }}>
                    This application is currently read-only. Documents and audit history
                    remain available below.
                </Alert>
            )}

            {needsMoreInfo && (
                <Alert severity="warning" sx={{ mb: 3 }}>
                    DMV requested more information. Save your changes and resubmit the
                    application when the missing information is ready.
                </Alert>
            )}

            {canGenerateTitle && (
                <Alert
                    severity="success"
                    sx={{ mb: 3 }}
                    action={
                        <Button
                            color="inherit"
                            size="small"
                            onClick={() => downloadGeneratedTitlePdf(selectedApplication)}
                        >
                            Generate Title PDF
                        </Button>
                    }
                >
                    This application has been approved. You can now generate the title certificate.
                </Alert>
            )}

            <Box component="form" ref={formRef} onSubmit={handleSubmit}>
                <Paper sx={{ overflow: "hidden" }}>
                    <Stack spacing={0} divider={<Divider />}>
                        <VehicleSection
                            vehicle={vehicle}
                            isReadOnly={isReadOnly}
                            onVehicleChange={handleVehicleChange}
                            onBodyTypeChange={handleBodyTypeChange}
                        />

                        <OwnerSection
                            title="Buyer / New Owner"
                            subtitle="Person or business receiving the title."
                            icon={<PersonIcon />}
                            iconBackground="#EAF7EA"
                            iconColor="success.main"
                            owner={buyerOwner}
                            isReadOnly={isReadOnly}
                            sectionKey="buyer"
                            onOwnerChange={handleBuyerChange}
                            onOwnerTypeChange={handleBuyerOwnerTypeChange}
                        />

                        <OwnerSection
                            title="Seller / Previous Owner"
                            subtitle="Person or business transferring ownership."
                            icon={<StorefrontIcon />}
                            iconBackground="#FFF4E5"
                            iconColor="warning.main"
                            owner={sellerOwner}
                            isReadOnly={isReadOnly}
                            sectionKey="seller"
                            onOwnerChange={handleSellerChange}
                            onOwnerTypeChange={handleSellerOwnerTypeChange}
                        />

                        {canEditApplication && (
                            <FormActions
                                isLoading={isLoading}
                                needsMoreInfo={needsMoreInfo}
                                onSubmitApplication={handleSubmitApplication}
                            />
                        )}
                    </Stack>
                </Paper>
            </Box>

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

interface StatusBannerProps {
    status: string;
    submittedAt: string | null;
    canEditApplication: boolean;
}

function StatusBanner({
                          status,
                          submittedAt,
                          canEditApplication,
                      }: StatusBannerProps) {
    return (
        <Paper
            sx={{
                mb: 3,
                overflow: "hidden",
                background: canEditApplication
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
                            {getBannerIcon(status)}
                        </Box>

                        <Box>
                            <Typography
                                variant="h5"
                                sx={{ color: "white", fontWeight: 900 }}
                            >
                                {getBannerTitle(status)}
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{ color: "rgba(255, 255, 255, 0.72)", mt: 0.5 }}
                            >
                                {getBannerDescription(status)}
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
                            color={status === "DRAFT" ? undefined : getStatusColor(status)}
                            sx={{
                                fontWeight: 800,
                                color: status === "DRAFT" ? "#0B2545" : undefined,
                                backgroundColor: status === "DRAFT" ? "#E2E8F0" : undefined,
                                border: status === "DRAFT" ? "1px solid #CBD5E1" : undefined,
                            }}
                        />

                        {submittedAt && (
                            <Chip
                                label={`Submitted ${new Date(submittedAt).toLocaleDateString()}`}
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

interface VehicleSectionProps {
    vehicle: VehicleRequest;
    isReadOnly: boolean;
    onVehicleChange: ChangeEventHandler<HTMLInputElement>;
    onBodyTypeChange: (event: SelectChangeEvent<string>) => void;
}

function VehicleSection({
                            vehicle,
                            isReadOnly,
                            onVehicleChange,
                            onBodyTypeChange,
                        }: VehicleSectionProps) {
    return (
        <Box sx={{ p: { xs: 3, md: 4 } }}>
            <SectionHeader
                title="Vehicle Record"
                subtitle="Required vehicle details used for title processing."
                icon={<DirectionsCarIcon />}
                iconBackground="#EEF5FF"
                iconColor="primary.main"
            />

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
                    onChange={onVehicleChange}
                    disabled={isReadOnly}
                    required
                    fullWidth
                    helperText="Vehicle Identification Number"
                />

                <TextField
                    label="Model Year"
                    name="year"
                    type="number"
                    value={vehicle.year}
                    onChange={onVehicleChange}
                    disabled={isReadOnly}
                    required
                    fullWidth
                />

                <TextField
                    label="Make"
                    name="make"
                    value={vehicle.make}
                    onChange={onVehicleChange}
                    disabled={isReadOnly}
                    required
                    fullWidth
                />

                <TextField
                    label="Model"
                    name="model"
                    value={vehicle.model}
                    onChange={onVehicleChange}
                    disabled={isReadOnly}
                    required
                    fullWidth
                />

                <FormControl fullWidth required disabled={isReadOnly}>
                    <InputLabel id="details-body-style-label">Body Style</InputLabel>

                    <Select
                        labelId="details-body-style-label"
                        label="Body Style"
                        value={vehicle.bodyType ?? ""}
                        onChange={onBodyTypeChange}
                    >
                        {bodyStyleOptions.map((bodyStyle) => (
                            <MenuItem key={bodyStyle} value={bodyStyle}>
                                {bodyStyle}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    label="Exterior Color"
                    name="color"
                    value={vehicle.color ?? ""}
                    onChange={onVehicleChange}
                    disabled={isReadOnly}
                    fullWidth
                />

                <TextField
                    label="Odometer Reading"
                    name="odometer"
                    type="number"
                    value={vehicle.odometer ?? ""}
                    onChange={onVehicleChange}
                    disabled={isReadOnly}
                    fullWidth
                    sx={{ gridColumn: { xs: "auto", md: "1 / 2" } }}
                />
            </Box>
        </Box>
    );
}

interface OwnerSectionProps {
    title: string;
    subtitle: string;
    icon: ReactNode;
    iconBackground: string;
    iconColor: string;
    owner: OwnerRequest;
    isReadOnly: boolean;
    sectionKey: string;
    onOwnerChange: ChangeEventHandler<HTMLInputElement>;
    onOwnerTypeChange: (event: SelectChangeEvent<OwnerTypeValue>) => void;
}

function OwnerSection({
                          title,
                          subtitle,
                          icon,
                          iconBackground,
                          iconColor,
                          owner,
                          isReadOnly,
                          sectionKey,
                          onOwnerChange,
                          onOwnerTypeChange,
                      }: OwnerSectionProps) {
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
                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                    gap: 2,
                }}
            >
                <FormControl fullWidth required disabled={isReadOnly}>
                    <InputLabel id={`${sectionKey}-owner-type-label`}>
                        Ownership Type
                    </InputLabel>

                    <Select
                        labelId={`${sectionKey}-owner-type-label`}
                        label="Ownership Type"
                        value={owner.ownerType}
                        onChange={onOwnerTypeChange}
                    >
                        <MenuItem value="INDIVIDUAL">Individual person</MenuItem>
                        <MenuItem value="BUSINESS">Business or dealership</MenuItem>
                    </Select>
                </FormControl>

                <TextField
                    label={isBusiness ? "Business Name" : "Business Name (Optional)"}
                    name="businessName"
                    value={owner.businessName ?? ""}
                    onChange={onOwnerChange}
                    disabled={isReadOnly || !isBusiness}
                    required={isBusiness}
                    fullWidth
                />

                <TextField
                    label="First Name"
                    name="firstName"
                    value={owner.firstName ?? ""}
                    onChange={onOwnerChange}
                    disabled={isReadOnly || isBusiness}
                    required={!isBusiness}
                    fullWidth
                />

                <TextField
                    label="Last Name"
                    name="lastName"
                    value={owner.lastName ?? ""}
                    onChange={onOwnerChange}
                    disabled={isReadOnly || isBusiness}
                    required={!isBusiness}
                    fullWidth
                />

                <TextField
                    label="Street Address"
                    name="addressLine1"
                    value={owner.addressLine1}
                    onChange={onOwnerChange}
                    disabled={isReadOnly}
                    required
                    fullWidth
                    sx={{ gridColumn: { xs: "auto", md: "1 / -1" } }}
                />

                <TextField
                    label="Apartment, Suite, Unit (Optional)"
                    name="addressLine2"
                    value={owner.addressLine2 ?? ""}
                    onChange={onOwnerChange}
                    disabled={isReadOnly}
                    fullWidth
                    sx={{ gridColumn: { xs: "auto", md: "1 / -1" } }}
                />

                <TextField
                    label="City"
                    name="city"
                    value={owner.city}
                    onChange={onOwnerChange}
                    disabled={isReadOnly}
                    required
                    fullWidth
                />

                <TextField
                    label="State"
                    name="state"
                    value={owner.state}
                    onChange={onOwnerChange}
                    disabled={isReadOnly}
                    required
                    fullWidth
                    placeholder="OH"
                />

                <TextField
                    label="ZIP Code"
                    name="zipCode"
                    value={owner.zipCode}
                    onChange={onOwnerChange}
                    disabled={isReadOnly}
                    required
                    fullWidth
                />

                <TextField
                    label="Phone Number"
                    name="phone"
                    value={owner.phone ?? ""}
                    onChange={onOwnerChange}
                    disabled={isReadOnly}
                    required
                    fullWidth
                    placeholder="2165559300"
                />

                <TextField
                    label="Email Address"
                    name="email"
                    type="email"
                    value={owner.email ?? ""}
                    onChange={onOwnerChange}
                    disabled={isReadOnly}
                    required
                    fullWidth
                    sx={{ gridColumn: { xs: "auto", md: "1 / -1" } }}
                />
            </Box>
        </Box>
    );
}

interface FormActionsProps {
    isLoading: boolean;
    needsMoreInfo: boolean;
    onSubmitApplication: () => void;
}

function FormActions({
                         isLoading,
                         needsMoreInfo,
                         onSubmitApplication,
                     }: FormActionsProps) {
    return (
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
                    onClick={onSubmitApplication}
                >
                    {needsMoreInfo ? "Resubmit Application" : "Submit Application"}
                </Button>
            </Stack>
        </Box>
    );
}

export default TitleApplicationDetailsPage;
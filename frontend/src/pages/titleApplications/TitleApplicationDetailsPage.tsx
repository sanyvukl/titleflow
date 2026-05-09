import type { ChangeEventHandler, SubmitEventHandler } from "react";
import { useEffect, useState } from "react";
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
    TextField,
    Typography,
} from "@mui/material";

import {
    fetchApplicationById,
    updateTitleApplication,
    submitTitleApplication,
} from "../../features/titleApplications/titleApplicationsSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

import type {
    OwnerRequest,
    VehicleRequest,
} from "../../types/titleApplicationTypes";

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
            dispatch(fetchApplicationById(Number(id)));
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
    const isDraft = selectedApplication?.status === "DRAFT";
    const isReadOnly = !isDraft;

    const handleVehicleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        const { name, value } = event.target;

        setVehicle((currentVehicle) => {
            if (!currentVehicle) {
                return currentVehicle;
            }

            return {
                ...currentVehicle,
                [name]: name === "year" || name === "odometer" ? Number(value) : value,
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
            <Stack sx={{ alignItems: "center", py: 6 }}>
                <CircularProgress />
            </Stack>
        );
    }

    if (!selectedApplication || !vehicle || !buyerOwner || !sellerOwner) {
        return <Alert severity="warning">Title application was not found.</Alert>;
    }

    return (
        <Box>
            <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{
                    justifyContent: "space-between",
                    alignItems: { xs: "flex-start", sm: "center" },
                    mb: 3,
                }}
            >
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        Application {selectedApplication.applicationNumber}
                    </Typography>

                    <Typography variant="body1" color="text.secondary">
                        {isDraft
                            ? "Edit draft application details before submission."
                            : "This application is read-only after submission."}
                    </Typography>
                </Box>

                <Button
                    component={RouterLink}
                    to="/dashboard/title-applications"
                    variant="outlined"
                >
                    Back to Applications
                </Button>
            </Stack>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {isReadOnly && (
                <Alert severity="info" sx={{ mb: 2 }}>
                    This application has already been submitted and cannot be edited.
                </Alert>
            )}

            <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
                <Stack spacing={3}>
                    <Box>
                        <Typography variant="h6" sx={{ mb: 1 }}>
                            Status
                        </Typography>

                        <Chip label={selectedApplication.status} />
                    </Box>

                    <Divider />

                    <Box>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Vehicle
                        </Typography>

                        <Stack spacing={2}>
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
                        </Stack>
                    </Box>

                    <Divider />

                    <Box>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Buyer
                        </Typography>

                        <Stack spacing={2}>
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
                        </Stack>
                    </Box>

                    <Divider />

                    <Box>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Seller
                        </Typography>

                        <Stack spacing={2}>
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
                        </Stack>
                    </Box>

                    {isDraft && (
                        <Stack direction="row" spacing={2}>
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
                                Submit Application
                            </Button>
                        </Stack>
                    )}
                </Stack>
            </Paper>
        </Box>
    );
}

export default TitleApplicationDetailsPage;
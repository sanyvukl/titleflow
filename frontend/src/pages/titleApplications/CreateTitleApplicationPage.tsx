import type { ChangeEventHandler, SubmitEventHandler } from "react";
import { useState } from "react";
import { useNavigate } from "react-router";

import {
    Alert,
    Box,
    Button,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import { createTitleApplication } from "../../features/titleApplications/titleApplicationsSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

import type {
    CreateTitleApplicationRequest,
    OwnerRequest,
    VehicleRequest,
} from "../../types/titleApplicationTypes";

const emptyVehicle: VehicleRequest = {
    vin: "",
    year: new Date().getFullYear(),
    make: "",
    model: "",
    bodyType: "",
    color: "",
    odometer: null,
};

const emptyBuyer: OwnerRequest = {
    firstName: "",
    lastName: "",
    businessName: null,
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    email: "",
    ownerType: "INDIVIDUAL",
};

const emptySeller: OwnerRequest = {
    ...emptyBuyer,
};

function CreateTitleApplicationPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { status, error } = useAppSelector((state) => state.titleApplications);

    const [vehicle, setVehicle] = useState<VehicleRequest>(emptyVehicle);
    const [buyerOwner, setBuyerOwner] = useState<OwnerRequest>(emptyBuyer);
    const [sellerOwner, setSellerOwner] = useState<OwnerRequest>(emptySeller);

    const isLoading = status === "loading";

    const handleVehicleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        const { name, value } = event.target;

        setVehicle((currentVehicle) => ({
            ...currentVehicle,
            [name]: name === "year" || name === "odometer" ? Number(value) : value,
        }));
    };

    const handleBuyerChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        const { name, value } = event.target;

        setBuyerOwner((currentBuyer) => ({
            ...currentBuyer,
            [name]: value,
        }));
    };

    const handleSellerChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        const { name, value } = event.target;

        setSellerOwner((currentSeller) => ({
            ...currentSeller,
            [name]: value,
        }));
    };

    const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();

        const request: CreateTitleApplicationRequest = {
            vehicle,
            buyerOwner,
            sellerOwner,
        };

        const result = await dispatch(createTitleApplication(request));

        if (createTitleApplication.fulfilled.match(result)) {
            navigate(`/dashboard/title-applications/${result.payload.id}`);
        }
    };

    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                Create Title Application
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Enter vehicle, buyer, and seller information.
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
                <Stack spacing={4}>
                    <Box>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Vehicle Information
                        </Typography>

                        <Stack spacing={2}>
                            <TextField
                                label="VIN"
                                name="vin"
                                value={vehicle.vin}
                                onChange={handleVehicleChange}
                                required
                                fullWidth
                            />

                            <TextField
                                label="Year"
                                name="year"
                                type="number"
                                value={vehicle.year}
                                onChange={handleVehicleChange}
                                required
                                fullWidth
                            />

                            <TextField
                                label="Make"
                                name="make"
                                value={vehicle.make}
                                onChange={handleVehicleChange}
                                required
                                fullWidth
                            />

                            <TextField
                                label="Model"
                                name="model"
                                value={vehicle.model}
                                onChange={handleVehicleChange}
                                required
                                fullWidth
                            />

                            <TextField
                                label="Color"
                                name="color"
                                value={vehicle.color ?? ""}
                                onChange={handleVehicleChange}
                                fullWidth
                            />

                            <TextField
                                label="Odometer"
                                name="odometer"
                                type="number"
                                value={vehicle.odometer ?? ""}
                                onChange={handleVehicleChange}
                                fullWidth
                            />
                        </Stack>
                    </Box>

                    <Box>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Buyer Information
                        </Typography>

                        <Stack spacing={2}>
                            <TextField
                                label="First Name"
                                name="firstName"
                                value={buyerOwner.firstName ?? ""}
                                onChange={handleBuyerChange}
                                required
                                fullWidth
                            />

                            <TextField
                                label="Last Name"
                                name="lastName"
                                value={buyerOwner.lastName ?? ""}
                                onChange={handleBuyerChange}
                                required
                                fullWidth
                            />

                            <TextField
                                label="Address Line 1"
                                name="addressLine1"
                                value={buyerOwner.addressLine1}
                                onChange={handleBuyerChange}
                                required
                                fullWidth
                            />

                            <TextField
                                label="City"
                                name="city"
                                value={buyerOwner.city}
                                onChange={handleBuyerChange}
                                required
                                fullWidth
                            />

                            <TextField
                                label="State"
                                name="state"
                                value={buyerOwner.state}
                                onChange={handleBuyerChange}
                                required
                                fullWidth
                            />

                            <TextField
                                label="Zip Code"
                                name="zipCode"
                                value={buyerOwner.zipCode}
                                onChange={handleBuyerChange}
                                required
                                fullWidth
                            />
                        </Stack>
                    </Box>

                    <Box>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Seller Information
                        </Typography>

                        <Stack spacing={2}>
                            <TextField
                                label="First Name"
                                name="firstName"
                                value={sellerOwner.firstName ?? ""}
                                onChange={handleSellerChange}
                                required
                                fullWidth
                            />

                            <TextField
                                label="Last Name"
                                name="lastName"
                                value={sellerOwner.lastName ?? ""}
                                onChange={handleSellerChange}
                                required
                                fullWidth
                            />

                            <TextField
                                label="Address Line 1"
                                name="addressLine1"
                                value={sellerOwner.addressLine1}
                                onChange={handleSellerChange}
                                required
                                fullWidth
                            />

                            <TextField
                                label="City"
                                name="city"
                                value={sellerOwner.city}
                                onChange={handleSellerChange}
                                required
                                fullWidth
                            />

                            <TextField
                                label="State"
                                name="state"
                                value={sellerOwner.state}
                                onChange={handleSellerChange}
                                required
                                fullWidth
                            />

                            <TextField
                                label="Zip Code"
                                name="zipCode"
                                value={sellerOwner.zipCode}
                                onChange={handleSellerChange}
                                required
                                fullWidth
                            />
                        </Stack>
                    </Box>

                    <Stack direction="row" spacing={2}>
                        <Button type="submit" variant="contained" disabled={isLoading}>
                            {isLoading ? "Creating..." : "Create Application"}
                        </Button>

                        <Button
                            type="button"
                            variant="outlined"
                            onClick={() => navigate("/dashboard/title-applications")}
                        >
                            Cancel
                        </Button>
                    </Stack>
                </Stack>
            </Paper>
        </Box>
    );
}

export default CreateTitleApplicationPage;
import type { ChangeEventHandler, SubmitEventHandler } from "react";
import { useState } from "react";
import { useNavigate } from "react-router";

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
} from "@mui/material";

import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PersonIcon from "@mui/icons-material/Person";
import StorefrontIcon from "@mui/icons-material/Storefront";

import PageHeader from "../../components/common/PageHeader";
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

function parseOptionalNumber(value: string): number | null {
    if (value.trim() === "") {
        return null;
    }

    return Number(value);
}

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
            [name]:
                name === "year"
                    ? Number(value)
                    : name === "odometer"
                        ? parseOptionalNumber(value)
                        : value,
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
            <PageHeader
                title="Create Title Application"
                subtitle="Enter vehicle, buyer, and seller information to create a draft application."
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

            <Paper
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    overflow: "hidden",
                }}
            >
                <Box
                    sx={{
                        px: { xs: 3, md: 4 },
                        py: 3,
                        background:
                            "linear-gradient(135deg, #061E3A 0%, #082B55 55%, #123E73 100%)",
                        color: "white",
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
                        <Box>
                            <Typography variant="h5" sx={{ color: "white", fontWeight: 900 }}>
                                Draft Application Intake
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{ color: "rgba(255, 255, 255, 0.72)", mt: 0.75 }}
                            >
                                This application will be created as DRAFT before DMV submission.
                            </Typography>
                        </Box>

                        <Chip
                            label="DRAFT"
                            sx={{
                                color: "white",
                                backgroundColor: "rgba(255, 255, 255, 0.12)",
                                border: "1px solid rgba(255, 255, 255, 0.22)",
                                fontWeight: 800,
                            }}
                        />
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
                                    Core vehicle details used for title processing.
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
                                    Person or owner receiving the vehicle title.
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
                                sx={{ gridColumn: { xs: "auto", md: "1 / -1" } }}
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
                                sx={{ gridColumn: { xs: "auto", md: "1 / -1" } }}
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
                        </Box>
                    </Box>

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
                            <Button
                                type="button"
                                variant="outlined"
                                onClick={() => navigate("/dashboard/title-applications")}
                            >
                                Cancel
                            </Button>

                            <Button type="submit" variant="contained" disabled={isLoading}>
                                {isLoading ? "Creating..." : "Create Application"}
                            </Button>
                        </Stack>
                    </Box>
                </Stack>
            </Paper>
        </Box>
    );
}

export default CreateTitleApplicationPage;
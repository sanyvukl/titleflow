import type { ChangeEventHandler, SubmitEventHandler } from "react";
import { useState } from "react";
import { useNavigate } from "react-router";

import {
    Alert,
    Box,
    Button,
    Chip,
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

import PageHeader from "../../components/common/PageHeader";
import { createTitleApplication } from "../../features/titleApplications/titleApplicationsSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

import type {
    CreateTitleApplicationRequest,
    OwnerRequest,
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
    addressLine2: null,
    city: "",
    state: "OH",
    zipCode: "",
    phone: "",
    email: "",
    ownerType: "INDIVIDUAL",
};

const emptySeller: OwnerRequest = {
    firstName: null,
    lastName: null,
    businessName: "",
    addressLine1: "",
    addressLine2: null,
    city: "",
    state: "OH",
    zipCode: "",
    phone: "",
    email: "",
    ownerType: "BUSINESS",
};

const sampleApplications: CreateTitleApplicationRequest[] = [
    {
        vehicle: {
            vin: "1N4BL4BV6MN123458",
            year: 2024,
            make: "Nissan",
            model: "Altima",
            bodyType: "Sedan",
            color: "Black",
            odometer: 39000,
        },
        buyerOwner: {
            firstName: "Samuel",
            lastName: "Reed",
            businessName: null,
            addressLine1: "1800 East 9th Street",
            addressLine2: null,
            city: "Cleveland",
            state: "OH",
            zipCode: "44114",
            phone: "2165559300",
            email: "samuel.buyer@test.com",
            ownerType: "INDIVIDUAL",
        },
        sellerOwner: {
            firstName: null,
            lastName: null,
            businessName: "Metro Auto Sales LLC",
            addressLine1: "3900 Carnegie Avenue",
            addressLine2: null,
            city: "Cleveland",
            state: "OH",
            zipCode: "44115",
            phone: "2165559400",
            email: "metroauto@test.com",
            ownerType: "BUSINESS",
        },
    },
    {
        vehicle: {
            vin: "1G1ZD5ST5LF123456",
            year: 2020,
            make: "Chevrolet",
            model: "Malibu",
            bodyType: "Sedan",
            color: "White",
            odometer: 42500,
        },
        buyerOwner: {
            firstName: "David",
            lastName: "Morgan",
            businessName: null,
            addressLine1: "1220 Carnegie Avenue",
            addressLine2: "Apt 4",
            city: "Cleveland",
            state: "OH",
            zipCode: "44115",
            phone: "2165558100",
            email: "david.buyer@test.com",
            ownerType: "INDIVIDUAL",
        },
        sellerOwner: {
            firstName: null,
            lastName: null,
            businessName: "Cleveland Auto Group LLC",
            addressLine1: "6500 Lorain Avenue",
            addressLine2: null,
            city: "Cleveland",
            state: "OH",
            zipCode: "44102",
            phone: "2165558200",
            email: "clevelandauto@test.com",
            ownerType: "BUSINESS",
        },
    },
    {
        vehicle: {
            vin: "2HGFC2F59LH123456",
            year: 2021,
            make: "Honda",
            model: "Civic",
            bodyType: "Sedan",
            color: "Gray",
            odometer: 31500,
        },
        buyerOwner: {
            firstName: "Emily",
            lastName: "Carter",
            businessName: null,
            addressLine1: "2500 Superior Avenue",
            addressLine2: null,
            city: "Cleveland",
            state: "OH",
            zipCode: "44114",
            phone: "2165551101",
            email: "emily.carter@test.com",
            ownerType: "INDIVIDUAL",
        },
        sellerOwner: {
            firstName: null,
            lastName: null,
            businessName: "North Coast Motors LLC",
            addressLine1: "7100 Brookpark Road",
            addressLine2: null,
            city: "Cleveland",
            state: "OH",
            zipCode: "44129",
            phone: "2165551102",
            email: "northcoast@test.com",
            ownerType: "BUSINESS",
        },
    },
    {
        vehicle: {
            vin: "1C4RJFBG1LC123456",
            year: 2020,
            make: "Jeep",
            model: "Grand Cherokee",
            bodyType: "SUV",
            color: "Blue",
            odometer: 55800,
        },
        buyerOwner: {
            firstName: "Michael",
            lastName: "Brooks",
            businessName: null,
            addressLine1: "1455 West 25th Street",
            addressLine2: null,
            city: "Cleveland",
            state: "OH",
            zipCode: "44113",
            phone: "2165552201",
            email: "michael.brooks@test.com",
            ownerType: "INDIVIDUAL",
        },
        sellerOwner: {
            firstName: null,
            lastName: null,
            businessName: "Lakefront Auto Exchange LLC",
            addressLine1: "5200 Detroit Avenue",
            addressLine2: null,
            city: "Cleveland",
            state: "OH",
            zipCode: "44102",
            phone: "2165552202",
            email: "lakefrontauto@test.com",
            ownerType: "BUSINESS",
        },
    },
    {
        vehicle: {
            vin: "1FTFW1E50LFA12345",
            year: 2020,
            make: "Ford",
            model: "F-150",
            bodyType: "Truck",
            color: "Black",
            odometer: 67200,
        },
        buyerOwner: {
            firstName: null,
            lastName: null,
            businessName: "Reed Construction Group",
            addressLine1: "3100 Lakeside Avenue",
            addressLine2: "Suite 200",
            city: "Cleveland",
            state: "OH",
            zipCode: "44114",
            phone: "2165553301",
            email: "fleet@reedconstruction.test",
            ownerType: "BUSINESS",
        },
        sellerOwner: {
            firstName: null,
            lastName: null,
            businessName: "Work Truck Sales Ohio LLC",
            addressLine1: "8900 Brookpark Road",
            addressLine2: null,
            city: "Cleveland",
            state: "OH",
            zipCode: "44129",
            phone: "2165553302",
            email: "sales@worktruckohio.test",
            ownerType: "BUSINESS",
        },
    },
    {
        vehicle: {
            vin: "2T3P1RFV8LC123456",
            year: 2020,
            make: "Toyota",
            model: "RAV4",
            bodyType: "SUV",
            color: "Silver",
            odometer: 42100,
        },
        buyerOwner: {
            firstName: "Olivia",
            lastName: "Harris",
            businessName: null,
            addressLine1: "8701 Madison Avenue",
            addressLine2: null,
            city: "Cleveland",
            state: "OH",
            zipCode: "44102",
            phone: "2165554401",
            email: "olivia.harris@test.com",
            ownerType: "INDIVIDUAL",
        },
        sellerOwner: {
            firstName: null,
            lastName: null,
            businessName: "Westside Certified Autos LLC",
            addressLine1: "7400 Lorain Avenue",
            addressLine2: null,
            city: "Cleveland",
            state: "OH",
            zipCode: "44102",
            phone: "2165554402",
            email: "westsideautos@test.com",
            ownerType: "BUSINESS",
        },
    },
    {
        vehicle: {
            vin: "4T1C11AK2LU123456",
            year: 2020,
            make: "Toyota",
            model: "Camry",
            bodyType: "Sedan",
            color: "Red",
            odometer: 38900,
        },
        buyerOwner: {
            firstName: "Anthony",
            lastName: "Lewis",
            businessName: null,
            addressLine1: "1111 Chester Avenue",
            addressLine2: "Unit 8",
            city: "Cleveland",
            state: "OH",
            zipCode: "44114",
            phone: "2165555501",
            email: "anthony.lewis@test.com",
            ownerType: "INDIVIDUAL",
        },
        sellerOwner: {
            firstName: null,
            lastName: null,
            businessName: "Downtown Motor Group LLC",
            addressLine1: "1800 Payne Avenue",
            addressLine2: null,
            city: "Cleveland",
            state: "OH",
            zipCode: "44114",
            phone: "2165555502",
            email: "downtownmotors@test.com",
            ownerType: "BUSINESS",
        },
    },
    {
        vehicle: {
            vin: "3VWCB7BU8LM123456",
            year: 2020,
            make: "Volkswagen",
            model: "Jetta",
            bodyType: "Sedan",
            color: "White",
            odometer: 53400,
        },
        buyerOwner: {
            firstName: "Grace",
            lastName: "Parker",
            businessName: null,
            addressLine1: "2240 Euclid Avenue",
            addressLine2: null,
            city: "Cleveland",
            state: "OH",
            zipCode: "44115",
            phone: "2165556601",
            email: "grace.parker@test.com",
            ownerType: "INDIVIDUAL",
        },
        sellerOwner: {
            firstName: null,
            lastName: null,
            businessName: "Euclid Avenue Auto Sales LLC",
            addressLine1: "3400 Euclid Avenue",
            addressLine2: null,
            city: "Cleveland",
            state: "OH",
            zipCode: "44115",
            phone: "2165556602",
            email: "euclidauto@test.com",
            ownerType: "BUSINESS",
        },
    },
    {
        vehicle: {
            vin: "5FNYF6H50LB123456",
            year: 2020,
            make: "Honda",
            model: "Pilot",
            bodyType: "SUV",
            color: "Gray",
            odometer: 58100,
        },
        buyerOwner: {
            firstName: "Daniel",
            lastName: "King",
            businessName: null,
            addressLine1: "9800 Detroit Avenue",
            addressLine2: null,
            city: "Cleveland",
            state: "OH",
            zipCode: "44102",
            phone: "2165557701",
            email: "daniel.king@test.com",
            ownerType: "INDIVIDUAL",
        },
        sellerOwner: {
            firstName: null,
            lastName: null,
            businessName: "Great Lakes Family Auto LLC",
            addressLine1: "10200 Lorain Avenue",
            addressLine2: null,
            city: "Cleveland",
            state: "OH",
            zipCode: "44111",
            phone: "2165557702",
            email: "greatlakesauto@test.com",
            ownerType: "BUSINESS",
        },
    },
    {
        vehicle: {
            vin: "1GNSKCKC5LR123456",
            year: 2020,
            make: "Chevrolet",
            model: "Tahoe",
            bodyType: "SUV",
            color: "Black",
            odometer: 62400,
        },
        buyerOwner: {
            firstName: null,
            lastName: null,
            businessName: "Cleveland Executive Transport LLC",
            addressLine1: "1500 Rockwell Avenue",
            addressLine2: "Suite 310",
            city: "Cleveland",
            state: "OH",
            zipCode: "44114",
            phone: "2165558801",
            email: "admin@cletransport.test",
            ownerType: "BUSINESS",
        },
        sellerOwner: {
            firstName: null,
            lastName: null,
            businessName: "Fleet Remarketing Ohio LLC",
            addressLine1: "4600 Carnegie Avenue",
            addressLine2: null,
            city: "Cleveland",
            state: "OH",
            zipCode: "44103",
            phone: "2165558802",
            email: "fleetremarketing@test.com",
            ownerType: "BUSINESS",
        },
    },
];

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

function CreateTitleApplicationPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { status, error } = useAppSelector((state) => state.titleApplications);

    const [sampleIndex, setSampleIndex] = useState(0);
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

    const handleBodyTypeChange = (event: SelectChangeEvent<string>) => {
        setVehicle((currentVehicle) => ({
            ...currentVehicle,
            bodyType: event.target.value,
        }));
    };

    const handleBuyerChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        const { name, value } = event.target;

        setBuyerOwner((currentBuyer) => ({
            ...currentBuyer,
            [name]:
                name === "addressLine2" || name === "businessName"
                    ? normalizeOptionalText(value)
                    : value,
        }));
    };

    const handleSellerChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        const { name, value } = event.target;

        setSellerOwner((currentSeller) => ({
            ...currentSeller,
            [name]:
                name === "addressLine2" || name === "businessName"
                    ? normalizeOptionalText(value)
                    : value,
        }));
    };

    const handleBuyerOwnerTypeChange = (event: SelectChangeEvent<OwnerTypeValue>) => {
        const ownerType = event.target.value as OwnerTypeValue;

        setBuyerOwner((currentBuyer) => ({
            ...currentBuyer,
            ownerType,
            firstName: ownerType === "INDIVIDUAL" ? currentBuyer.firstName ?? "" : null,
            lastName: ownerType === "INDIVIDUAL" ? currentBuyer.lastName ?? "" : null,
            businessName:
                ownerType === "BUSINESS" ? currentBuyer.businessName ?? "" : null,
        }));
    };

    const handleSellerOwnerTypeChange = (
        event: SelectChangeEvent<OwnerTypeValue>
    ) => {
        const ownerType = event.target.value as OwnerTypeValue;

        setSellerOwner((currentSeller) => ({
            ...currentSeller,
            ownerType,
            firstName:
                ownerType === "INDIVIDUAL" ? currentSeller.firstName ?? "" : null,
            lastName: ownerType === "INDIVIDUAL" ? currentSeller.lastName ?? "" : null,
            businessName:
                ownerType === "BUSINESS" ? currentSeller.businessName ?? "" : null,
        }));
    };

    const handleAutofillSample = () => {
        const sample = sampleApplications[sampleIndex];

        setVehicle({ ...sample.vehicle });
        setBuyerOwner({ ...sample.buyerOwner });
        setSellerOwner({ ...sample.sellerOwner });

        setSampleIndex((currentIndex) => (currentIndex + 1) % sampleApplications.length);
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
                subtitle="Start a draft title application with complete vehicle, buyer, and seller information."
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

            <Paper component="form" onSubmit={handleSubmit} sx={{ overflow: "hidden" }}>
                <IntakeBanner isLoading={isLoading} onAutofillSample={handleAutofillSample} />

                <Stack spacing={0} divider={<Divider />}>
                    <VehicleSection
                        vehicle={vehicle}
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
                        onOwnerChange={handleSellerChange}
                        onOwnerTypeChange={handleSellerOwnerTypeChange}
                    />

                    <FormActions
                        isLoading={isLoading}
                        onCancel={() => navigate("/dashboard/title-applications")}
                    />
                </Stack>
            </Paper>
        </Box>
    );
}

interface IntakeBannerProps {
    isLoading: boolean;
    onAutofillSample: () => void;
}

function IntakeBanner({ isLoading, onAutofillSample }: IntakeBannerProps) {
    return (
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
                        Create a draft record first. Documents and DMV submission happen
                        after the application is saved.
                    </Typography>
                </Box>

                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1.5}
                    sx={{
                        alignItems: { xs: "stretch", sm: "center" },
                    }}
                >
                    <Button
                        type="button"
                        variant="outlined"
                        disabled={isLoading}
                        onClick={onAutofillSample}
                        sx={{
                            color: "white",
                            borderColor: "rgba(255, 255, 255, 0.35)",
                            "&:hover": {
                                borderColor: "white",
                                backgroundColor: "rgba(255, 255, 255, 0.1)",
                            },
                        }}
                    >
                        Autofill Sample
                    </Button>

                    <Chip
                        label="Draft"
                        sx={{
                            color: "white",
                            backgroundColor: "rgba(255, 255, 255, 0.12)",
                            border: "1px solid rgba(255, 255, 255, 0.22)",
                            fontWeight: 800,
                        }}
                    />
                </Stack>
            </Stack>
        </Box>
    );
}
interface SectionHeaderProps {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
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
    onVehicleChange: ChangeEventHandler<HTMLInputElement>;
    onBodyTypeChange: (event: SelectChangeEvent<string>) => void;
}

function VehicleSection({ vehicle, onVehicleChange, onBodyTypeChange }: VehicleSectionProps) {
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
                    required
                    fullWidth
                />

                <TextField
                    label="Make"
                    name="make"
                    value={vehicle.make}
                    onChange={onVehicleChange}
                    required
                    fullWidth
                />

                <TextField
                    label="Model"
                    name="model"
                    value={vehicle.model}
                    onChange={onVehicleChange}
                    required
                    fullWidth
                />

                <FormControl fullWidth required>
                    <InputLabel id="body-style-label">Body Style</InputLabel>

                    <Select
                        labelId="body-style-label"
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
                    fullWidth
                />

                <TextField
                    label="Odometer Reading"
                    name="odometer"
                    type="number"
                    value={vehicle.odometer ?? ""}
                    onChange={onVehicleChange}
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
    icon: React.ReactNode;
    iconBackground: string;
    iconColor: string;
    owner: OwnerRequest;
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
                <FormControl fullWidth required>
                    <InputLabel id={`${title}-owner-type-label`}>
                        Ownership Type
                    </InputLabel>

                    <Select
                        labelId={`${title}-owner-type-label`}
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
                    required={isBusiness}
                    disabled={!isBusiness}
                    fullWidth
                />

                <TextField
                    label="First Name"
                    name="firstName"
                    value={owner.firstName ?? ""}
                    onChange={onOwnerChange}
                    required={!isBusiness}
                    disabled={isBusiness}
                    fullWidth
                />

                <TextField
                    label="Last Name"
                    name="lastName"
                    value={owner.lastName ?? ""}
                    onChange={onOwnerChange}
                    required={!isBusiness}
                    disabled={isBusiness}
                    fullWidth
                />

                <TextField
                    label="Street Address"
                    name="addressLine1"
                    value={owner.addressLine1}
                    onChange={onOwnerChange}
                    required
                    fullWidth
                    sx={{ gridColumn: { xs: "auto", md: "1 / -1" } }}
                />

                <TextField
                    label="Apartment, Suite, Unit (Optional)"
                    name="addressLine2"
                    value={owner.addressLine2 ?? ""}
                    onChange={onOwnerChange}
                    fullWidth
                    sx={{ gridColumn: { xs: "auto", md: "1 / -1" } }}
                />

                <TextField
                    label="City"
                    name="city"
                    value={owner.city}
                    onChange={onOwnerChange}
                    required
                    fullWidth
                />

                <TextField
                    label="State"
                    name="state"
                    value={owner.state}
                    onChange={onOwnerChange}
                    required
                    fullWidth
                    placeholder="OH"
                />

                <TextField
                    label="ZIP Code"
                    name="zipCode"
                    value={owner.zipCode}
                    onChange={onOwnerChange}
                    required
                    fullWidth
                />

                <TextField
                    label="Phone Number"
                    name="phone"
                    value={owner.phone ?? ""}
                    onChange={onOwnerChange}
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
    onCancel: () => void;
}

function FormActions({ isLoading, onCancel }: FormActionsProps) {
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
                <Button type="button" variant="outlined" onClick={onCancel}>
                    Cancel
                </Button>

                <Button type="submit" variant="contained" disabled={isLoading}>
                    {isLoading ? "Creating..." : "Create Draft Application"}
                </Button>
            </Stack>
        </Box>
    );
}

export default CreateTitleApplicationPage;
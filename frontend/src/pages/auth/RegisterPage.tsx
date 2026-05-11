import { useState, type SubmitEventHandler } from "react";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Container,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import ShieldIcon from "@mui/icons-material/Shield";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link, useNavigate } from "react-router";

import { registerUser } from "../../auth/authSlice";
import type { RoleName } from "../../auth/authTypes";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

const allowedRegistrationRoles: RoleName[] = ["DEALER", "DMV_CLERK"];

function RegisterPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { status, error } = useAppSelector((state) => state.auth);

    const [firstName, setFirstName] = useState("Test");
    const [lastName, setLastName] = useState("User");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("password123");
    const [roleName, setRoleName] = useState<RoleName>("DEALER");

    const isLoading = status === "loading";

    const handleRoleChange = (event: SelectChangeEvent<RoleName>) => {
        setRoleName(event.target.value as RoleName);
    };

    const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();

        const result = await dispatch(
            registerUser({
                firstName,
                lastName,
                email,
                password,
                roleName,
            })
        );

        if (registerUser.fulfilled.match(result)) {
            navigate("/dashboard");
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background:
                    "radial-gradient(circle at top right, rgba(79, 125, 243, 0.32), transparent 34%), linear-gradient(135deg, #061E3A 0%, #082B55 48%, #0B2D57 100%)",
                display: "flex",
                alignItems: "center",
                py: 5,
            }}
        >
            <Container maxWidth="lg">
                <Card
                    sx={{
                        overflow: "hidden",
                        borderRadius: "28px",
                        border: "1px solid rgba(255, 255, 255, 0.16)",
                    }}
                >
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", md: "0.95fr 1.05fr" },
                            minHeight: { md: 680 },
                        }}
                    >
                        <Box
                            sx={{
                                p: { xs: 4, md: 6 },
                                color: "white",
                                background:
                                    "linear-gradient(160deg, #061E3A 0%, #082B55 58%, #123E73 100%)",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                            }}
                        >
                            <Stack spacing={4}>
                                <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                                    <Box
                                        sx={{
                                            width: 48,
                                            height: 48,
                                            borderRadius: "16px",
                                            display: "grid",
                                            placeItems: "center",
                                            background:
                                                "linear-gradient(135deg, #4F7DF3 0%, #2F80ED 100%)",
                                            boxShadow: "0 14px 28px rgba(79, 125, 243, 0.36)",
                                        }}
                                    >
                                        <ShieldIcon />
                                    </Box>

                                    <Box>
                                        <Typography variant="h5" sx={{ color: "white", fontWeight: 900 }}>
                                            TitleFlow
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            sx={{ color: "rgba(255, 255, 255, 0.72)" }}
                                        >
                                            Secure Digital Title Processing
                                        </Typography>
                                    </Box>
                                </Stack>

                                <Box>
                                    <Chip
                                        icon={<AccountCircleIcon />}
                                        label="Create a workflow user"
                                        sx={{
                                            mb: 3,
                                            color: "white",
                                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                                            border: "1px solid rgba(255, 255, 255, 0.16)",
                                            "& .MuiChip-icon": {
                                                color: "white",
                                            },
                                        }}
                                    />

                                    <Typography
                                        variant="h3"
                                        component="h1"
                                        sx={{
                                            color: "white",
                                            fontWeight: 900,
                                            letterSpacing: "-0.04em",
                                            lineHeight: 1.05,
                                            mb: 2,
                                        }}
                                    >
                                        Build a secure title processing workspace.
                                    </Typography>

                                    <Typography
                                        variant="body1"
                                        sx={{
                                            color: "rgba(255, 255, 255, 0.76)",
                                            maxWidth: 460,
                                        }}
                                    >
                                        Create a dealer or DMV clerk test account to walk through the
                                        full TitleFlow application lifecycle.
                                    </Typography>
                                </Box>
                            </Stack>

                            <Typography
                                variant="caption"
                                sx={{
                                    color: "rgba(255, 255, 255, 0.52)",
                                    mt: 5,
                                    display: "block",
                                }}
                            >
                                ADMIN and DEVELOPER users should be seeded or managed separately.
                            </Typography>
                        </Box>

                        <CardContent
                            sx={{
                                p: { xs: 4, md: 6 },
                                display: "flex",
                                alignItems: "center",
                                backgroundColor: "white",
                            }}
                        >
                            <Stack spacing={3} sx={{ width: "100%" }}>
                                <Box>
                                    <Typography variant="h4" component="h2" sx={{ fontWeight: 800 }}>
                                        Create account
                                    </Typography>

                                    <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                                        Register a test user for the TitleFlow workflow.
                                    </Typography>
                                </Box>

                                {error && <Alert severity="error">{error}</Alert>}

                                <Box component="form" onSubmit={handleSubmit}>
                                    <Stack spacing={2.5}>
                                        <Stack
                                            direction={{ xs: "column", sm: "row" }}
                                            spacing={2}
                                        >
                                            <TextField
                                                label="First name"
                                                value={firstName}
                                                onChange={(event) => setFirstName(event.target.value)}
                                                fullWidth
                                                required
                                                autoComplete="given-name"
                                            />

                                            <TextField
                                                label="Last name"
                                                value={lastName}
                                                onChange={(event) => setLastName(event.target.value)}
                                                fullWidth
                                                required
                                                autoComplete="family-name"
                                            />
                                        </Stack>

                                        <TextField
                                            label="Email"
                                            type="email"
                                            value={email}
                                            onChange={(event) => setEmail(event.target.value)}
                                            fullWidth
                                            required
                                            autoComplete="email"
                                        />

                                        <TextField
                                            label="Password"
                                            type="password"
                                            value={password}
                                            onChange={(event) => setPassword(event.target.value)}
                                            fullWidth
                                            required
                                            autoComplete="new-password"
                                            helperText="Minimum 8 characters"
                                        />

                                        <FormControl fullWidth>
                                            <InputLabel id="role-name-label">Role</InputLabel>

                                            <Select
                                                labelId="role-name-label"
                                                label="Role"
                                                value={roleName}
                                                onChange={handleRoleChange}
                                            >
                                                {allowedRegistrationRoles.map((role) => (
                                                    <MenuItem key={role} value={role}>
                                                        {role}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>

                                        <Button
                                            type="submit"
                                            variant="contained"
                                            size="large"
                                            disabled={isLoading}
                                            fullWidth
                                        >
                                            {isLoading ? "Creating account..." : "Create account"}
                                        </Button>
                                    </Stack>
                                </Box>

                                <Typography variant="body2" color="text.secondary">
                                    Already have an account? <Link to="/login">Sign in here</Link>
                                </Typography>
                            </Stack>
                        </CardContent>
                    </Box>
                </Card>
            </Container>
        </Box>
    );
}

export default RegisterPage;
import { useState, type SubmitEventHandler } from "react";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
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
import { Link, useNavigate } from "react-router";
import { registerUser } from "../../auth/authSlice";
import type { RoleName } from "../../auth/authTypes";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

const allowedRegistrationRoles: RoleName[] = ["DEALER", "DMV_CLERK", "LENDER"];

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
        <Container maxWidth="sm">
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    py: 4,
                }}
            >
                <Card sx={{ width: "100%", borderRadius: 3 }}>
                    <CardContent sx={{ p: 4 }}>
                        <Stack spacing={3}>
                            <Box>
                                <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                                    Create TitleFlow Account
                                </Typography>

                                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                                    Create a test account for the TitleFlow workflow.
                                </Typography>
                            </Box>

                            {error && <Alert severity="error">{error}</Alert>}

                            <Box component="form" onSubmit={handleSubmit}>
                                <Stack spacing={2.5}>
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
                </Card>
            </Box>
        </Container>
    );
}

export default RegisterPage;
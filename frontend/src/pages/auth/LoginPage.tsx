import { useState, type SubmitEventHandler } from "react";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Container,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import ShieldIcon from "@mui/icons-material/Shield";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import { Link, useNavigate } from "react-router";

import { loginUser } from "../../auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

function LoginPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { status, error } = useAppSelector((state) => state.auth);

    const [email, setEmail] = useState("dealer2@test.com");
    const [password, setPassword] = useState("password123");

    const isLoading = status === "loading";

    const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();

        const result = await dispatch(
            loginUser({
                email,
                password,
            })
        );

        if (loginUser.fulfilled.match(result)) {
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
                            minHeight: { md: 620 },
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
                                        icon={<VerifiedUserIcon />}
                                        label="Gov-tech workflow console"
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
                                        Modern title workflow management.
                                    </Typography>

                                    <Typography
                                        variant="body1"
                                        sx={{
                                            color: "rgba(255, 255, 255, 0.76)",
                                            maxWidth: 460,
                                        }}
                                    >
                                        Manage title applications, DMV review, secure documents, and audit
                                        history in one professional workflow system.
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
                                Portfolio learning project inspired by enterprise DMV modernization systems.
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
                                        Sign in
                                    </Typography>

                                    <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                                        Access your TitleFlow workspace.
                                    </Typography>
                                </Box>

                                {error && <Alert severity="error">{error}</Alert>}

                                <Box component="form" onSubmit={handleSubmit}>
                                    <Stack spacing={2.5}>
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
                                            autoComplete="current-password"
                                        />

                                        <Button
                                            type="submit"
                                            variant="contained"
                                            size="large"
                                            disabled={isLoading}
                                            fullWidth
                                        >
                                            {isLoading ? "Signing in..." : "Sign in"}
                                        </Button>
                                    </Stack>
                                </Box>

                                <Typography variant="body2" color="text.secondary">
                                    Need a test account?{" "}
                                    <Link to="/register">Create one here</Link>
                                </Typography>
                            </Stack>
                        </CardContent>
                    </Box>
                </Card>
            </Container>
        </Box>
    );
}

export default LoginPage;
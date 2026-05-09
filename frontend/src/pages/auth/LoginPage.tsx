import { useState, type SubmitEventHandler } from "react";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
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
                                <Typography variant="h4" component="h1" sx={{fontWeight: 700}}>
                                    Sign in to TitleFlow
                                </Typography>

                                <Typography variant="body1" color="text.secondary" sx={{marginTop: 1}}>
                                    Secure Digital Vehicle Title & Lien Processing System
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
                </Card>
            </Box>
        </Container>
    );
}

export default LoginPage;
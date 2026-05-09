import {
    Alert,
    Card,
    CardContent,
    Chip,
    Divider,
    Stack,
    Typography,
} from "@mui/material";
import { useAppSelector } from "../../store/hooks";

function DashboardPage() {
    const { user, status, error } = useAppSelector((state) => state.auth);

    return (
        <Stack spacing={3}>
            <Card sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 4 }}>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                        Dashboard
                    </Typography>

                    <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                        Welcome to your TitleFlow workspace.
                    </Typography>
                </CardContent>
            </Card>

            {error && <Alert severity="error">{error}</Alert>}

            <Card sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 4 }}>
                    <Stack spacing={2}>
                        <Typography variant="h6" component="h2" sx={{ fontWeight: 700 }}>
                            Current User
                        </Typography>

                        <Divider />

                        {status === "loading" && (
                            <Typography color="text.secondary">Loading user...</Typography>
                        )}

                        {user && (
                            <Stack spacing={1.5}>
                                <Typography>
                                    <strong>Name:</strong> {user.firstName} {user.lastName}
                                </Typography>

                                <Typography>
                                    <strong>Email:</strong> {user.email}
                                </Typography>

                                <Typography>
                                    <strong>Status:</strong> {user.status}
                                </Typography>

                                <Stack
                                    direction="row"
                                    spacing={1}
                                    sx={{
                                        flexWrap: "wrap",
                                        rowGap: 1,
                                    }}
                                >
                                    {user.roles.map((role) => (
                                        <Chip
                                            key={role}
                                            label={role}
                                            color="primary"
                                            variant="outlined"
                                        />
                                    ))}
                                </Stack>
                            </Stack>
                        )}

                        {!user && status !== "loading" && (
                            <Typography color="text.secondary">
                                User information is not loaded yet.
                            </Typography>
                        )}
                    </Stack>
                </CardContent>
            </Card>

            <Card sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 4 }}>
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 700 }}>
                        Frontend Modules
                    </Typography>

                    <Typography color="text.secondary" sx={{ mt: 1 }}>
                        The sidebar now shows navigation based on the current user role.
                        Business pages will be added in future frontend sprints.
                    </Typography>
                </CardContent>
            </Card>
        </Stack>
    );
}

export default DashboardPage;
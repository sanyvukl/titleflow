import { useEffect } from "react";
import { Link as RouterLink } from "react-router";

import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchMyApplications } from "../../features/titleApplications/titleApplicationsSlice";

function getStatusColor(status: string) {
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

export default function TitleApplicationsPage() {
    const dispatch = useAppDispatch();

    const { applications, status, error } = useAppSelector(
        (state) => state.titleApplications
    );

    useEffect(() => {
        dispatch(fetchMyApplications());
    }, [dispatch]);

    const isLoading = status === "loading";

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
                    <Typography variant="h4" sx={{fontWeight:700}}>
                        Title Applications
                    </Typography>

                    <Typography variant="body1" color="text.secondary">
                        View and manage your dealer title applications.
                    </Typography>
                </Box>

                <Button
                    component={RouterLink}
                    to="/dashboard/title-applications/new"
                    variant="contained"
                >
                    Create Application
                </Button>
            </Stack>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {isLoading ? (
                <Stack sx={{ alignItems: "center", py: 6 }}>
                    <CircularProgress />
                </Stack>
            ) : applications.length === 0 ? (
                <Paper sx={{ p: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        No title applications yet
                    </Typography>

                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                        Create your first title application to start the dealer workflow.
                    </Typography>

                    <Button
                        component={RouterLink}
                        to="/dashboard/title-applications/new"
                        variant="contained"
                    >
                        Create Application
                    </Button>
                </Paper>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Application #</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Vehicle</TableCell>
                                <TableCell>VIN</TableCell>
                                <TableCell>Created</TableCell>
                                <TableCell align="right">Action</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {applications.map((application) => (
                                <TableRow key={application.id} hover>
                                    <TableCell>{application.applicationNumber}</TableCell>

                                    <TableCell>
                                        <Chip
                                            label={application.status}
                                            color={getStatusColor(application.status)}
                                            size="small"
                                        />
                                    </TableCell>

                                    <TableCell>
                                        {application.vehicle.year} {application.vehicle.make}{" "}
                                        {application.vehicle.model}
                                    </TableCell>

                                    <TableCell>{application.vehicle.vin}</TableCell>

                                    <TableCell>
                                        {new Date(application.createdAt).toLocaleDateString()}
                                    </TableCell>

                                    <TableCell align="right">
                                        <Button
                                            component={RouterLink}
                                            to={`/dashboard/title-applications/${application.id}`}
                                            size="small"
                                            variant="outlined"
                                        >
                                            Open
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
}
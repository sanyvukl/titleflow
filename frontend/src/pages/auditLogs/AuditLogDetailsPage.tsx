import { useEffect, useMemo, useState } from "react";
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
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Typography,
} from "@mui/material";

import HistoryIcon from "@mui/icons-material/History";
import SecurityIcon from "@mui/icons-material/Security";
import TimelineIcon from "@mui/icons-material/Timeline";

import PageHeader from "../../components/common/PageHeader";
import { fetchAuditLogs } from "../../features/auditLogs/auditLogsSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

const rowsPerPage = 25;

function formatAction(action: string): string {
    return action
        .split("_")
        .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
        .join(" ");
}

function getActionColor(
    action: string
): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" {
    switch (action) {
        case "APPLICATION_CREATED":
        case "APPLICATION_UPDATED":
            return "info";
        case "APPLICATION_SUBMITTED":
        case "REVIEW_STARTED":
            return "warning";
        case "MORE_INFO_REQUESTED":
            return "warning";
        case "APPLICATION_APPROVED":
            return "success";
        case "APPLICATION_REJECTED":
            return "error";
        case "DOCUMENT_UPLOADED":
            return "primary";
        default:
            return "default";
    }
}

function AuditLogDetailsPage() {
    const dispatch = useAppDispatch();
    const { id } = useParams();

    const [page, setPage] = useState(0);

    const { auditLogs, status, error } = useAppSelector(
        (state) => state.auditLogs
    );

    useEffect(() => {
        if (id) {
            setPage(0);
            dispatch(fetchAuditLogs(Number(id)));
        }
    }, [dispatch, id]);

    const isLoading = status === "loading";

    const applicationNumber = auditLogs[0]?.applicationNumber ?? `Application ID ${id}`;

    const paginatedLogs = useMemo(() => {
        const start = page * rowsPerPage;
        const end = start + rowsPerPage;

        return auditLogs.slice(start, end);
    }, [auditLogs, page]);

    const handlePageChange = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    return (
        <Box>
            <PageHeader
                title="Audit Log Details"
                subtitle={`Detailed workflow history for ${applicationNumber}.`}
                actions={
                    <Button
                        component={RouterLink}
                        to="/dashboard/audit-logs"
                        variant="outlined"
                    >
                        Back to Audit Logs
                    </Button>
                }
            />

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {!isLoading && auditLogs.length > 0 && (
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={2}
                    sx={{ mb: 3 }}
                >
                    <Paper sx={{ p: 2.5, flex: 1 }}>
                        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
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
                                <TimelineIcon />
                            </Box>

                            <Box>
                                <Typography variant="body2" color="text.secondary">
                                    Total Events
                                </Typography>

                                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                                    {auditLogs.length}
                                </Typography>
                            </Box>
                        </Stack>
                    </Paper>

                    <Paper sx={{ p: 2.5, flex: 1 }}>
                        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
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
                                <SecurityIcon />
                            </Box>

                            <Box>
                                <Typography variant="body2" color="text.secondary">
                                    Application
                                </Typography>

                                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                    {applicationNumber}
                                </Typography>
                            </Box>
                        </Stack>
                    </Paper>
                </Stack>
            )}

            <Paper sx={{ overflow: "hidden" }}>
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
                        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                            <Box
                                sx={{
                                    width: 46,
                                    height: 46,
                                    borderRadius: "16px",
                                    display: "grid",
                                    placeItems: "center",
                                    background:
                                        "linear-gradient(135deg, #4F7DF3 0%, #2F80ED 100%)",
                                    boxShadow: "0 12px 24px rgba(79, 125, 243, 0.34)",
                                }}
                            >
                                <HistoryIcon />
                            </Box>

                            <Box>
                                <Typography variant="h6" sx={{ color: "white", fontWeight: 900 }}>
                                    Application Audit Trail
                                </Typography>

                                <Typography
                                    variant="body2"
                                    sx={{ color: "rgba(255, 255, 255, 0.72)" }}
                                >
                                    Showing 25 records per page.
                                </Typography>
                            </Box>
                        </Stack>

                        <Chip
                            label={`${auditLogs.length} event${auditLogs.length === 1 ? "" : "s"}`}
                            sx={{
                                color: "white",
                                backgroundColor: "rgba(255, 255, 255, 0.12)",
                                border: "1px solid rgba(255, 255, 255, 0.2)",
                                fontWeight: 800,
                            }}
                        />
                    </Stack>
                </Box>

                <Box sx={{ p: { xs: 3, md: 4 } }}>
                    <Stack spacing={2}>
                        {isLoading ? (
                            <Stack sx={{ alignItems: "center", py: 4 }} spacing={1.5}>
                                <CircularProgress />

                                <Typography color="text.secondary">
                                    Loading audit log details...
                                </Typography>
                            </Stack>
                        ) : auditLogs.length === 0 ? (
                            <Typography color="text.secondary">
                                No audit logs found for this application.
                            </Typography>
                        ) : (
                            <>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Action</TableCell>
                                                <TableCell>Actor ID</TableCell>
                                                <TableCell>Actor Email</TableCell>
                                                <TableCell>Old Value</TableCell>
                                                <TableCell>New Value</TableCell>
                                                <TableCell>Description</TableCell>
                                                <TableCell>Time</TableCell>
                                            </TableRow>
                                        </TableHead>

                                        <TableBody>
                                            {paginatedLogs.map((log) => (
                                                <TableRow
                                                    key={log.id}
                                                    hover
                                                    sx={{
                                                        "&:last-child td": {
                                                            borderBottom: 0,
                                                        },
                                                    }}
                                                >
                                                    <TableCell>
                                                        <Chip
                                                            label={formatAction(log.action)}
                                                            color={getActionColor(log.action)}
                                                            size="small"
                                                        />
                                                    </TableCell>

                                                    <TableCell>
                                                        <Typography
                                                            variant="body2"
                                                            sx={{ fontWeight: 700 }}
                                                        >
                                                            {log.actorUserId}
                                                        </Typography>
                                                    </TableCell>

                                                    <TableCell>
                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                        >
                                                            {log.actorEmail}
                                                        </Typography>
                                                    </TableCell>

                                                    <TableCell>{log.oldValue ?? "N/A"}</TableCell>

                                                    <TableCell>{log.newValue ?? "N/A"}</TableCell>

                                                    <TableCell>
                                                        <Typography variant="body2">
                                                            {log.description ?? "N/A"}
                                                        </Typography>
                                                    </TableCell>

                                                    <TableCell>
                                                        {new Date(log.createdAt).toLocaleString()}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                                <Divider />

                                <TablePagination
                                    component="div"
                                    count={auditLogs.length}
                                    page={page}
                                    onPageChange={handlePageChange}
                                    rowsPerPage={rowsPerPage}
                                    rowsPerPageOptions={[25]}
                                />
                            </>
                        )}
                    </Stack>
                </Box>
            </Paper>
        </Box>
    );
}

export default AuditLogDetailsPage;
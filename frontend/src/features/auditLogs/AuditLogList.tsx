import {
    Alert,
    Box,
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

import HistoryIcon from "@mui/icons-material/History";

import { useAppSelector } from "../../store/hooks";

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
        case "APPLICATION_APPROVED":
            return "success";
        case "APPLICATION_REJECTED":
            return "error";
        case "MORE_INFO_REQUESTED":
            return "warning";
        case "DOCUMENT_UPLOADED":
            return "primary";
        default:
            return "default";
    }
}

function AuditLogList() {
    const { auditLogs, status, error } = useAppSelector(
        (state) => state.auditLogs
    );

    const isLoading = status === "loading";

    return (
        <Paper sx={{ overflow: "hidden" }}>
            <Box
                sx={{
                    px: { xs: 3, md: 4 },
                    py: 3,
                    backgroundColor: "#F8FBFF",
                    borderBottom: "1px solid #E2E8F0",
                }}
            >
                <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
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
                        <HistoryIcon />
                    </Box>

                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>
                            Audit Logs
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                            Recent workflow activity for this application.
                        </Typography>
                    </Box>
                </Stack>
            </Box>

            <Box sx={{ p: { xs: 3, md: 4 } }}>
                <Stack spacing={2}>
                    {error && <Alert severity="error">{error}</Alert>}

                    {isLoading ? (
                        <Stack sx={{ alignItems: "center", py: 3 }} spacing={1.5}>
                            <CircularProgress size={28} />

                            <Typography variant="body2" color="text.secondary">
                                Loading audit logs...
                            </Typography>
                        </Stack>
                    ) : auditLogs.length === 0 ? (
                        <Typography color="text.secondary">
                            No audit logs found for this application yet.
                        </Typography>
                    ) : (
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Action</TableCell>
                                        <TableCell>Actor ID</TableCell>
                                        <TableCell>Actor Email</TableCell>
                                        <TableCell>Time</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {auditLogs.map((log) => (
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

                                            <TableCell>
                                                {new Date(log.createdAt).toLocaleString()}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Stack>
            </Box>
        </Paper>
    );
}

export default AuditLogList;
import {
    Alert,
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

import { useAppSelector } from "../../store/hooks";

function LienList() {
    const { liens, status, error } = useAppSelector((state) => state.liens);

    const isLoading = status === "loading";

    return (
        <Paper sx={{ p: 3 }}>
            <Stack spacing={2}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Liens
                </Typography>

                {error && <Alert severity="error">{error}</Alert>}

                {isLoading ? (
                    <Stack sx={{ alignItems: "center", py: 3 }}>
                        <CircularProgress size={28} />
                    </Stack>
                ) : liens.length === 0 ? (
                    <Typography color="text.secondary">
                        No liens found for this application.
                    </Typography>
                ) : (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Lender</TableCell>
                                    <TableCell>Lender Email</TableCell>
                                    <TableCell>Account #</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Created</TableCell>
                                    <TableCell>Released</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {liens.map((lien) => (
                                    <TableRow key={lien.id} hover>
                                        <TableCell>{lien.lenderName}</TableCell>

                                        <TableCell>{lien.lenderEmail}</TableCell>

                                        <TableCell>{lien.loanAccountNumber}</TableCell>

                                        <TableCell>
                                            <Chip
                                                label={lien.status}
                                                color={
                                                    lien.status === "ACTIVE"
                                                        ? "warning"
                                                        : "success"
                                                }
                                                size="small"
                                            />
                                        </TableCell>

                                        <TableCell>
                                            {new Date(lien.createdAt).toLocaleString()}
                                        </TableCell>

                                        <TableCell>
                                            {lien.releasedAt
                                                ? new Date(lien.releasedAt).toLocaleString()
                                                : "N/A"}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Stack>
        </Paper>
    );
}

export default LienList;
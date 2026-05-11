import { useEffect } from "react";

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

import {
    fetchMyLiens,
    releaseLien,
} from "../../features/liens/liensSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

function LiensPage() {
    const dispatch = useAppDispatch();

    const { liens, status, error } = useAppSelector((state) => state.liens);

    const isLoading = status === "loading";

    useEffect(() => {
        dispatch(fetchMyLiens());
    }, [dispatch]);

    const handleReleaseLien = async (
        applicationId: number,
        lienId: number
    ) => {
        await dispatch(
            releaseLien({
                applicationId,
                lienId,
            })
        );
    };

    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                My Liens
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                View and manage liens created by your lender account.
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {isLoading ? (
                <Stack sx={{ alignItems: "center", py: 6 }}>
                    <CircularProgress />
                </Stack>
            ) : liens.length === 0 ? (
                <Paper sx={{ p: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        No liens found
                    </Typography>

                    <Typography color="text.secondary">
                        Liens created by your lender account will appear here.
                    </Typography>
                </Paper>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Application #</TableCell>
                                <TableCell>Lender</TableCell>
                                <TableCell>Account #</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Created</TableCell>
                                <TableCell>Released</TableCell>
                                <TableCell align="right">Action</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {liens.map((lien) => (
                                <TableRow key={lien.id} hover>
                                    <TableCell>{lien.applicationNumber}</TableCell>

                                    <TableCell>{lien.lenderName}</TableCell>

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

                                    <TableCell align="right">
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            color="success"
                                            disabled={lien.status !== "ACTIVE" || isLoading}
                                            onClick={() =>
                                                handleReleaseLien(
                                                    lien.titleApplicationId,
                                                    lien.id
                                                )
                                            }
                                        >
                                            Release
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

export default LiensPage;
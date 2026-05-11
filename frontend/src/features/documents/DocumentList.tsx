import { useState } from "react";

import {
    Alert,
    Box,
    Button,
    Chip,
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

import DownloadIcon from "@mui/icons-material/Download";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { documentService } from "../../api/documentService";
import { useAppSelector } from "../../store/hooks";

interface DocumentListProps {
    applicationId: number;
}

function formatFileSize(size: number): string {
    const sizeInKb = size / 1024;

    if (sizeInKb < 1024) {
        return `${sizeInKb.toFixed(1)} KB`;
    }

    return `${(sizeInKb / 1024).toFixed(1)} MB`;
}

function formatDocumentType(type: string): string {
    return type
        .split("_")
        .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
        .join(" ");
}

function canPreviewDocument(contentType: string): boolean {
    const normalizedContentType = contentType.toLowerCase();

    return (
        normalizedContentType === "application/pdf" ||
        normalizedContentType.startsWith("image/")
    );
}

function getFileKindLabel(contentType: string): string {
    if (contentType === "application/pdf") {
        return "PDF";
    }

    if (contentType.startsWith("image/")) {
        return "Image";
    }

    return "File";
}

function getFileKindColor(
    contentType: string
): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" {
    if (contentType === "application/pdf") {
        return "error";
    }

    if (contentType.startsWith("image/")) {
        return "info";
    }

    return "default";
}

function DocumentList({ applicationId }: DocumentListProps) {
    const { documents, error } = useAppSelector((state) => state.documents);

    const [previewError, setPreviewError] = useState<string | null>(null);

    const handlePreview = async (documentId: number, contentType: string) => {
        setPreviewError(null);

        if (!canPreviewDocument(contentType)) {
            setPreviewError("This document type cannot be previewed in the browser.");
            return;
        }

        const previewWindow = window.open("about:blank", "_blank");

        if (!previewWindow) {
            setPreviewError("Preview window was blocked by the browser.");
            return;
        }

        previewWindow.document.write("Loading document preview...");

        try {
            const blob = await documentService.downloadDocument(
                applicationId,
                documentId
            );

            const previewBlob = new Blob([blob], {
                type: contentType,
            });

            const url = window.URL.createObjectURL(previewBlob);

            previewWindow.location.href = url;

            setTimeout(() => {
                window.URL.revokeObjectURL(url);
            }, 60_000);
        } catch {
            previewWindow.close();
            setPreviewError("Unable to preview document.");
        }
    };

    const handleDownload = async (documentId: number, fileName: string) => {
        const blob = await documentService.downloadDocument(
            applicationId,
            documentId
        );

        const url = window.URL.createObjectURL(blob);

        const link = window.document.createElement("a");
        link.href = url;
        link.download = fileName;
        link.click();

        window.URL.revokeObjectURL(url);
    };

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
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    sx={{
                        justifyContent: "space-between",
                        alignItems: { xs: "flex-start", sm: "center" },
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
                            <InsertDriveFileIcon />
                        </Box>

                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                Uploaded Documents
                            </Typography>

                            <Typography variant="body2" color="text.secondary">
                                Preview or download supporting application documents.
                            </Typography>
                        </Box>
                    </Stack>

                    <Chip
                        label={`${documents.length} document${
                            documents.length === 1 ? "" : "s"
                        }`}
                        color="primary"
                        variant="outlined"
                        sx={{ fontWeight: 800 }}
                    />
                </Stack>
            </Box>

            <Box sx={{ p: { xs: 3, md: 4 } }}>
                <Stack spacing={2}>
                    {error && <Alert severity="error">{error}</Alert>}

                    {previewError && <Alert severity="warning">{previewError}</Alert>}

                    {documents.length === 0 ? (
                        <Box
                            sx={{
                                p: 4,
                                border: "1px dashed #C8D4E8",
                                borderRadius: "18px",
                                backgroundColor: "#F8FBFF",
                                textAlign: "center",
                            }}
                        >
                            <Stack spacing={1.5} sx={{ alignItems: "center" }}>
                                <Box
                                    sx={{
                                        width: 58,
                                        height: 58,
                                        borderRadius: "20px",
                                        display: "grid",
                                        placeItems: "center",
                                        backgroundColor: "#EEF5FF",
                                        color: "primary.main",
                                    }}
                                >
                                    <InsertDriveFileIcon fontSize="large" />
                                </Box>

                                <Box>
                                    <Typography sx={{ fontWeight: 800 }}>
                                        No documents uploaded yet
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ mt: 0.5 }}
                                    >
                                        Uploaded title copies, bills of sale, or supporting
                                        files will appear here.
                                    </Typography>
                                </Box>
                            </Stack>
                        </Box>
                    ) : (
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Document</TableCell>
                                        <TableCell>Type</TableCell>
                                        <TableCell>Size</TableCell>
                                        <TableCell>Uploaded By</TableCell>
                                        <TableCell>Uploaded At</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {documents.map((uploadedDocument) => (
                                        <TableRow
                                            key={uploadedDocument.id}
                                            hover
                                            sx={{
                                                "&:last-child td": {
                                                    borderBottom: 0,
                                                },
                                            }}
                                        >
                                            <TableCell>
                                                <Stack
                                                    direction="row"
                                                    spacing={1.5}
                                                    sx={{ alignItems: "center" }}
                                                >
                                                    <Box
                                                        sx={{
                                                            width: 38,
                                                            height: 38,
                                                            borderRadius: "12px",
                                                            display: "grid",
                                                            placeItems: "center",
                                                            backgroundColor: "#EEF5FF",
                                                            color: "primary.main",
                                                            flexShrink: 0,
                                                        }}
                                                    >
                                                        <InsertDriveFileIcon fontSize="small" />
                                                    </Box>

                                                    <Box>
                                                        <Typography
                                                            variant="body2"
                                                            sx={{ fontWeight: 800 }}
                                                        >
                                                            {uploadedDocument.originalFileName}
                                                        </Typography>
                                                    </Box>
                                                </Stack>
                                            </TableCell>

                                            <TableCell>
                                                <Stack direction="row" spacing={1}>
                                                    <Chip
                                                        label={formatDocumentType(
                                                            uploadedDocument.documentType
                                                        )}
                                                        size="small"
                                                        variant="outlined"
                                                        sx={{ fontWeight: 700 }}
                                                    />

                                                    <Chip
                                                        label={getFileKindLabel(
                                                            uploadedDocument.contentType
                                                        )}
                                                        size="small"
                                                        color={getFileKindColor(
                                                            uploadedDocument.contentType
                                                        )}
                                                        variant="outlined"
                                                        sx={{ fontWeight: 700 }}
                                                    />
                                                </Stack>
                                            </TableCell>

                                            <TableCell>
                                                {formatFileSize(uploadedDocument.fileSize)}
                                            </TableCell>

                                            <TableCell>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    {uploadedDocument.uploadedByEmail}
                                                </Typography>
                                            </TableCell>

                                            <TableCell>
                                                {new Date(
                                                    uploadedDocument.uploadedAt
                                                ).toLocaleString()}
                                            </TableCell>

                                            <TableCell align="right">
                                                <Stack
                                                    direction="row"
                                                    spacing={1}
                                                    sx={{ justifyContent: "flex-end" }}
                                                >
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        startIcon={<VisibilityIcon />}
                                                        disabled={
                                                            !canPreviewDocument(
                                                                uploadedDocument.contentType
                                                            )
                                                        }
                                                        onClick={() =>
                                                            handlePreview(
                                                                uploadedDocument.id,
                                                                uploadedDocument.contentType
                                                            )
                                                        }
                                                    >
                                                        Preview
                                                    </Button>

                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        startIcon={<DownloadIcon />}
                                                        onClick={() =>
                                                            handleDownload(
                                                                uploadedDocument.id,
                                                                uploadedDocument.originalFileName
                                                            )
                                                        }
                                                    >
                                                        Download
                                                    </Button>
                                                </Stack>
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

export default DocumentList;
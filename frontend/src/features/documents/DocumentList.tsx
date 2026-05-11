import { useState } from "react";

import {
    Alert,
    Box,
    Button,
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

function canPreviewDocument(contentType: string): boolean {
    const normalizedContentType = contentType.toLowerCase();

    return (
        normalizedContentType === "application/pdf" ||
        normalizedContentType.startsWith("image/")
    );
}

function DocumentList({ applicationId }: DocumentListProps) {
    const { documents, error } = useAppSelector((state) => state.documents);

    const [previewError, setPreviewError] = useState<string | null>(null);

    const handlePreview = async (
        documentId: number,
        contentType: string
    ) => {
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
        <Paper sx={{ p: 3 }}>
            <Stack spacing={2}>
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1}
                    sx={{
                        justifyContent: "space-between",
                        alignItems: { xs: "flex-start", sm: "center" },
                    }}
                >
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>
                            Uploaded Documents
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                            Preview or download supporting application documents.
                        </Typography>
                    </Box>
                </Stack>

                {error && <Alert severity="error">{error}</Alert>}

                {previewError && (
                    <Alert severity="warning">{previewError}</Alert>
                )}

                {documents.length === 0 ? (
                    <Typography color="text.secondary">
                        No documents have been uploaded for this application yet.
                    </Typography>
                ) : (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Type</TableCell>
                                    <TableCell>File Name</TableCell>
                                    <TableCell>Size</TableCell>
                                    <TableCell>Uploaded By</TableCell>
                                    <TableCell>Uploaded At</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {documents.map((uploadedDocument) => (
                                    <TableRow key={uploadedDocument.id} hover>
                                        <TableCell>
                                            {uploadedDocument.documentType}
                                        </TableCell>

                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                sx={{ fontWeight: 700 }}
                                            >
                                                {uploadedDocument.originalFileName}
                                            </Typography>

                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                            >
                                                {uploadedDocument.contentType}
                                            </Typography>
                                        </TableCell>

                                        <TableCell>
                                            {formatFileSize(uploadedDocument.fileSize)}
                                        </TableCell>

                                        <TableCell>
                                            {uploadedDocument.uploadedByEmail}
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
        </Paper>
    );
}

export default DocumentList;
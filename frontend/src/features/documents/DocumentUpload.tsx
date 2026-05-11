import type { ChangeEventHandler, SubmitEventHandler } from "react";
import { useRef, useState } from "react";

import {
    Alert,
    Box,
    Button,
    Chip,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    Typography,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import LockIcon from "@mui/icons-material/Lock";
import DeleteIcon from "@mui/icons-material/Delete";

import { uploadDocument, fetchDocuments } from "./documentSlice";
import { fetchAuditLogs } from "../auditLogs/auditLogsSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

import type { DocumentType } from "../../types/documentTypes";

const documentTypes: DocumentType[] = [
    "TITLE_COPY",
    "BILL_OF_SALE",
    "ODOMETER_DISCLOSURE",
    "PROOF_OF_INSURANCE",
    "DRIVER_LICENSE",
    "LIEN_RELEASE",
    "POWER_OF_ATTORNEY",
    "OTHER",
];

const maxFileSizeBytes = 10 * 1024 * 1024;

const allowedContentTypes = [
    "application/pdf",
    "image/png",
    "image/jpeg",
];

interface DocumentUploadProps {
    applicationId: number;
    canUpload: boolean;
}

function formatDocumentType(type: DocumentType): string {
    return type
        .split("_")
        .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
        .join(" ");
}

function formatFileSize(size: number): string {
    const sizeInKb = size / 1024;

    if (sizeInKb < 1024) {
        return `${sizeInKb.toFixed(1)} KB`;
    }

    return `${(sizeInKb / 1024).toFixed(1)} MB`;
}

function validateFile(file: File): string | null {
    if (!allowedContentTypes.includes(file.type)) {
        return "Only PDF, PNG, JPG, and JPEG files are allowed.";
    }

    if (file.size > maxFileSizeBytes) {
        return "File size must be 10 MB or smaller.";
    }

    return null;
}

function DocumentUpload({ applicationId, canUpload }: DocumentUploadProps) {
    const dispatch = useAppDispatch();
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const { status, error } = useAppSelector((state) => state.documents);

    const [documentType, setDocumentType] =
        useState<DocumentType>("TITLE_COPY");

    const [file, setFile] = useState<File | null>(null);
    const [localError, setLocalError] = useState<string | null>(null);

    const isLoading = status === "loading";

    const handleDocumentTypeChange = (event: SelectChangeEvent<DocumentType>) => {
        setDocumentType(event.target.value as DocumentType);
    };

    const handleFileChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        const selectedFile = event.target.files?.[0] ?? null;

        setLocalError(null);

        if (!selectedFile) {
            setFile(null);
            return;
        }

        const validationError = validateFile(selectedFile);

        if (validationError) {
            setFile(null);
            setLocalError(validationError);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            return;
        }

        setFile(selectedFile);
    };

    const handleClearSelectedFile = () => {
        setFile(null);
        setLocalError(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();

        if (!file || !canUpload) {
            return;
        }

        setLocalError(null);

        const result = await dispatch(
            uploadDocument({
                applicationId,
                documentType,
                file,
            })
        );

        if (uploadDocument.fulfilled.match(result)) {
            setFile(null);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            await dispatch(fetchDocuments(applicationId));
            await dispatch(fetchAuditLogs(applicationId));
        }
    };

    if (!canUpload) {
        return (
            <Paper sx={{ p: 3 }}>
                <Stack direction="row" spacing={2} sx={{ alignItems: "flex-start" }}>
                    <Box
                        sx={{
                            width: 44,
                            height: 44,
                            borderRadius: "14px",
                            display: "grid",
                            placeItems: "center",
                            backgroundColor: "#EEF5FF",
                            color: "primary.main",
                            flexShrink: 0,
                        }}
                    >
                        <LockIcon />
                    </Box>

                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>
                            Document Upload Locked
                        </Typography>

                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            Documents can only be uploaded while the application is in
                            DRAFT or NEEDS_MORE_INFO status.
                        </Typography>
                    </Box>
                </Stack>
            </Paper>
        );
    }

    return (
        <Paper component="form" onSubmit={handleSubmit} sx={{ overflow: "hidden" }}>
            <Box
                sx={{
                    px: { xs: 3, md: 4 },
                    py: 3,
                    background:
                        "linear-gradient(135deg, #061E3A 0%, #082B55 60%, #123E73 100%)",
                    color: "white",
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
                            <CloudUploadIcon />
                        </Box>

                        <Box>
                            <Typography variant="h6" sx={{ color: "white", fontWeight: 900 }}>
                                Upload Document
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{ color: "rgba(255, 255, 255, 0.72)" }}
                            >
                                Attach supporting files to this title application.
                            </Typography>
                        </Box>
                    </Stack>

                    <Chip
                        label="PDF, PNG, JPG • Max 10 MB"
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
                <Stack spacing={2.5}>
                    {error && <Alert severity="error">{error}</Alert>}

                    {localError && <Alert severity="warning">{localError}</Alert>}

                    <FormControl fullWidth>
                        <InputLabel id="document-type-label">Document Type</InputLabel>

                        <Select
                            labelId="document-type-label"
                            label="Document Type"
                            value={documentType}
                            onChange={handleDocumentTypeChange}
                        >
                            {documentTypes.map((type) => (
                                <MenuItem key={type} value={type}>
                                    {formatDocumentType(type)}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Box
                        sx={{
                            p: 3,
                            border: "1px dashed #C8D4E8",
                            borderRadius: "18px",
                            backgroundColor: "#F8FBFF",
                            textAlign: "center",
                        }}
                    >
                        <Stack spacing={2} sx={{ alignItems: "center" }}>
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
                                    Choose a document file
                                </Typography>

                                <Typography variant="body2" color="text.secondary">
                                    Upload PDF or image evidence for this title application.
                                </Typography>
                            </Box>

                            <Button variant="outlined" component="label">
                                {file ? "Replace File" : "Choose File"}
                                <input
                                    ref={fileInputRef}
                                    hidden
                                    type="file"
                                    accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
                                    onChange={handleFileChange}
                                />
                            </Button>
                        </Stack>
                    </Box>

                    {file && (
                        <Paper
                            sx={{
                                p: 2,
                                backgroundColor: "#FFFFFF",
                                boxShadow: "none",
                            }}
                        >
                            <Stack
                                direction={{ xs: "column", sm: "row" }}
                                spacing={1.5}
                                sx={{
                                    justifyContent: "space-between",
                                    alignItems: { xs: "flex-start", sm: "center" },
                                }}
                            >
                                <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                                    <InsertDriveFileIcon color="primary" />

                                    <Box>
                                        <Typography variant="body2" sx={{ fontWeight: 800 }}>
                                            {file.name}
                                        </Typography>

                                        <Typography variant="caption" color="text.secondary">
                                            {file.type || "Unknown type"} • {formatFileSize(file.size)}
                                        </Typography>
                                    </Box>
                                </Stack>

                                <Stack
                                    direction={{ xs: "column", sm: "row" }}
                                    spacing={1}
                                    sx={{ alignItems: { xs: "flex-start", sm: "center" } }}
                                >
                                    <Chip
                                        label={formatDocumentType(documentType)}
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                    />

                                    <Button
                                        type="button"
                                        size="small"
                                        variant="outlined"
                                        color="error"
                                        startIcon={<DeleteIcon />}
                                        onClick={handleClearSelectedFile}
                                    >
                                        Remove
                                    </Button>
                                </Stack>
                            </Stack>
                        </Paper>
                    )}

                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2}
                        sx={{ justifyContent: "flex-end" }}
                    >
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={!file || isLoading}
                        >
                            {isLoading ? "Uploading..." : "Upload Document"}
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        </Paper>
    );
}

export default DocumentUpload;
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import { documentService } from "../../api/documentService";

import type {
    DocumentResponse,
    DocumentType,
} from "../../types/documentTypes";

interface DocumentsState {
    documents: DocumentResponse[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

const initialState: DocumentsState = {
    documents: [],
    status: "idle",
    error: null,
};

function getErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
        return (
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message
        );
    }

    if (error instanceof Error) {
        return error.message;
    }

    return "Unexpected error";
}

export const fetchDocuments = createAsyncThunk(
    "documents/fetchDocuments",
    async (applicationId: number, thunkApi) => {
        try {
            return await documentService.getDocuments(applicationId);
        } catch (error) {
            return thunkApi.rejectWithValue(getErrorMessage(error));
        }
    }
);

export const uploadDocument = createAsyncThunk(
    "documents/uploadDocument",
    async (
        payload: {
            applicationId: number;
            documentType: DocumentType;
            file: File;
        },
        thunkApi
    ) => {
        try {
            return await documentService.uploadDocument(
                payload.applicationId,
                payload.documentType,
                payload.file
            );
        } catch (error) {
            return thunkApi.rejectWithValue(getErrorMessage(error));
        }
    }
);

const documentsSlice = createSlice({
    name: "documents",
    initialState,
    reducers: {
        clearDocuments(state) {
            state.documents = [];
        },

        clearDocumentError(state) {
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchDocuments.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })

            .addCase(fetchDocuments.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.documents = action.payload;
            })

            .addCase(fetchDocuments.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            })

            .addCase(uploadDocument.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })

            .addCase(uploadDocument.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.documents.unshift(action.payload);
            })

            .addCase(uploadDocument.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            });
    },
});

export const { clearDocuments, clearDocumentError } = documentsSlice.actions;

export default documentsSlice.reducer;
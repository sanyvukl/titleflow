import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import { auditLogService } from "../../api/auditLogService";

import type { AuditLogResponse } from "../../types/auditLogTypes";

interface AuditLogsState {
    auditLogs: AuditLogResponse[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

const initialState: AuditLogsState = {
    auditLogs: [],
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

export const fetchAuditLogs = createAsyncThunk(
    "auditLogs/fetchAuditLogs",
    async (applicationId: number, thunkApi) => {
        try {
            return await auditLogService.getAuditLogs(applicationId);
        } catch (error) {
            return thunkApi.rejectWithValue(getErrorMessage(error));
        }
    }
);

const auditLogsSlice = createSlice({
    name: "auditLogs",
    initialState,
    reducers: {
        clearAuditLogs(state) {
            state.auditLogs = [];
        },

        clearAuditLogError(state) {
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchAuditLogs.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })

            .addCase(fetchAuditLogs.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.auditLogs = action.payload;
            })

            .addCase(fetchAuditLogs.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            });
    },
});

export const { clearAuditLogs, clearAuditLogError } = auditLogsSlice.actions;

export default auditLogsSlice.reducer;
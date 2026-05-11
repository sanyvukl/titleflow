import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import { lienService } from "../../api/lienService";

import type { CreateLienRequest, LienResponse } from "../../types/lienTypes";

interface LiensState {
    liens: LienResponse[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

const initialState: LiensState = {
    liens: [],
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

export const fetchApplicationLiens = createAsyncThunk(
    "liens/fetchApplicationLiens",
    async (applicationId: number, thunkApi) => {
        try {
            return await lienService.getApplicationLiens(applicationId);
        } catch (error) {
            return thunkApi.rejectWithValue(getErrorMessage(error));
        }
    }
);

export const fetchMyLiens = createAsyncThunk(
    "liens/fetchMyLiens",
    async (_, thunkApi) => {
        try {
            return await lienService.getMyLiens();
        } catch (error) {
            return thunkApi.rejectWithValue(getErrorMessage(error));
        }
    }
);

export const createLien = createAsyncThunk(
    "liens/createLien",
    async (
        payload: {
            applicationId: number;
            request: CreateLienRequest;
        },
        thunkApi
    ) => {
        try {
            return await lienService.createLien(
                payload.applicationId,
                payload.request
            );
        } catch (error) {
            return thunkApi.rejectWithValue(getErrorMessage(error));
        }
    }
);

export const releaseLien = createAsyncThunk(
    "liens/releaseLien",
    async (
        payload: {
            applicationId: number;
            lienId: number;
        },
        thunkApi
    ) => {
        try {
            return await lienService.releaseLien(
                payload.applicationId,
                payload.lienId
            );
        } catch (error) {
            return thunkApi.rejectWithValue(getErrorMessage(error));
        }
    }
);

const liensSlice = createSlice({
    name: "liens",
    initialState,
    reducers: {
        clearLiens(state) {
            state.liens = [];
        },

        clearLienError(state) {
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchApplicationLiens.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })

            .addCase(fetchApplicationLiens.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.liens = action.payload;
            })

            .addCase(fetchApplicationLiens.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            })

            .addCase(fetchMyLiens.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })

            .addCase(fetchMyLiens.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.liens = action.payload;
            })

            .addCase(fetchMyLiens.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            })

            .addCase(createLien.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })

            .addCase(createLien.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.liens.unshift(action.payload);
            })

            .addCase(createLien.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            })

            .addCase(releaseLien.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })

            .addCase(releaseLien.fulfilled, (state, action) => {
                state.status = "succeeded";

                state.liens = state.liens.map((lien) =>
                    lien.id === action.payload.id ? action.payload : lien
                );
            })

            .addCase(releaseLien.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            });
    },
});

export const { clearLiens, clearLienError } = liensSlice.actions;

export default liensSlice.reducer;
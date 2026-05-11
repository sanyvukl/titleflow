import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import { dmvReviewService } from "../../api/dmvReviewService";

import type { TitleApplicationResponse } from "../../types/titleApplicationTypes";

interface DmvReviewState {
    applications: TitleApplicationResponse[];
    selectedApplication: TitleApplicationResponse | null;
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

const initialState: DmvReviewState = {
    applications: [],
    selectedApplication: null,
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

export const fetchDmvReviewQueue = createAsyncThunk(
    "dmvReview/fetchDmvReviewQueue",
    async (_, thunkApi) => {
        try {
            return await dmvReviewService.getReviewQueue();
        } catch (error) {
            return thunkApi.rejectWithValue(getErrorMessage(error));
        }
    }
);

export const fetchDmvApplicationById = createAsyncThunk(
    "dmvReview/fetchDmvApplicationById",
    async (applicationId: number, thunkApi) => {
        try {
            return await dmvReviewService.getApplicationForReview(applicationId);
        } catch (error) {
            return thunkApi.rejectWithValue(getErrorMessage(error));
        }
    }
);

export const startDmvReview = createAsyncThunk(
    "dmvReview/startDmvReview",
    async (applicationId: number, thunkApi) => {
        try {
            return await dmvReviewService.startReview(applicationId);
        } catch (error) {
            return thunkApi.rejectWithValue(getErrorMessage(error));
        }
    }
);

export const requestDmvMoreInfo = createAsyncThunk(
    "dmvReview/requestDmvMoreInfo",
    async (applicationId: number, thunkApi) => {
        try {
            return await dmvReviewService.requestMoreInfo(applicationId);
        } catch (error) {
            return thunkApi.rejectWithValue(getErrorMessage(error));
        }
    }
);

export const approveDmvApplication = createAsyncThunk(
    "dmvReview/approveDmvApplication",
    async (applicationId: number, thunkApi) => {
        try {
            return await dmvReviewService.approveApplication(applicationId);
        } catch (error) {
            return thunkApi.rejectWithValue(getErrorMessage(error));
        }
    }
);

export const rejectDmvApplication = createAsyncThunk(
    "dmvReview/rejectDmvApplication",
    async (applicationId: number, thunkApi) => {
        try {
            return await dmvReviewService.rejectApplication(applicationId);
        } catch (error) {
            return thunkApi.rejectWithValue(getErrorMessage(error));
        }
    }
);

function updateApplicationInQueue(
    applications: TitleApplicationResponse[],
    updatedApplication: TitleApplicationResponse
): TitleApplicationResponse[] {
    return applications.map((application) =>
        application.id === updatedApplication.id ? updatedApplication : application
    );
}

const dmvReviewSlice = createSlice({
    name: "dmvReview",
    initialState,
    reducers: {
        clearDmvSelectedApplication(state) {
            state.selectedApplication = null;
        },

        clearDmvReviewError(state) {
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchDmvReviewQueue.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })

            .addCase(fetchDmvReviewQueue.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.applications = action.payload;
            })

            .addCase(fetchDmvReviewQueue.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            })

            .addCase(fetchDmvApplicationById.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })

            .addCase(fetchDmvApplicationById.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.selectedApplication = action.payload;
            })

            .addCase(fetchDmvApplicationById.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            })

            .addCase(startDmvReview.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })

            .addCase(startDmvReview.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.selectedApplication = action.payload;
                state.applications = updateApplicationInQueue(
                    state.applications,
                    action.payload
                );
            })

            .addCase(startDmvReview.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            })

            .addCase(requestDmvMoreInfo.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })

            .addCase(requestDmvMoreInfo.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.selectedApplication = action.payload;
                state.applications = updateApplicationInQueue(
                    state.applications,
                    action.payload
                );
            })

            .addCase(requestDmvMoreInfo.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            })

            .addCase(approveDmvApplication.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })

            .addCase(approveDmvApplication.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.selectedApplication = action.payload;
                state.applications = updateApplicationInQueue(
                    state.applications,
                    action.payload
                );
            })

            .addCase(approveDmvApplication.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            })

            .addCase(rejectDmvApplication.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })

            .addCase(rejectDmvApplication.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.selectedApplication = action.payload;
                state.applications = updateApplicationInQueue(
                    state.applications,
                    action.payload
                );
            })

            .addCase(rejectDmvApplication.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            });
    },
});

export const { clearDmvSelectedApplication, clearDmvReviewError } =
    dmvReviewSlice.actions;

export default dmvReviewSlice.reducer;
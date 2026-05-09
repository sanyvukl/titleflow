import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import { titleApplicationService } from "../../api/titleApplicationService";

import type {
    CreateTitleApplicationRequest,
    TitleApplicationResponse,
    UpdateTitleApplicationRequest,
} from "../../types/titleApplicationTypes";

interface TitleApplicationsState {
    applications: TitleApplicationResponse[];
    selectedApplication: TitleApplicationResponse | null;
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

const initialState: TitleApplicationsState = {
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

export const fetchMyApplications = createAsyncThunk(
    "titleApplications/fetchMyApplications",
    async (_, thunkApi) => {
        try {
            return await titleApplicationService.getMyApplications();
        } catch (error) {
            return thunkApi.rejectWithValue(getErrorMessage(error));
        }
    }
);

export const fetchApplicationById = createAsyncThunk(
    "titleApplications/fetchApplicationById",
    async (applicationId: number, thunkApi) => {
        try {
            return await titleApplicationService.getApplicationById(applicationId);
        } catch (error) {
            return thunkApi.rejectWithValue(getErrorMessage(error));
        }
    }
);

export const createTitleApplication = createAsyncThunk(
    "titleApplications/createTitleApplication",
    async (request: CreateTitleApplicationRequest, thunkApi) => {
        try {
            return await titleApplicationService.createApplication(request);
        } catch (error) {
            return thunkApi.rejectWithValue(getErrorMessage(error));
        }
    }
);

export const updateTitleApplication = createAsyncThunk(
    "titleApplications/updateTitleApplication",
    async (
        payload: {
            applicationId: number;
            request: UpdateTitleApplicationRequest;
        },
        thunkApi
    ) => {
        try {
            return await titleApplicationService.updateApplication(
                payload.applicationId,
                payload.request
            );
        } catch (error) {
            return thunkApi.rejectWithValue(getErrorMessage(error));
        }
    }
);

export const submitTitleApplication = createAsyncThunk(
    "titleApplications/submitTitleApplication",
    async (applicationId: number, thunkApi) => {
        try {
            return await titleApplicationService.submitApplication(applicationId);
        } catch (error) {
            return thunkApi.rejectWithValue(getErrorMessage(error));
        }
    }
);

const titleApplicationsSlice = createSlice({
    name: "titleApplications",
    initialState,
    reducers: {
        clearSelectedApplication(state) {
            state.selectedApplication = null;
        },

        clearTitleApplicationError(state) {
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder

            // fetchMyApplications

            .addCase(fetchMyApplications.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })

            .addCase(fetchMyApplications.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.applications = action.payload;
            })

            .addCase(fetchMyApplications.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            })

            // fetchApplicationById

            .addCase(fetchApplicationById.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })

            .addCase(fetchApplicationById.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.selectedApplication = action.payload;
            })

            .addCase(fetchApplicationById.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            })

            // createTitleApplication

            .addCase(createTitleApplication.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })

            .addCase(createTitleApplication.fulfilled, (state, action) => {
                state.status = "succeeded";

                state.applications.unshift(action.payload);

                state.selectedApplication = action.payload;
            })

            .addCase(createTitleApplication.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            })

            // updateTitleApplication

            .addCase(updateTitleApplication.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })

            .addCase(updateTitleApplication.fulfilled, (state, action) => {
                state.status = "succeeded";

                state.selectedApplication = action.payload;

                state.applications = state.applications.map((application) =>
                    application.id === action.payload.id
                        ? action.payload
                        : application
                );
            })

            .addCase(updateTitleApplication.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            })

            // submitTitleApplication

            .addCase(submitTitleApplication.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })

            .addCase(submitTitleApplication.fulfilled, (state, action) => {
                state.status = "succeeded";

                state.selectedApplication = action.payload;

                state.applications = state.applications.map((application) =>
                    application.id === action.payload.id
                        ? action.payload
                        : application
                );
            })

            .addCase(submitTitleApplication.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            });
    },
});

export const {
    clearSelectedApplication,
    clearTitleApplicationError,
} = titleApplicationsSlice.actions;

export default titleApplicationsSlice.reducer;
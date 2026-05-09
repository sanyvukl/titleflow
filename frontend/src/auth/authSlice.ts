import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { authService } from "./authService";
import { authStorage } from "./authStorage";
import type {
    AuthResponse,
    CurrentUser,
    LoginRequest,
    RegisterRequest,
} from "./authTypes";

type AuthStatus = "idle" | "loading" | "succeeded" | "failed";

interface AuthState {
    user: CurrentUser | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    status: AuthStatus;
    error: string | null;
}

const savedToken = authStorage.getAccessToken();

const initialState: AuthState = {
    user: null,
    accessToken: savedToken,
    isAuthenticated: Boolean(savedToken),
    status: "idle",
    error: null,
};

function getApiErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
        const data = error.response?.data as
            | { message?: string; error?: string }
            | undefined;

        return data?.message ?? data?.error ?? "Request failed";
    }

    return "Unexpected error";
}

export const loginUser = createAsyncThunk<
    AuthResponse,
    LoginRequest,
    { rejectValue: string }
>("auth/loginUser", async (request, { rejectWithValue }) => {
    try {
        return await authService.login(request);
    } catch (error) {
        return rejectWithValue(getApiErrorMessage(error));
    }
});

export const registerUser = createAsyncThunk<
    AuthResponse,
    RegisterRequest,
    { rejectValue: string }
>("auth/registerUser", async (request, { rejectWithValue }) => {
    try {
        return await authService.register(request);
    } catch (error) {
        return rejectWithValue(getApiErrorMessage(error));
    }
});

export const loadCurrentUser = createAsyncThunk<
    CurrentUser,
    void,
    { rejectValue: string }
>("auth/loadCurrentUser", async (_, { rejectWithValue }) => {
    try {
        return await authService.getCurrentUser();
    } catch (error) {
        return rejectWithValue(getApiErrorMessage(error));
    }
});

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
    authService.logout();
});

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        clearAuthError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.user = action.payload.user;
                state.accessToken = action.payload.accessToken;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = "failed";
                state.user = null;
                state.accessToken = null;
                state.isAuthenticated = false;
                state.error = action.payload ?? "Login failed";
            })
            .addCase(registerUser.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.user = action.payload.user;
                state.accessToken = action.payload.accessToken;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = "failed";
                state.user = null;
                state.accessToken = null;
                state.isAuthenticated = false;
                state.error = action.payload ?? "Registration failed";
            })
            .addCase(loadCurrentUser.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(loadCurrentUser.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.user = action.payload;
                state.accessToken = authStorage.getAccessToken();
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(loadCurrentUser.rejected, (state, action) => {
                state.status = "failed";
                state.user = null;
                state.accessToken = null;
                state.isAuthenticated = false;
                state.error = action.payload ?? "Session expired";
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.status = "idle";
                state.user = null;
                state.accessToken = null;
                state.isAuthenticated = false;
                state.error = null;
            });
    },
});

export const { clearAuthError } = authSlice.actions;

export default authSlice.reducer;
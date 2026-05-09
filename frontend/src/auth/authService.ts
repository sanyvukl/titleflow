import { apiClient } from "../api/apiClient";
import { authStorage } from "./authStorage";
import type {
    AuthResponse,
    CurrentUser,
    LoginRequest,
    RegisterRequest,
} from "./authTypes";

export const authService = {
    async login(request: LoginRequest): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>("/auth/login", request);

        authStorage.setAccessToken(response.data.accessToken);

        return response.data;
    },

    async register(request: RegisterRequest): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>(
            "/auth/register",
            request
        );

        authStorage.setAccessToken(response.data.accessToken);

        return response.data;
    },

    async getCurrentUser(): Promise<CurrentUser> {
        const response = await apiClient.get<CurrentUser>("/auth/me");

        return response.data;
    },

    logout(): void {
        authStorage.clearAccessToken();
    },
};
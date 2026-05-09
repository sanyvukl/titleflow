import { apiClient } from "./apiClient";
import type {
    CreateTitleApplicationRequest,
    TitleApplicationResponse,
    UpdateTitleApplicationRequest,
} from "../types/titleApplicationTypes";

export const titleApplicationService = {
    async createApplication(
        request: CreateTitleApplicationRequest
    ): Promise<TitleApplicationResponse> {
        const response = await apiClient.post<TitleApplicationResponse>(
            "/title-applications",
            request
        );

        return response.data;
    },

    async getMyApplications(): Promise<TitleApplicationResponse[]> {
        const response = await apiClient.get<TitleApplicationResponse[]>(
            "/title-applications"
        );

        return response.data;
    },

    async getApplicationById(
        applicationId: number
    ): Promise<TitleApplicationResponse> {
        const response = await apiClient.get<TitleApplicationResponse>(
            `/title-applications/${applicationId}`
        );

        return response.data;
    },

    async updateApplication(
        applicationId: number,
        request: UpdateTitleApplicationRequest
    ): Promise<TitleApplicationResponse> {
        const response = await apiClient.put<TitleApplicationResponse>(
            `/title-applications/${applicationId}`,
            request
        );

        return response.data;
    },

    async submitApplication(
        applicationId: number
    ): Promise<TitleApplicationResponse> {
        const response = await apiClient.post<TitleApplicationResponse>(
            `/title-applications/${applicationId}/submit`
        );

        return response.data;
    },
};
import { apiClient } from "./apiClient";

import type { TitleApplicationResponse } from "../types/titleApplicationTypes";

export const dmvReviewService = {
    async getReviewQueue(): Promise<TitleApplicationResponse[]> {
        const response = await apiClient.get<TitleApplicationResponse[]>(
            "/dmv/title-applications"
        );

        return response.data;
    },

    async getApplicationForReview(
        applicationId: number
    ): Promise<TitleApplicationResponse> {
        const response = await apiClient.get<TitleApplicationResponse>(
            `/dmv/title-applications/${applicationId}`
        );

        return response.data;
    },

    async startReview(applicationId: number): Promise<TitleApplicationResponse> {
        const response = await apiClient.post<TitleApplicationResponse>(
            `/dmv/title-applications/${applicationId}/start-review`
        );

        return response.data;
    },

    async requestMoreInfo(
        applicationId: number
    ): Promise<TitleApplicationResponse> {
        const response = await apiClient.post<TitleApplicationResponse>(
            `/dmv/title-applications/${applicationId}/request-more-info`
        );

        return response.data;
    },

    async approveApplication(
        applicationId: number
    ): Promise<TitleApplicationResponse> {
        const response = await apiClient.post<TitleApplicationResponse>(
            `/dmv/title-applications/${applicationId}/approve`
        );

        return response.data;
    },

    async rejectApplication(
        applicationId: number
    ): Promise<TitleApplicationResponse> {
        const response = await apiClient.post<TitleApplicationResponse>(
            `/dmv/title-applications/${applicationId}/reject`
        );

        return response.data;
    },
};
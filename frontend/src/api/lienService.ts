import { apiClient } from "./apiClient";

import type {
    CreateLienRequest,
    LienResponse,
} from "../types/lienTypes";

export const lienService = {
    async createLien(
        applicationId: number,
        request: CreateLienRequest
    ): Promise<LienResponse> {
        const response = await apiClient.post<LienResponse>(
            `/title-applications/${applicationId}/liens`,
            request
        );

        return response.data;
    },

    async getApplicationLiens(applicationId: number): Promise<LienResponse[]> {
        const response = await apiClient.get<LienResponse[]>(
            `/title-applications/${applicationId}/liens`
        );

        return response.data;
    },

    async getMyLiens(): Promise<LienResponse[]> {
        const response = await apiClient.get<LienResponse[]>("/lender/liens");

        return response.data;
    },

    async releaseLien(
        applicationId: number,
        lienId: number
    ): Promise<LienResponse> {
        const response = await apiClient.post<LienResponse>(
            `/title-applications/${applicationId}/liens/${lienId}/release`
        );

        return response.data;
    },
};
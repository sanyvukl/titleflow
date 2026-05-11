import { apiClient } from "./apiClient";

import type {
    DocumentResponse,
    DocumentType,
} from "../types/documentTypes";

export const documentService = {
    async uploadDocument(
        applicationId: number,
        documentType: DocumentType,
        file: File
    ): Promise<DocumentResponse> {
        const formData = new FormData();

        formData.append("documentType", documentType);
        formData.append("file", file);

        const response = await apiClient.post<DocumentResponse>(
            `/title-applications/${applicationId}/documents`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response.data;
    },

    async getDocuments(applicationId: number): Promise<DocumentResponse[]> {
        const response = await apiClient.get<DocumentResponse[]>(
            `/title-applications/${applicationId}/documents`
        );

        return response.data;
    },

    async downloadDocument(
        applicationId: number,
        documentId: number
    ): Promise<Blob> {
        const response = await apiClient.get(
            `/title-applications/${applicationId}/documents/${documentId}/download`,
            {
                responseType: "blob",
            }
        );

        return response.data;
    },
};
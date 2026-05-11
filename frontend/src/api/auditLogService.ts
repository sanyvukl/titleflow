import { apiClient } from "./apiClient";

import type { AuditLogResponse } from "../types/auditLogTypes";

export const auditLogService = {
    async getAuditLogs(applicationId: number): Promise<AuditLogResponse[]> {
        const response = await apiClient.get<AuditLogResponse[]>(
            `/title-applications/${applicationId}/audit-logs`
        );

        return response.data;
    },
};
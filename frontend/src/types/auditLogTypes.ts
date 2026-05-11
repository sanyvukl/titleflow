export type AuditAction =
    | "APPLICATION_CREATED"
    | "APPLICATION_UPDATED"
    | "APPLICATION_SUBMITTED"
    | "REVIEW_STARTED"
    | "MORE_INFO_REQUESTED"
    | "APPLICATION_APPROVED"
    | "APPLICATION_REJECTED"
    | "DOCUMENT_UPLOADED"
    | "LIEN_CREATED"
    | "LIEN_RELEASED";

export interface AuditLogResponse {
    id: number;
    titleApplicationId: number;
    applicationNumber: string;
    actorUserId: number;
    actorEmail: string;
    action: AuditAction;
    oldValue: string | null;
    newValue: string | null;
    description: string | null;
    createdAt: string;
}
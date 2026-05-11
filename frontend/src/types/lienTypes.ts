export type LienStatus = "ACTIVE" | "RELEASED";

export interface CreateLienRequest {
    lenderName: string;
    lienholderAddress: string;
    loanAccountNumber: string;
}

export interface LienResponse {
    id: number;
    titleApplicationId: number;
    applicationNumber: string;
    lenderUserId: number;
    lenderEmail: string;
    lenderName: string;
    lienholderAddress: string;
    loanAccountNumber: string;
    status: LienStatus;
    createdAt: string;
    releasedAt: string | null;
}
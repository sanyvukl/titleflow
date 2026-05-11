export type DocumentType =
    | "TITLE_COPY"
    | "BILL_OF_SALE"
    | "ODOMETER_DISCLOSURE"
    | "PROOF_OF_INSURANCE"
    | "DRIVER_LICENSE"
    | "LIEN_RELEASE"
    | "POWER_OF_ATTORNEY"
    | "OTHER";

export interface DocumentResponse {
    id: number;
    applicationId: number;
    documentType: DocumentType;
    originalFileName: string;
    contentType: string;
    fileSize: number;
    uploadedByEmail: string;
    uploadedAt: string;
}
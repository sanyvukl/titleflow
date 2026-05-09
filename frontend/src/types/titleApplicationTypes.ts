export type TitleApplicationStatus =
    | "DRAFT"
    | "SUBMITTED"
    | "UNDER_REVIEW"
    | "NEEDS_MORE_INFO"
    | "APPROVED"
    | "REJECTED"
    | "TITLE_ISSUED";

export type OwnerType = "INDIVIDUAL" | "BUSINESS";

export interface VehicleRequest {
    vin: string;
    year: number;
    make: string;
    model: string;
    bodyType: string | null;
    color: string | null;
    odometer: number | null;
}

export interface VehicleResponse {
    id: number;
    vin: string;
    year: number;
    make: string;
    model: string;
    bodyType: string | null;
    color: string | null;
    odometer: number | null;
}

export interface OwnerRequest {
    firstName: string | null;
    lastName: string | null;
    businessName: string | null;
    addressLine1: string;
    addressLine2: string | null;
    city: string;
    state: string;
    zipCode: string;
    phone: string | null;
    email: string | null;
    ownerType: OwnerType;
}

export interface OwnerResponse {
    id: number;
    firstName: string | null;
    lastName: string | null;
    businessName: string | null;
    addressLine1: string;
    addressLine2: string | null;
    city: string;
    state: string;
    zipCode: string;
    phone: string | null;
    email: string | null;
    ownerType: OwnerType;
}

export interface CreateTitleApplicationRequest {
    vehicle: VehicleRequest;
    buyerOwner: OwnerRequest;
    sellerOwner: OwnerRequest;
}

export interface UpdateTitleApplicationRequest {
    vehicle: VehicleRequest;
    buyerOwner: OwnerRequest;
    sellerOwner: OwnerRequest;
}

export interface TitleApplicationResponse {
    id: number;
    applicationNumber: string;
    dealerId: number;
    dealerEmail: string;
    status: TitleApplicationStatus;
    vehicle: VehicleResponse;
    buyerOwner: OwnerResponse;
    sellerOwner: OwnerResponse;
    submittedAt: string | null;
    reviewedAt: string | null;
    createdAt: string;
    updatedAt: string;
}
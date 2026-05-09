export type RoleName =
    | "ADMIN"
    | "DEALER"
    | "DMV_CLERK"
    | "LENDER"
    | "DEVELOPER";

export type UserStatus = "ACTIVE" | "DISABLED" | "LOCKED";

export interface CurrentUser {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    status: UserStatus;
    roles: RoleName[];
}

export interface AuthResponse {
    tokenType: "Bearer";
    accessToken: string;
    user: CurrentUser;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    roleName?: RoleName;
}
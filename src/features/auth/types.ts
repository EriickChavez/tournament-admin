export interface User {
    id: string;
    email: string;
    displayName: string;
    avatarUrl?: string | null;
    isActive?: boolean;
}
export interface LoginPayload {
    email: string
    password: string
}

export interface PublicUserSummary {
    id: string;
    displayName: string;
    avatarUrl: string | null;
}

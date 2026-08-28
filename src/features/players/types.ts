export interface Player {
    id: string;
    tournamentId: string;
    categoryId: string;
    teamId: string;
    firstName: string;
    lastName: string;
    birthDate: string | null;
    number: number | null;
    isCaptain: boolean;
    role: string | null;
}

export interface CreatePlayerPayload {
    categoryId: string;
    teamId: string;
    firstName: string;
    lastName: string;
    birthDate?: string;
    number: number;
    isCaptain?: boolean;
    role?: string;
}

export type UpdatePlayerPayload = Partial<{
    categoryId: string;
    teamId: string;
    firstName: string;
    lastName: string;
    birthDate: string | null;
    number: number;
    isCaptain: boolean;
    role: string | null;
}>;
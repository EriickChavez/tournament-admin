export interface Team {
    id: string;
    tournamentId: string;
    categoryId: string;
    name: string;
    abbreviation: string | null;
    logoUrl: string | null;
}

export interface CreateTeamPayload {
    categoryId: string;
    name: string;
    abbreviation?: string;
    logoUrl?: string;
}

export type UpdateTeamPayload = Partial<CreateTeamPayload>;

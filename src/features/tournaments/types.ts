import type { TournamentBranding } from "../branding/types";

export interface Tournament {
    id: string;
    name: string;
    subtitle?: string;
    description?: string;
    slug: string;
    roleId: string;
    startDate?: string | null;
    endDate?: string | null;
    timezone?: string;
    maxSponsors?: number;
    branding?: TournamentBranding | null;
}

export interface CreateTournamentPayload {
    name: string;
    subtitle?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    timezone?: string;
}

export type UpdateTournamentPayload = Partial<CreateTournamentPayload>;
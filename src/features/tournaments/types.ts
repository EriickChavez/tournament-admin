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
    /** Solo viene en GET /tournaments (listado); el detalle no lo trae. */
    playerCount?: number;
    /** Solo viene en GET /tournaments (listado); el detalle no lo trae. */
    teamCount?: number;
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
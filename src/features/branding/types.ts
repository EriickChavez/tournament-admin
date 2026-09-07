export interface TournamentBranding {
    tournamentId: string;
    logoUrl: string | null;
    bannerUrl: string | null;
    updatedAt: string;
}

export interface UpsertBrandingPayload {
    logo?: File;
    banner?: File;
}
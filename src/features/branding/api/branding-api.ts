import { httpClient } from "../../../shared/api/http-client";
import type { TournamentBranding, UpsertBrandingPayload } from "../types";

export const brandingApi = {
    getByTournament: (tournamentId: string) =>
        httpClient.get<{ branding: TournamentBranding }>(
            `/tournaments/${tournamentId}/branding`
        ),

    upsert: (tournamentId: string, payload: UpsertBrandingPayload) => {
        const formData = new FormData();
        if (payload.logo) formData.append("logo", payload.logo);
        if (payload.banner) formData.append("banner", payload.banner);

        return httpClient.patchForm<{ branding: TournamentBranding }>(
            `/tournaments/${tournamentId}/branding`,
            formData
        );
    },
};
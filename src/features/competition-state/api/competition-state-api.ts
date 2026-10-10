import { httpClient } from "../../../shared/api/http-client";
import type { CompetitionState } from "../types";

export const competitionStateApi = {
    get: (tournamentId: string) =>
        httpClient.get<CompetitionState>(
            `/tournaments/${tournamentId}/competition-state`,
        ),
};
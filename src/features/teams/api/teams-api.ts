import { httpClient } from "../../../shared/api/http-client";
import type { Team, CreateTeamPayload, UpdateTeamPayload } from "../types";

export const teamsApi = {
    listByTournament: (tournamentId: string) =>
        httpClient.get<{ teams: Team[] }>(`/tournaments/${tournamentId}/teams`),

    create: (tournamentId: string, payload: CreateTeamPayload) =>
        httpClient.post<{ team: Team }>(`/tournaments/${tournamentId}/teams`, payload),

    update: (id: string, payload: UpdateTeamPayload) =>
        httpClient.patch<{ team: Team }>(`/teams/${id}`, payload),

    delete: (id: string) =>
        httpClient.delete<{ message: string }>(`/teams/${id}`),
};
import { httpClient } from "../../../shared/api/http-client";
import type { Team, CreateTeamPayload, UpdateTeamPayload } from "../types";
import type {
    PaginationMeta,
    PaginationParams,
} from "../../../shared/types/pagination";

export const teamsApi = {
    listByTournament: (tournamentId: string, pagination: PaginationParams) =>
        httpClient.get<{ teams: Team[]; pagination: PaginationMeta }>(
            `/tournaments/${tournamentId}/teams?page=${pagination.page}&limit=${pagination.limit}`,
        ),

    listByCategory: (tournamentId: string, categoryId: string) =>
        httpClient.get<{ teams: Team[]; pagination: PaginationMeta }>(
            `/tournaments/${tournamentId}/teams?categoryId=${categoryId}&page=1&limit=100`,
        ),

    create: (tournamentId: string, payload: CreateTeamPayload) =>
        httpClient.post<{ team: Team }>(`/tournaments/${tournamentId}/teams`, payload),

    update: (id: string, payload: UpdateTeamPayload) =>
        httpClient.patch<{ team: Team }>(`/teams/${id}`, payload),

    delete: (id: string) =>
        httpClient.delete<{ message: string }>(`/teams/${id}`),
};
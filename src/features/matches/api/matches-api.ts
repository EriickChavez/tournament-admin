import { httpClient } from "../../../shared/api/http-client";
import type {
    Match,
    CreateMatchPayload,
    UpdateMatchPayload,
    MatchStatus,
} from "../types";
import type {
    PaginationMeta,
    PaginationParams,
} from "../../../shared/types/pagination";

export interface ListMatchesFilters {
    categoryId?: string | undefined;
    status?: MatchStatus | undefined;
}

export const matchesApi = {
    listByTournament: (
        tournamentId: string,
        pagination: PaginationParams,
        filters?: ListMatchesFilters,
    ) => {
        const params = new URLSearchParams({
            page: String(pagination.page),
            limit: String(pagination.limit),
        });
        if (filters?.categoryId) params.set("categoryId", filters.categoryId);
        if (filters?.status) params.set("status", filters.status);

        return httpClient.get<{ matches: Match[]; pagination: PaginationMeta }>(
            `/tournaments/${tournamentId}/matches?${params.toString()}`,
        );
    },

    create: (tournamentId: string, payload: CreateMatchPayload) =>
        httpClient.post<{ match: Match }>(
            `/tournaments/${tournamentId}/matches`,
            payload,
        ),

    update: (id: string, payload: UpdateMatchPayload) =>
        httpClient.patch<{ match: Match }>(`/matches/${id}`, payload),

    delete: (id: string) =>
        httpClient.delete<{ message: string }>(`/matches/${id}`),
};
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
    phaseId?: string | undefined;
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
        if (filters?.phaseId) params.set("phaseId", filters.phaseId);

        return httpClient.get<{ matches: Match[]; pagination: PaginationMeta }>(
            `/tournaments/${tournamentId}/matches?${params.toString()}`,
        );
    },

    getById: (id: string) =>
        httpClient.get<{ match: Match }>(`/matches/${id}`),

    create: (tournamentId: string, payload: CreateMatchPayload) =>
        httpClient.post<{ match: Match }>(
            `/tournaments/${tournamentId}/matches`,
            payload,
        ),

    update: (id: string, payload: UpdateMatchPayload) =>
        httpClient.patch<{ match: Match }>(`/matches/${id}`, payload),

    /** Abre la cédula: scheduled | postponed → in_progress. */
    start: (id: string) =>
        httpClient.post<{ match: Match }>(`/matches/${id}/start`, {}),

    /** Cierra la cédula: in_progress → finished (fija el marcador desde los eventos). */
    finish: (id: string) =>
        httpClient.post<{ match: Match }>(`/matches/${id}/finish`, {}),

    /** Reabre la cédula: finished → in_progress. */
    reopen: (id: string) =>
        httpClient.post<{ match: Match }>(`/matches/${id}/reopen`, {}),

    /** Árbitros asignados al partido (ids de usuario). Cualquier miembro del torneo puede verlos. */
    getReferees: (id: string) =>
        httpClient.get<{ refereeUserIds: string[] }>(`/matches/${id}/referees`),

    /** Reemplaza el conjunto completo de árbitros. Solo el dueño. [] deja el partido sin asignar. */
    setReferees: (id: string, userIds: string[]) =>
        httpClient.put<{ refereeUserIds: string[] }>(`/matches/${id}/referees`, {
            userIds,
        }),

    delete: (id: string) =>
        httpClient.delete<{ message: string }>(`/matches/${id}`),
};
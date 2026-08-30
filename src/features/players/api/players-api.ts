import { httpClient } from "../../../shared/api/http-client";
import type {
    Player,
    CreatePlayerPayload,
    UpdatePlayerPayload,
} from "../types";
import type {
    PaginationMeta,
    PaginationParams,
} from "../../../shared/types/pagination";

export const playersApi = {
    listByTournament: (tournamentId: string, pagination: PaginationParams) =>
        httpClient.get<{ players: Player[]; pagination: PaginationMeta }>(
            `/tournaments/${tournamentId}/players?page=${pagination.page}&limit=${pagination.limit}`,
        ),

    create: (tournamentId: string, payload: CreatePlayerPayload) =>
        httpClient.post<{ player: Player }>(
            `/tournaments/${tournamentId}/players`,
            payload,
        ),

    update: (id: string, payload: UpdatePlayerPayload) =>
        httpClient.patch<{ player: Player }>(`/players/${id}`, payload),

    delete: (id: string) =>
        httpClient.delete<{ message: string }>(`/players/${id}`),
};
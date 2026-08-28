import { httpClient } from "../../../shared/api/http-client";
import type {
    Player,
    CreatePlayerPayload,
    UpdatePlayerPayload,
} from "../types";

export const playersApi = {
    listByTournament: (tournamentId: string) =>
        httpClient.get<{ players: Player[] }>(
            `/tournaments/${tournamentId}/players`,
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
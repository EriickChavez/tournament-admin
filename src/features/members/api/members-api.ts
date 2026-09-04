import { httpClient } from "../../../shared/api/http-client";
import type { Member } from "../types";

export const membersApi = {
    listByTournament: (tournamentId: string) =>
        httpClient.get<{ members: Member[] }>(`/tournaments/${tournamentId}/members`),
    invite: (tournamentId: string, userId: string) =>
        httpClient.post<{ member: Member }>(`/tournaments/${tournamentId}/members`, { userId }),
    updateRole: (tournamentId: string, memberId: string) =>
        httpClient.patch<{ member: Member }>(`/tournaments/${tournamentId}/members/${memberId}`),
    remove: (tournamentId: string, memberId: string) =>
        httpClient.delete<{ message: string }>(`/tournaments/${tournamentId}/members/${memberId}`),
};

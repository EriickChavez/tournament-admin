import { httpClient } from "../../../shared/api/http-client";
import type { Member, CreateMemberAccountPayload } from "../types";

export const membersApi = {
    listByTournament: (tournamentId: string) =>
        httpClient.get<{ members: Member[] }>(`/tournaments/${tournamentId}/members`),
    invite: (tournamentId: string, userId: string) =>
        httpClient.post<{ member: Member }>(`/tournaments/${tournamentId}/members`, { userId }),
    createAccount: (tournamentId: string, payload: CreateMemberAccountPayload) =>
        httpClient.post<{ member: Member }>(
            `/tournaments/${tournamentId}/members/create-account`,
            payload,
        ),
    updateRole: (tournamentId: string, memberId: string) =>
        httpClient.patch<{ member: Member }>(`/tournaments/${tournamentId}/members/${memberId}`),
    remove: (tournamentId: string, memberId: string) =>
        httpClient.delete<{ message: string }>(`/tournaments/${tournamentId}/members/${memberId}`),
};
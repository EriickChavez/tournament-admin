import { httpClient } from "../../../shared/api/http-client";
import type {
    Phase,
    PhaseGroup,
    PhaseTeam,
    CreatePhasePayload,
    UpdatePhasePayload,
    CreatePhaseGroupPayload,
    UpdatePhaseGroupPayload,
    SyncPhaseTeamsPayload,
} from "../types";

export const phasesApi = {
    listByCategory: (tournamentId: string, categoryId: string) =>
        httpClient.get<{ phases: Phase[] }>(
            `/tournaments/${tournamentId}/categories/${categoryId}/phases`,
        ),

    getById: (id: string) =>
        httpClient.get<{ phase: Phase }>(`/phases/${id}`),

    create: (
        tournamentId: string,
        categoryId: string,
        payload: CreatePhasePayload,
    ) =>
        httpClient.post<{ phase: Phase }>(
            `/tournaments/${tournamentId}/categories/${categoryId}/phases`,
            payload,
        ),

    update: (id: string, payload: UpdatePhasePayload) =>
        httpClient.patch<{ phase: Phase }>(`/phases/${id}`, payload),

    delete: (id: string) =>
        httpClient.delete<{ message: string }>(`/phases/${id}`),

    listGroups: (phaseId: string) =>
        httpClient.get<{ groups: PhaseGroup[] }>(`/phases/${phaseId}/groups`),

    createGroup: (phaseId: string, payload: CreatePhaseGroupPayload) =>
        httpClient.post<{ group: PhaseGroup }>(
            `/phases/${phaseId}/groups`,
            payload,
        ),

    updateGroup: (id: string, payload: UpdatePhaseGroupPayload) =>
        httpClient.patch<{ group: PhaseGroup }>(`/phase-groups/${id}`, payload),

    deleteGroup: (id: string) =>
        httpClient.delete<{ message: string }>(`/phase-groups/${id}`),

    listTeams: (phaseId: string) =>
        httpClient.get<{ teams: PhaseTeam[] }>(`/phases/${phaseId}/teams`),

    syncTeams: (phaseId: string, payload: SyncPhaseTeamsPayload) =>
        httpClient.put<{ teams: PhaseTeam[] }>(
            `/phases/${phaseId}/teams`,
            payload,
        ),
};
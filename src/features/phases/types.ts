export type PhaseType = "group" | "knockout" | "league";

export type PhaseStatus = "upcoming" | "active" | "finished";

export interface Phase {
    id: string;
    tournamentId: string;
    categoryId: string;
    name: string;
    type: PhaseType;
    status: PhaseStatus;
    sortOrder: number;
    startDate: string | null;
    endDate: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface PhaseGroup {
    id: string;
    phaseId: string;
    name: string;
    sortOrder: number;
    createdAt: string;
    updatedAt: string;
}

export interface PhaseTeam {
    id: string;
    phaseId: string;
    teamId: string;
    phaseGroupId: string | null;
    seed: number | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreatePhasePayload {
    name: string;
    type: PhaseType;
    status?: PhaseStatus;
    sortOrder?: number;
    startDate?: string | null;
    endDate?: string | null;
}

export type UpdatePhasePayload = Partial<CreatePhasePayload>;

export interface CreatePhaseGroupPayload {
    name: string;
    sortOrder?: number;
}

export type UpdatePhaseGroupPayload = Partial<CreatePhaseGroupPayload>;

export interface SyncPhaseTeamItem {
    teamId: string;
    phaseGroupId?: string | null;
    seed?: number | null;
}

export interface SyncPhaseTeamsPayload {
    teams: SyncPhaseTeamItem[];
}

export const PHASE_TYPE_LABELS: Record<PhaseType, string> = {
    group: "Grupos",
    knockout: "Eliminatoria",
    league: "Liga",
};

export const PHASE_STATUS_LABELS: Record<PhaseStatus, string> = {
    upcoming: "Próxima",
    active: "En curso",
    finished: "Finalizada",
};
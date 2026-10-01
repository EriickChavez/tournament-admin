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

// ---- Posiciones y clasificación (GET /phases/:id/standings) ----

export interface StandingRow {
    teamId: string;
    position: number;
    played: number;
    won: number;
    drawn: number;
    lost: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
    points: number;
    /** Equipos con el mismo valor siguen empatados tras los desempates automáticos. */
    tieGroup: number | null;
}

export interface GroupStandings {
    group: PhaseGroup;
    standings: StandingRow[];
}

export interface QualifiedTeam {
    teamId: string;
    groupId: string;
    position: number;
    via: "group" | "best_next";
}

export interface BestNextEntry {
    teamId: string;
    groupId: string;
    points: number;
    goalDifference: number;
    goalsFor: number;
    qualified: boolean;
}

export interface PendingTie {
    scope: "group" | "best_next";
    groupId: string | null;
    teamIds: string[];
}

export interface Qualification {
    perGroup: number;
    bestNext: number;
    qualified: QualifiedTeam[];
    bestNextRanking: BestNextEntry[];
    pendingTies: PendingTie[];
}

export interface PhaseProgress {
    expectedMatches: number;
    finishedMatches: number;
    isComplete: boolean;
}

export interface PhaseStandingsResponse {
    phase: Phase;
    progress: PhaseProgress;
    groups: GroupStandings[];
    qualification: Qualification | null;
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
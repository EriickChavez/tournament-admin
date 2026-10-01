export type MatchStatus =
    | "scheduled"
    | "in_progress"
    | "finished"
    | "cancelled"
    | "postponed";

export interface MatchTeamSummary {
    id: string;
    name: string;
    abbreviation: string | null;
    logoUrl: string | null;
}

export interface MatchCategorySummary {
    id: string;
    title: string;
}

export interface Match {
    id: string;
    tournamentId: string;
    categoryId: string;
    homeTeamId: string;
    awayTeamId: string;
    scheduledAt: string;
    venue: string | null;
    status: MatchStatus;
    phaseId?: string | null;
    phaseGroupId?: string | null;
    round?: number | null;
    homeScore?: number | null;
    awayScore?: number | null;
    /** Presente en list/get (respuesta enriquecida del backend). */
    homeTeam?: MatchTeamSummary;
    awayTeam?: MatchTeamSummary;
    category?: MatchCategorySummary;
}

export interface CreateMatchPayload {
    categoryId: string;
    homeTeamId: string;
    awayTeamId: string;
    scheduledAt: string;
    venue?: string;
    status?: MatchStatus;
    phaseId?: string | null;
    phaseGroupId?: string | null;
    round?: number | null;
}

export type UpdateMatchPayload = Partial<{
    categoryId: string;
    homeTeamId: string;
    awayTeamId: string;
    scheduledAt: string;
    venue: string | null;
    status: MatchStatus;
    // El backend exige mandar los dos juntos (o ambos null para borrar el marcador).
    homeScore: number | null;
    awayScore: number | null;
}>;

export const MATCH_STATUS_LABELS: Record<MatchStatus, string> = {
    scheduled: "Programado",
    in_progress: "En curso",
    finished: "Finalizado",
    cancelled: "Cancelado",
    postponed: "Pospuesto",
};
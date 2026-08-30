export type MatchStatus =
    | "scheduled"
    | "in_progress"
    | "finished"
    | "cancelled"
    | "postponed";

export interface Match {
    id: string;
    tournamentId: string;
    categoryId: string;
    homeTeamId: string;
    awayTeamId: string;
    scheduledAt: string;
    venue: string | null;
    status: MatchStatus;
}

export interface CreateMatchPayload {
    categoryId: string;
    homeTeamId: string;
    awayTeamId: string;
    scheduledAt: string;
    venue?: string;
    status?: MatchStatus;
}

export type UpdateMatchPayload = Partial<{
    categoryId: string;
    homeTeamId: string;
    awayTeamId: string;
    scheduledAt: string;
    venue: string | null;
    status: MatchStatus;
}>;

export const MATCH_STATUS_LABELS: Record<MatchStatus, string> = {
    scheduled: "Programado",
    in_progress: "En curso",
    finished: "Finalizado",
    cancelled: "Cancelado",
    postponed: "Pospuesto",
};

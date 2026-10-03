export type BracketStage = "play_in" | "main" | "third_place";

export interface BracketNodeSource {
    nodeId: string;
    kind: "winner" | "loser";
}

export interface BracketNode {
    id: string;
    stage: BracketStage;
    round: number;
    position: number;
    homeTeamId: string | null;
    awayTeamId: string | null;
    homeSeed: number | null;
    awaySeed: number | null;
    /** De dónde saldrá el equipo mientras no se conoce. */
    homeSource: BracketNodeSource | null;
    awaySource: BracketNodeSource | null;
    matchId: string | null;
    winnerTeamId: string | null;
}

export interface GenerateBracketPayload {
    sourcePhaseId: string;
    thirdPlace?: boolean;
}

export interface ScheduleBracketNodePayload {
    scheduledAt: string;
    venue?: string;
}
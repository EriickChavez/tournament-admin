export type MatchEventType =
  | "gol"
  | "asistencia"
  | "tarjeta_amarilla"
  | "tarjeta_roja"
  | "cambio"
  | "otro";

export interface MatchEvent {
  id: string;
  matchId: string;
  eventType: MatchEventType;
  minute?: number | null;
  teamId: string;
  playerId?: string | null;
  assistedByPlayerId?: string | null;
  description?: string | null;
}

export interface CreateMatchEventPayload {
  eventType: MatchEventType;
  minute?: number;
  teamId: string;
  playerId?: string;
  assistedByPlayerId?: string;
  description?: string;
}

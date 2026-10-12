export type MatchEventType =
  | "gol"
  | "gol_penal"
  | "autogol"
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
  clientEventId?: string | null;
}

export interface CreateMatchEventPayload {
  eventType: MatchEventType;
  minute?: number;
  teamId: string;
  playerId?: string;
  assistedByPlayerId?: string;
  description?: string;
  /** UUID generado en el cliente: un reintento con el mismo id no duplica el evento. */
  clientEventId?: string;
}
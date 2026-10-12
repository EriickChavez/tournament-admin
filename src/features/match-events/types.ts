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
  /** En un cambio es el jugador que sale. */
  playerId?: string | null;
  assistedByPlayerId?: string | null;
  /** Solo en un cambio: el jugador que entra. */
  substitutePlayerId?: string | null;
  description?: string | null;
  clientEventId?: string | null;
  occurredAt?: string | null;
  /** Evento generado por el sistema (roja por doble amarilla). */
  derivedFromEventId?: string | null;
}

export interface CreateMatchEventPayload {
  eventType: MatchEventType;
  minute?: number;
  teamId: string;
  playerId?: string;
  assistedByPlayerId?: string;
  substitutePlayerId?: string;
  description?: string;
  /** UUID generado en el cliente: un reintento con el mismo id no duplica el evento. */
  clientEventId?: string;
  /** Hora real del evento (ISO) cuando se registra con retraso. */
  occurredAt?: string;
}
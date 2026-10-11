import { httpClient } from "../../../shared/api/http-client";
import type { MatchEvent, CreateMatchEventPayload } from "../types";

export const matchEventsApi = {
  listByMatch: (matchId: string) =>
    httpClient.get<{ events: MatchEvent[] }>(`/matches/${matchId}/events`),

  create: (matchId: string, payload: CreateMatchEventPayload) =>
    httpClient.post<{ event: MatchEvent }>(`/matches/${matchId}/events`, payload),

  delete: (id: string) =>
    httpClient.delete<{ message: string }>(`/match-events/${id}`),
};

import { useQuery } from "@tanstack/react-query";
import { matchEventsApi } from "../api/match-events-api";

export function useMatchEvents(matchId?: string) {
  return useQuery({
    queryKey: ["matches", matchId, "events"],
    queryFn: () => matchEventsApi.listByMatch(matchId!),
    enabled: Boolean(matchId),
  });
}

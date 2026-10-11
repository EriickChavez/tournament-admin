import { useMutation, useQueryClient } from "@tanstack/react-query";
import { matchEventsApi } from "../api/match-events-api";
import type { CreateMatchEventPayload } from "../types";

export function useCreateMatchEvent(tournamentId: string, matchId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateMatchEventPayload) =>
      matchEventsApi.create(matchId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["matches", matchId, "events"],
      });
      queryClient.invalidateQueries({
        queryKey: ["tournaments", tournamentId, "matches"],
      });
      queryClient.invalidateQueries({
        queryKey: ["matches", matchId],
      });
    },
  });
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { matchEventsApi } from "../api/match-events-api";

export function useDeleteMatchEvent(tournamentId: string, matchId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) => matchEventsApi.delete(eventId),
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

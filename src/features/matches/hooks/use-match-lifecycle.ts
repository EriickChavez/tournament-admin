import { useMutation, useQueryClient } from "@tanstack/react-query";
import { matchesApi } from "../api/matches-api";

type LifecycleAction = "start" | "finish" | "reopen";

function useMatchLifecycleAction(tournamentId: string, action: LifecycleAction) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (matchId: string) => matchesApi[action](matchId),
        onSuccess: (_data, matchId) => {
            // Esta clave también cubre posiciones y llaves (cuelgan de ella a propósito).
            queryClient.invalidateQueries({
                queryKey: ["tournaments", tournamentId, "matches"],
            });
            queryClient.invalidateQueries({ queryKey: ["matches", matchId] });
        },
    });
}

export const useStartMatch = (tournamentId: string) =>
    useMatchLifecycleAction(tournamentId, "start");

export const useFinishMatch = (tournamentId: string) =>
    useMatchLifecycleAction(tournamentId, "finish");

export const useReopenMatch = (tournamentId: string) =>
    useMatchLifecycleAction(tournamentId, "reopen");
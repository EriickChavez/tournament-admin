import { useMutation, useQueryClient } from "@tanstack/react-query";
import { phasesApi } from "../api/phases-api";

export function useReopenPhase(tournamentId: string, phaseId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => phasesApi.reopenPhase(phaseId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["phases", phaseId] });
            queryClient.invalidateQueries({
                queryKey: [
                    "tournaments",
                    tournamentId,
                    "matches",
                    "standings",
                    phaseId,
                ],
            });
            queryClient.invalidateQueries({
                queryKey: ["tournaments", tournamentId, "categories"],
            });
        },
    });
}
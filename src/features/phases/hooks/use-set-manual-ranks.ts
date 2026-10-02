import { useMutation, useQueryClient } from "@tanstack/react-query";
import { phasesApi } from "../api/phases-api";
import type { SetManualRanksPayload } from "../types";

export function useSetManualRanks(tournamentId: string, phaseId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: SetManualRanksPayload) =>
            phasesApi.setManualRanks(phaseId, payload),
        onSuccess: () => {
            // Misma clave que usePhaseStandings: la tabla se recalcula con la decisión nueva.
            queryClient.invalidateQueries({
                queryKey: [
                    "tournaments",
                    tournamentId,
                    "matches",
                    "standings",
                    phaseId,
                ],
            });
        },
    });
}
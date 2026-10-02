import { useMutation, useQueryClient } from "@tanstack/react-query";
import { phasesApi } from "../api/phases-api";
import type { ClosePhasePayload } from "../types";

export function useClosePhase(tournamentId: string, phaseId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: ClosePhasePayload) =>
            phasesApi.closePhase(phaseId, payload),
        onSuccess: () => {
            // La fase pasa a "finished": se refrescan la fase, sus tablas y el listado de fases.
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
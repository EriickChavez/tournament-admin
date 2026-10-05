import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bracketsApi } from "../api/brackets-api";
import type { SetBracketNodePenaltiesPayload } from "../types";

export function useSetBracketNodePenalties(
    tournamentId: string,
    phaseId: string,
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            nodeId,
            payload,
        }: {
            nodeId: string;
            payload: SetBracketNodePenaltiesPayload;
        }) => bracketsApi.setNodePenalties(phaseId, nodeId, payload),
        onSuccess: () => {
            // El ganador avanza (o deja de avanzar): se refresca toda la llave.
            queryClient.invalidateQueries({
                queryKey: ["tournaments", tournamentId, "matches"],
            });
        },
    });
}
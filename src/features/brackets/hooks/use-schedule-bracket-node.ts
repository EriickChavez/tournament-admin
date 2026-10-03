import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bracketsApi } from "../api/brackets-api";
import type { ScheduleBracketNodePayload } from "../types";

export function useScheduleBracketNode(tournamentId: string, phaseId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            nodeId,
            payload,
        }: {
            nodeId: string;
            payload: ScheduleBracketNodePayload;
        }) => bracketsApi.scheduleNode(phaseId, nodeId, payload),
        onSuccess: () => {
            // Se crea un partido: se refrescan la llave y las listas de partidos.
            queryClient.invalidateQueries({
                queryKey: ["tournaments", tournamentId, "matches"],
            });
        },
    });
}
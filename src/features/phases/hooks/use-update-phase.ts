import { useMutation, useQueryClient } from "@tanstack/react-query";
import { phasesApi } from "../api/phases-api";
import type { UpdatePhasePayload } from "../types";

export function useUpdatePhase(tournamentId: string, categoryId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            payload,
        }: {
            id: string;
            payload: UpdatePhasePayload;
        }) => phasesApi.update(id, payload),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({
                queryKey: [
                    "tournaments",
                    tournamentId,
                    "categories",
                    categoryId,
                    "phases",
                ],
            });
            queryClient.invalidateQueries({
                queryKey: ["phases", variables.id],
            });
        },
    });
}
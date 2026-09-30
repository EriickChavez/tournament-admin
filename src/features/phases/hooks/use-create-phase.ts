import { useMutation, useQueryClient } from "@tanstack/react-query";
import { phasesApi } from "../api/phases-api";
import type { CreatePhasePayload } from "../types";

export function useCreatePhase(tournamentId: string, categoryId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreatePhasePayload) =>
            phasesApi.create(tournamentId, categoryId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [
                    "tournaments",
                    tournamentId,
                    "categories",
                    categoryId,
                    "phases",
                ],
            });
        },
    });
}
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { phasesApi } from "../api/phases-api";

export function useDeletePhase(tournamentId: string, categoryId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => phasesApi.delete(id),
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
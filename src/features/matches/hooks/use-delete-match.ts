import { useMutation, useQueryClient } from "@tanstack/react-query";
import { matchesApi } from "../api/matches-api";

export function useDeleteMatch(tournamentId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => matchesApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["tournaments", tournamentId, "matches"],
            });
        },
    });
}
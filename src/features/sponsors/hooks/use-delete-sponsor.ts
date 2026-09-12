import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sponsorsApi } from "../api/sponsors-api";

export function useDeleteSponsor(tournamentId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => sponsorsApi.delete(tournamentId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["tournaments", tournamentId, "sponsors"],
            });
        },
    });
}
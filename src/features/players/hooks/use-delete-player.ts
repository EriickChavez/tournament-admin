import { useMutation, useQueryClient } from "@tanstack/react-query";
import { playersApi } from "../api/players-api";

export function useDeletePlayer(tournamentId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => playersApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["tournaments", tournamentId, "players"],
            });
        },
    });
}
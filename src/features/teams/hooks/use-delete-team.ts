import { useMutation, useQueryClient } from "@tanstack/react-query";
import { teamsApi } from "../api/teams-api";

export function useDeleteTeam(tournamentId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => teamsApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["tournaments", tournamentId, "teams"],
            });
        },
    });
}
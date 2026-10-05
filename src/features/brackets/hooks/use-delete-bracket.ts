import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bracketsApi } from "../api/brackets-api";

export function useDeleteBracket(tournamentId: string, phaseId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => bracketsApi.delete(phaseId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["tournaments", tournamentId, "matches"],
            });
        },
    });
}
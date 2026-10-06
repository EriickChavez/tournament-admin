import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryClosuresApi } from "../api/category-closures-api";

export function useReopenCategory(tournamentId: string, categoryId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => categoryClosuresApi.reopen(tournamentId, categoryId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["tournaments", tournamentId, "category-closures"],
            });
        },
    });
}
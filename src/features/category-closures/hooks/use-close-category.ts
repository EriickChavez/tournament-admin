import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryClosuresApi } from "../api/category-closures-api";

export function useCloseCategory(tournamentId: string, categoryId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => categoryClosuresApi.close(tournamentId, categoryId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["tournaments", tournamentId, "category-closures"],
            });
        },
    });
}
import { useQuery } from "@tanstack/react-query";
import { categoryClosuresApi } from "../api/category-closures-api";

export function useCategoryClosures(tournamentId: string | undefined) {
    return useQuery({
        queryKey: ["tournaments", tournamentId, "category-closures"],
        queryFn: () => categoryClosuresApi.list(tournamentId!),
        enabled: Boolean(tournamentId),
    });
}
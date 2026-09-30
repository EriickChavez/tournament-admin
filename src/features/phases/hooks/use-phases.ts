import { useQuery } from "@tanstack/react-query";
import { phasesApi } from "../api/phases-api";

export function usePhases(tournamentId?: string, categoryId?: string) {
    return useQuery({
        queryKey: ["tournaments", tournamentId, "categories", categoryId, "phases"],
        queryFn: () => phasesApi.listByCategory(tournamentId!, categoryId!),
        enabled: Boolean(tournamentId && categoryId),
    });
}
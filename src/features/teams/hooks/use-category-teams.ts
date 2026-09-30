import { useQuery } from "@tanstack/react-query";
import { teamsApi } from "../api/teams-api";

export function useCategoryTeams(tournamentId?: string, categoryId?: string) {
    return useQuery({
        queryKey: ["tournaments", tournamentId, "teams", "category", categoryId],
        queryFn: () => teamsApi.listByCategory(tournamentId!, categoryId!),
        enabled: Boolean(tournamentId && categoryId),
    });
}
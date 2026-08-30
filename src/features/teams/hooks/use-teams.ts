import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { teamsApi } from "../api/teams-api";
import {
    DEFAULT_PAGE,
    DEFAULT_PAGE_SIZE,
} from "../../../shared/types/pagination";

export function useTeams(
    tournamentId?: string,
    page: number = DEFAULT_PAGE,
    limit: number = DEFAULT_PAGE_SIZE,
) {
    return useQuery({
        queryKey: ["tournaments", tournamentId, "teams", { page, limit }],
        queryFn: () => teamsApi.listByTournament(tournamentId!, { page, limit }),
        enabled: Boolean(tournamentId),
        placeholderData: keepPreviousData,
    });
}
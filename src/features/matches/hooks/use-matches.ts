import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { matchesApi, type ListMatchesFilters } from "../api/matches-api";
import {
    DEFAULT_PAGE,
    DEFAULT_PAGE_SIZE,
} from "../../../shared/types/pagination";

export function useMatches(
    tournamentId?: string,
    page: number = DEFAULT_PAGE,
    limit: number = DEFAULT_PAGE_SIZE,
    filters?: ListMatchesFilters,
) {
    return useQuery({
        queryKey: [
            "tournaments",
            tournamentId,
            "matches",
            { page, limit, ...filters },
        ],
        queryFn: () =>
            matchesApi.listByTournament(tournamentId!, { page, limit }, filters),
        enabled: Boolean(tournamentId),
        placeholderData: keepPreviousData,
    });
}

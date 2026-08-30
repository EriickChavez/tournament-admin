import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { playersApi } from "../api/players-api";
import {
    DEFAULT_PAGE,
    DEFAULT_PAGE_SIZE,
} from "../../../shared/types/pagination";

export function usePlayers(
    tournamentId?: string,
    page: number = DEFAULT_PAGE,
    limit: number = DEFAULT_PAGE_SIZE,
) {
    return useQuery({
        queryKey: ["tournaments", tournamentId, "players", { page, limit }],
        queryFn: () => playersApi.listByTournament(tournamentId!, { page, limit }),
        enabled: Boolean(tournamentId),
        placeholderData: keepPreviousData,
    });
}
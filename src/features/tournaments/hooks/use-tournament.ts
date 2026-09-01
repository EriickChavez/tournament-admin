import { useQuery } from "@tanstack/react-query";
import { tournamentsApi } from "../api/tournaments-api";

export function useTournament(tournamentId: string | undefined) {
    return useQuery({
        queryKey: ["tournaments", tournamentId],
        queryFn: () => tournamentsApi.getById(tournamentId!),
        enabled: Boolean(tournamentId),
    });
}
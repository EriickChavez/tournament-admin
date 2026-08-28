import { useQuery } from "@tanstack/react-query";
import { playersApi } from "../api/players-api";

export function usePlayers(tournamentId?: string) {
    return useQuery({
        queryKey: ["tournaments", tournamentId, "players"],
        queryFn: () => playersApi.listByTournament(tournamentId!),
        enabled: Boolean(tournamentId),
    });
}
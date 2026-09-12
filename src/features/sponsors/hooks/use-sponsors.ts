import { useQuery } from "@tanstack/react-query";
import { sponsorsApi } from "../api/sponsors-api";

export function useSponsors(tournamentId?: string) {
    return useQuery({
        queryKey: ["tournaments", tournamentId, "sponsors"],
        queryFn: () => sponsorsApi.listByTournament(tournamentId!),
        enabled: Boolean(tournamentId),
    });
}
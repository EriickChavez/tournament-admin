import { useQuery } from "@tanstack/react-query";
import { teamsApi } from "../api/teams-api";

export function useTeams(tournamentId?: string) {
    return useQuery({
        queryKey: ["tournaments", tournamentId, "teams"],
        queryFn: () => teamsApi.listByTournament(tournamentId!),
        enabled: Boolean(tournamentId),
    });
}
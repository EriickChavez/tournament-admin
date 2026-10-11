import { useQuery } from "@tanstack/react-query";
import { playersApi } from "../api/players-api";

export function useTeamPlayers(teamId?: string) {
    return useQuery({
        queryKey: ["teams", teamId, "players"],
        queryFn: () => playersApi.listByTeam(teamId!),
        enabled: Boolean(teamId),
    });
}

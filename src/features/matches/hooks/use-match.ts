import { useQuery } from "@tanstack/react-query";
import { matchesApi } from "../api/matches-api";

export function useMatch(matchId: string | undefined) {
    return useQuery({
        queryKey: ["matches", matchId],
        queryFn: () => matchesApi.getById(matchId!),
        enabled: Boolean(matchId),
    });
}
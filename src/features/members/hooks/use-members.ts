import { useQuery } from "@tanstack/react-query";
import { membersApi } from "../api/members-api";

export function useMembers(tournamentId?: string) {
    return useQuery({
        queryKey: ["tournaments", tournamentId, "members"],
        queryFn: () => membersApi.listByTournament(tournamentId!),
        enabled: Boolean(tournamentId),
    });
}

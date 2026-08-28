import { useMutation, useQueryClient } from "@tanstack/react-query";
import { teamsApi } from "../api/teams-api";
import type { CreateTeamPayload } from "../types";

export function useCreateTeam(tournamentId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateTeamPayload) =>
            teamsApi.create(tournamentId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["tournaments", tournamentId, "teams"],
            });
        },
    });
}
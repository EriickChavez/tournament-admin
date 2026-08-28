import { useMutation, useQueryClient } from "@tanstack/react-query";
import { teamsApi } from "../api/teams-api";
import type { UpdateTeamPayload } from "../types";

export function useUpdateTeam(tournamentId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: UpdateTeamPayload }) =>
            teamsApi.update(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["tournaments", tournamentId, "teams"],
            });
        },
    });
}
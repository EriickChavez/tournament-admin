import { useMutation, useQueryClient } from "@tanstack/react-query";
import { matchesApi } from "../api/matches-api";
import type { UpdateMatchPayload } from "../types";

export function useUpdateMatch(tournamentId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            payload,
        }: {
            id: string;
            payload: UpdateMatchPayload;
        }) => matchesApi.update(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["tournaments", tournamentId, "matches"],
            });
        },
    });
}
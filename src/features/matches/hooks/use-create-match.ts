import { useMutation, useQueryClient } from "@tanstack/react-query";
import { matchesApi } from "../api/matches-api";
import type { CreateMatchPayload } from "../types";

export function useCreateMatch(tournamentId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateMatchPayload) =>
            matchesApi.create(tournamentId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["tournaments", tournamentId, "matches"],
            });
        },
    });
}
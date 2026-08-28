import { useMutation, useQueryClient } from "@tanstack/react-query";
import { playersApi } from "../api/players-api";
import type { CreatePlayerPayload } from "../types";

export function useCreatePlayer(tournamentId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreatePlayerPayload) =>
            playersApi.create(tournamentId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["tournaments", tournamentId, "players"],
            });
        },
    });
}
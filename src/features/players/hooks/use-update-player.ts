import { useMutation, useQueryClient } from "@tanstack/react-query";
import { playersApi } from "../api/players-api";
import type { UpdatePlayerPayload } from "../types";

export function useUpdatePlayer(tournamentId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            payload,
        }: {
            id: string;
            payload: UpdatePlayerPayload;
        }) => playersApi.update(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["tournaments", tournamentId, "players"],
            });
        },
    });
}
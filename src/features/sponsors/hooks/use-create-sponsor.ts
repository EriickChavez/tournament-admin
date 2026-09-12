import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sponsorsApi } from "../api/sponsors-api";
import type { CreateSponsorPayload } from "../types";

export function useCreateSponsor(tournamentId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateSponsorPayload) =>
            sponsorsApi.create(tournamentId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["tournaments", tournamentId, "sponsors"],
            });
        },
    });
}
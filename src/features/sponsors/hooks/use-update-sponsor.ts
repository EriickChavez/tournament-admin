import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sponsorsApi } from "../api/sponsors-api";
import type { UpdateSponsorPayload } from "../types";

export function useUpdateSponsor(tournamentId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: UpdateSponsorPayload }) =>
            sponsorsApi.update(tournamentId, id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["tournaments", tournamentId, "sponsors"],
            });
        },
    });
}
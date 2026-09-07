import { useMutation, useQueryClient } from "@tanstack/react-query";
import { brandingApi } from "../api/branding-api";
import type { UpsertBrandingPayload } from "../types";

export function useUpsertBranding(tournamentId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: UpsertBrandingPayload) =>
            brandingApi.upsert(tournamentId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["tournaments", tournamentId, "branding"],
            });
        },
    });
}
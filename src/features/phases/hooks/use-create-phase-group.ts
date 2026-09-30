import { useMutation, useQueryClient } from "@tanstack/react-query";
import { phasesApi } from "../api/phases-api";
import type { CreatePhaseGroupPayload } from "../types";

export function useCreatePhaseGroup(phaseId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreatePhaseGroupPayload) =>
            phasesApi.createGroup(phaseId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["phases", phaseId, "groups"],
            });
        },
    });
}
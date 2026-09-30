import { useMutation, useQueryClient } from "@tanstack/react-query";
import { phasesApi } from "../api/phases-api";
import type { UpdatePhaseGroupPayload } from "../types";

export function useUpdatePhaseGroup(phaseId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            payload,
        }: {
            id: string;
            payload: UpdatePhaseGroupPayload;
        }) => phasesApi.updateGroup(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["phases", phaseId, "groups"],
            });
        },
    });
}
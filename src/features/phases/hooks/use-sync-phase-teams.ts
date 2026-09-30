import { useMutation, useQueryClient } from "@tanstack/react-query";
import { phasesApi } from "../api/phases-api";
import type { SyncPhaseTeamsPayload } from "../types";

export function useSyncPhaseTeams(phaseId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: SyncPhaseTeamsPayload) =>
            phasesApi.syncTeams(phaseId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["phases", phaseId, "teams"],
            });
        },
    });
}
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { phasesApi } from "../api/phases-api";

export function useDeletePhaseGroup(phaseId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => phasesApi.deleteGroup(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["phases", phaseId, "groups"],
            });
        },
    });
}
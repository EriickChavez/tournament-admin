import { useQuery } from "@tanstack/react-query";
import { phasesApi } from "../api/phases-api";

export function usePhaseGroups(phaseId?: string) {
    return useQuery({
        queryKey: ["phases", phaseId, "groups"],
        queryFn: () => phasesApi.listGroups(phaseId!),
        enabled: Boolean(phaseId),
    });
}
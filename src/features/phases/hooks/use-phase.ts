import { useQuery } from "@tanstack/react-query";
import { phasesApi } from "../api/phases-api";

export function usePhase(phaseId?: string) {
    return useQuery({
        queryKey: ["phases", phaseId],
        queryFn: () => phasesApi.getById(phaseId!),
        enabled: Boolean(phaseId),
    });
}
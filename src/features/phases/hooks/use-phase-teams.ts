import { useQuery } from "@tanstack/react-query";
import { phasesApi } from "../api/phases-api";

export function usePhaseTeams(phaseId?: string) {
    return useQuery({
        queryKey: ["phases", phaseId, "teams"],
        queryFn: () => phasesApi.listTeams(phaseId!),
        enabled: Boolean(phaseId),
    });
}
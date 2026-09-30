import { useQueries } from "@tanstack/react-query";
import { phasesApi } from "../../phases/api/phases-api";
import type { Match } from "../types";

/** Devuelve un Map<phaseGroupId, nombre del grupo> para los partidos recibidos. */
export function useMatchGroupNames(matches: Match[]) {
    const phaseIds = [
        ...new Set(
            matches
                .map((m) => m.phaseId)
                .filter((id): id is string => Boolean(id)),
        ),
    ];

    return useQueries({
        queries: phaseIds.map((phaseId) => ({
            // Misma key que usePhaseGroups: comparten caché con la página de fases.
            queryKey: ["phases", phaseId, "groups"],
            queryFn: () => phasesApi.listGroups(phaseId),
        })),
        combine: (results) => {
            const map = new Map<string, string>();
            for (const result of results) {
                for (const group of result.data?.groups ?? []) {
                    map.set(group.id, group.name);
                }
            }
            return map;
        },
    });
}
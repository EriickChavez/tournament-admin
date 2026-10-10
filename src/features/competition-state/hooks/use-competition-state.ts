import { useQuery } from "@tanstack/react-query";
import { competitionStateApi } from "../api/competition-state-api";

export function useCompetitionState(tournamentId: string | undefined) {
    return useQuery({
        // Cuelga de ["tournaments", id, "matches"] a propósito: el estado depende de los
        // partidos, y esa clave ya se invalida al guardar resultados, programar o borrar partidos.
        queryKey: ["tournaments", tournamentId, "matches", "competition-state"],
        queryFn: () => competitionStateApi.get(tournamentId!),
        enabled: Boolean(tournamentId),
    });
}
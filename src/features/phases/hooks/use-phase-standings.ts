import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { phasesApi } from "../api/phases-api";

export function usePhaseStandings(
    tournamentId: string | undefined,
    phaseId: string | undefined,
    perGroup: number,
    bestNext: number,
) {
    return useQuery({
        // La clave cuelga de ["tournaments", id, "matches"] a propósito: las posiciones se
        // calculan con los partidos, así que al guardar resultados esa clave ya se invalida
        // y las tablas se refrescan solas sin tocar el panel de resultados.
        queryKey: [
            "tournaments",
            tournamentId,
            "matches",
            "standings",
            phaseId,
            perGroup,
            bestNext,
        ],
        queryFn: () => phasesApi.getStandings(phaseId!, { perGroup, bestNext }),
        enabled: Boolean(tournamentId && phaseId),
        // Mientras cambias los números no parpadea la pantalla.
        placeholderData: keepPreviousData,
    });
}
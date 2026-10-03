import { useQuery } from "@tanstack/react-query";
import { bracketsApi } from "../api/brackets-api";

export function useBracket(
    tournamentId: string | undefined,
    phaseId: string | undefined,
) {
    return useQuery({
        // Cuelga de ["tournaments", id, "matches"] a propósito: la llave cambia cuando cambian
        // los partidos (el ganador avanza), y esa clave ya se invalida al guardar resultados.
        queryKey: ["tournaments", tournamentId, "matches", "bracket", phaseId],
        queryFn: () => bracketsApi.get(phaseId!),
        enabled: Boolean(tournamentId && phaseId),
    });
}
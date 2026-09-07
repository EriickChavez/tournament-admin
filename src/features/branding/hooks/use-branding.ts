import { useQuery } from "@tanstack/react-query";
import { brandingApi } from "../api/branding-api";
import { ApiError } from "../../../shared/types/api-error";

export function useBranding(tournamentId?: string) {
    return useQuery({
        queryKey: ["tournaments", tournamentId, "branding"],
        queryFn: () => brandingApi.getByTournament(tournamentId!),
        enabled: Boolean(tournamentId),
        retry: (failureCount, error) => {
            // Un torneo sin branding aún responde 404: no es un error real, no reintentar.
            if (error instanceof ApiError && error.code === "BRANDING_NOT_FOUND") {
                return false;
            }
            return failureCount < 2;
        },
    });
}
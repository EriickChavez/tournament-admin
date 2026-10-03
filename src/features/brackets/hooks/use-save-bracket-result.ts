import { useMutation, useQueryClient } from "@tanstack/react-query";
import { matchesApi } from "../../matches/api/matches-api";
import type { UpdateMatchPayload } from "../../matches/types";

export function useSaveBracketResult(tournamentId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            matchId,
            payload,
        }: {
            matchId: string;
            payload: UpdateMatchPayload;
        }) => matchesApi.update(matchId, payload),
        onSuccess: () => {
            // El backend hace avanzar al ganador: se refresca toda la llave.
            queryClient.invalidateQueries({
                queryKey: ["tournaments", tournamentId, "matches"],
            });
        },
    });
}
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bracketsApi } from "../api/brackets-api";
import type { GenerateBracketPayload } from "../types";

export function useGenerateBracket(tournamentId: string, phaseId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: GenerateBracketPayload) =>
            bracketsApi.generate(phaseId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["tournaments", tournamentId, "matches"],
            });
        },
    });
}
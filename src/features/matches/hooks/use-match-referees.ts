import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { matchesApi } from "../api/matches-api";

export function useMatchReferees(matchId?: string) {
    return useQuery({
        queryKey: ["matches", matchId, "referees"],
        queryFn: () => matchesApi.getReferees(matchId!),
        enabled: Boolean(matchId),
        staleTime: 30_000,
    });
}

export function useSetMatchReferees(matchId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userIds: string[]) => matchesApi.setReferees(matchId, userIds),
        // La respuesta trae el conjunto final: se guarda directo, sin volver a pedirlo.
        onSuccess: (data) => {
            queryClient.setQueryData(["matches", matchId, "referees"], data);
        },
    });
}
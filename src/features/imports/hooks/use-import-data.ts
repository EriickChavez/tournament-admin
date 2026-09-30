import { useMutation, useQueryClient } from "@tanstack/react-query";
import { importsApi } from "../api/imports-api";

export function useImportData(tournamentId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ file, dryRun }: { file: File; dryRun: boolean }) =>
            importsApi.upload(tournamentId, file, dryRun),
        onSuccess: (result) => {
            // La simulación no escribe nada, así que no hay nada que refrescar.
            if (result.dryRun) return;
            queryClient.invalidateQueries({
                queryKey: ["tournaments", tournamentId, "teams"],
            });
            queryClient.invalidateQueries({
                queryKey: ["tournaments", tournamentId, "players"],
            });
        },
    });
}
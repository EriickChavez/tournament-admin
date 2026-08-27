import { useMutation } from "@tanstack/react-query";
import { tournamentsApi } from "../api/tournaments-api";

export function useDeleteTournament() {
    return useMutation({ mutationFn: tournamentsApi.delete });
}
import { useQuery } from "@tanstack/react-query";
import { categoriesApi } from "../api/categories-api";

export function useCategories(tournamentId?: string) {
  return useQuery({
    queryKey: ["tournaments", tournamentId, "categories"],
    queryFn: () => categoriesApi.listByTournament(tournamentId!),
    enabled: Boolean(tournamentId),
  });
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesApi } from "../api/categories-api";
import type { CreateCategoryPayload } from "../types";

export function useCreateCategory(tournamentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCategoryPayload) =>
      categoriesApi.create(tournamentId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tournaments", tournamentId, "categories"],
      });
    },
  });
}

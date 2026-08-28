import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesApi } from "../api/categories-api";
import type { UpdateCategoryPayload } from "../types";

export function useUpdateCategory(tournamentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateCategoryPayload;
    }) => categoriesApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tournaments", tournamentId, "categories"],
      });
    },
  });
}

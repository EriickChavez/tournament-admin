import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesApi } from "../api/categories-api";

export function useDeleteCategory(tournamentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoriesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tournaments", tournamentId, "categories"],
      });
    },
  });
}

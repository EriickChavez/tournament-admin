import { httpClient } from "../../../shared/api/http-client";
import type { Category, CreateCategoryPayload, UpdateCategoryPayload } from "../types";

export const categoriesApi = {
  listByTournament: (tournamentId: string) =>
    httpClient.get<{ categories: Category[] }>(`/tournaments/${tournamentId}/categories`),

  create: (tournamentId: string, payload: CreateCategoryPayload) =>
    httpClient.post<{ category: Category }>(`/tournaments/${tournamentId}/categories`, payload),

  update: (id: string, payload: UpdateCategoryPayload) =>
    httpClient.patch<{ category: Category }>(`/categories/${id}`, payload),

  delete: (id: string) =>
    httpClient.delete<{ message: string }>(`/categories/${id}`),
};

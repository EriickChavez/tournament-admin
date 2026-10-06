import { httpClient } from "../../../shared/api/http-client";
import type { CategoryClosure } from "../types";

export const categoryClosuresApi = {
    // Qué categorías del torneo tienen el campeonato cerrado.
    list: (tournamentId: string) =>
        httpClient.get<{ closures: CategoryClosure[] }>(
            `/tournaments/${tournamentId}/category-closures`,
        ),

    close: (tournamentId: string, categoryId: string) =>
        httpClient.post<{ closure: CategoryClosure }>(
            `/tournaments/${tournamentId}/categories/${categoryId}/close`,
            {},
        ),

    reopen: (tournamentId: string, categoryId: string) =>
        httpClient.post<{ message: string }>(
            `/tournaments/${tournamentId}/categories/${categoryId}/reopen`,
            {},
        ),
};
import { useCompetitionState } from "./use-competition-state";
import type { CategoryState } from "../types";

/**
 * Qué categorías todavía aceptan cambios de plantilla (equipos y jugadores).
 * Mientras carga se asume que todo está abierto: el backend es quien decide de verdad.
 */
export function useCategoryLocks(tournamentId: string | undefined) {
    const { data } = useCompetitionState(tournamentId);
    const stateById = new Map(
        (data?.categories ?? []).map((c) => [c.categoryId, c.state] as const),
    );

    const stateOf = (categoryId: string): CategoryState =>
        stateById.get(categoryId) ?? "not_started";

    return {
        stateOf,
        /** Se pueden agregar, mover o eliminar equipos y jugadores. */
        isOpen: (categoryId: string) => stateOf(categoryId) === "not_started",
    };
}
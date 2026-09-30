import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesApi } from "../../categories/api/categories-api";
import { phasesApi } from "../../phases/api/phases-api";
import type { PhaseGroup } from "../../phases/types";

export interface ApplyPhaseFormatResult {
    appliedTo: string[];
    skipped: Array<{ categoryId: string; reason: string }>;
    createdPhases: number;
    createdGroups: number;
}

/**
 * Copia fases (y grupos) de una categoría plantilla al resto del torneo.
 * No copia equipos.
 * Por defecto solo categorías que aún no tienen fases.
 */
export function useApplyPhaseFormat(
    tournamentId: string,
    sourceCategoryId: string,
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (options?: {
            force?: boolean;
        }): Promise<ApplyPhaseFormatResult> => {
            const force = options?.force ?? false;

            const [{ categories }, { phases: sourcePhases }] = await Promise.all([
                categoriesApi.listByTournament(tournamentId),
                phasesApi.listByCategory(tournamentId, sourceCategoryId),
            ]);

            if (sourcePhases.length === 0) {
                throw new Error("EMPTY_SOURCE");
            }

            const sourceGroupsByPhaseId = new Map<string, PhaseGroup[]>();
            await Promise.all(
                sourcePhases.map(async (phase) => {
                    if (phase.type !== "group") {
                        sourceGroupsByPhaseId.set(phase.id, []);
                        return;
                    }
                    const { groups } = await phasesApi.listGroups(phase.id);
                    sourceGroupsByPhaseId.set(phase.id, groups);
                }),
            );

            const targets = categories.filter((c) => c.id !== sourceCategoryId);
            const result: ApplyPhaseFormatResult = {
                appliedTo: [],
                skipped: [],
                createdPhases: 0,
                createdGroups: 0,
            };

            for (const category of targets) {
                const { phases: existing } = await phasesApi.listByCategory(
                    tournamentId,
                    category.id,
                );

                if (existing.length > 0 && !force) {
                    result.skipped.push({
                        categoryId: category.id,
                        reason: "Ya tiene fases",
                    });
                    continue;
                }

                for (const source of sourcePhases) {
                    const { phase: created } = await phasesApi.create(
                        tournamentId,
                        category.id,
                        {
                            name: source.name,
                            type: source.type,
                            status: source.status,
                            sortOrder: source.sortOrder,
                            startDate: source.startDate,
                            endDate: source.endDate,
                        },
                    );
                    result.createdPhases += 1;

                    const groups = sourceGroupsByPhaseId.get(source.id) ?? [];
                    for (const g of groups) {
                        await phasesApi.createGroup(created.id, {
                            name: g.name,
                            sortOrder: g.sortOrder,
                        });
                        result.createdGroups += 1;
                    }
                }

                result.appliedTo.push(category.id);
            }

            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["tournaments", tournamentId],
            });
        },
    });
}
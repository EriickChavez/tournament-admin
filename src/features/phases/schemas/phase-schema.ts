import { z } from 'zod'

export const phaseTypeValues = ["group", "knockout", "league"] as const;
export const phaseStatusValues = ["upcoming", "active", "finished"] as const;

export const phaseFormSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(1, "El nombre es requerido")
            .max(200, "Máximo 200 caracteres"),
        type: z.enum(phaseTypeValues, {
            message: "Selecciona un tipo de fase",
        }),
        status: z.enum(phaseStatusValues),
        sortOrder: z
            .string()
            .optional()
            .transform((val) =>
                val === "" || val === undefined ? undefined : Number(val),
            )
            .pipe(z.number().int().optional()),
        startDate: z
            .string()
            .optional()
            .transform((val) => (val === "" || val === undefined ? null : val)),
        endDate: z
            .string()
            .optional()
            .transform((val) => (val === "" || val === undefined ? null : val)),
    })
    .refine(
        (data) => {
            if (data.startDate && data.endDate) {
                return data.endDate >= data.startDate;
            }
            return true;
        },
        {
            message: "La fecha de fin debe ser mayor o igual a la de inicio",
            path: ["endDate"],
        },
    );

export type PhaseFormValues = z.input<typeof phaseFormSchema>;
export type PhaseFormOutput = z.output<typeof phaseFormSchema>;

export const phaseGroupFormSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "El nombre es requerido")
        .max(100, "Máximo 100 caracteres"),
    sortOrder: z
        .string()
        .optional()
        .transform((val) =>
            val === "" || val === undefined ? undefined : Number(val),
        )
        .pipe(z.number().int().optional()),
});

export type PhaseGroupFormValues = z.input<typeof phaseGroupFormSchema>;
export type PhaseGroupFormOutput = z.output<typeof phaseGroupFormSchema>;
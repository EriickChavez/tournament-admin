import { z } from "zod";

export const matchStatusValues = [
    "scheduled",
    "in_progress",
    "finished",
    "cancelled",
    "postponed",
] as const;

export const matchFormSchema = z
    .object({
        categoryId: z
            .string()
            .min(1, "Selecciona una categoría")
            .uuid("Selecciona una categoría"),
        homeTeamId: z
            .string()
            .min(1, "Selecciona el equipo local")
            .uuid("Selecciona el equipo local"),
        awayTeamId: z
            .string()
            .min(1, "Selecciona el equipo visitante")
            .uuid("Selecciona el equipo visitante"),
        scheduledAt: z.string().min(1, "La fecha y hora son obligatorias"),
        venue: z
            .string()
            .max(200, "Máximo 200 caracteres")
            .optional()
            .transform((val) => (val === "" || val === undefined ? undefined : val)),
        status: z.enum(matchStatusValues),
    })
    .refine((data) => data.homeTeamId !== data.awayTeamId, {
        message: "El equipo local y visitante deben ser diferentes",
        path: ["awayTeamId"],
    });

export type MatchFormValues = z.input<typeof matchFormSchema>;
export type MatchFormOutput = z.output<typeof matchFormSchema>;
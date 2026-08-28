import { z } from "zod";

export const playerFormSchema = z.object({
    categoryId: z
        .string()
        .min(1, "Selecciona una categoría")
        .uuid("Selecciona una categoría"),
    teamId: z
        .string()
        .min(1, "Selecciona un equipo")
        .uuid("Selecciona un equipo"),
    firstName: z
        .string()
        .min(1, "El nombre es obligatorio")
        .max(120, "Máximo 120 caracteres"),
    lastName: z
        .string()
        .min(1, "El apellido es obligatorio")
        .max(120, "Máximo 120 caracteres"),
    birthDate: z
        .string()
        .optional()
        .transform((val) => (val === "" || val === undefined ? undefined : val))
        .refine(
            (val) => val === undefined || /^\d{4}-\d{2}-\d{2}$/.test(val),
            "Fecha debe ser YYYY-MM-DD",
        ),
    number: z
        .string()
        .min(1, "El número es obligatorio")
        .transform((val) => Number(val))
        .pipe(
            z
                .number()
                .int("Debe ser un número entero")
                .min(0, "Mínimo 0")
                .max(999, "Máximo 999"),
        ),
    isCaptain: z.boolean().optional().default(false),
    role: z
        .string()
        .max(50, "Máximo 50 caracteres")
        .optional()
        .transform((val) => (val === "" || val === undefined ? undefined : val)),
});

export type PlayerFormValues = z.input<typeof playerFormSchema>;
export type PlayerFormOutput = z.output<typeof playerFormSchema>;

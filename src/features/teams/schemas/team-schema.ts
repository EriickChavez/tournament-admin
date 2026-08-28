import { z } from "zod";

export const teamFormSchema = z.object({
    categoryId: z.string().min(1, "Selecciona una categoría").uuid("Selecciona una categoría"),
    name: z
        .string()
        .min(1, "El nombre es obligatorio")
        .max(200, "Máximo 200 caracteres"),
    abbreviation: z
        .string()
        .max(50, "Máximo 50 caracteres")
        .optional()
        .transform((val) => (val === "" || val === undefined ? undefined : val)),
    logoUrl: z
        .string()
        .max(500, "Máximo 500 caracteres")
        .optional()
        .transform((val) => (val === "" || val === undefined ? undefined : val))
        .refine(
            (val) => val === undefined || /^https?:\/\/.+/i.test(val),
            "Debe ser una URL válida (http/https)",
        ),
});

export type TeamFormValues = z.input<typeof teamFormSchema>;
export type TeamFormOutput = z.output<typeof teamFormSchema>;
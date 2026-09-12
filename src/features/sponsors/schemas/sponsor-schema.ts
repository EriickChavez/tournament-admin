import { z } from "zod";

export const sponsorFormSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "El nombre es requerido")
        .max(200, "Máximo 200 caracteres"),
    description: z
        .string()
        .trim()
        .min(1, "La descripción es requerida")
        .max(500, "Máximo 500 caracteres"),
    websiteUrl: z
        .string()
        .trim()
        .max(512)
        .optional()
        .refine((val) => !val || /^https?:\/\/.+/.test(val), {
            message: "Debe ser una URL válida (http:// o https://)",
        }),
    order: z
        .string()
        .optional()
        .transform((val) => (val === "" || val === undefined ? 0 : Number(val)))
        .pipe(z.number().int("Debe ser un número entero")),
    isActive: z.boolean(),
});

export type SponsorFormValues = z.input<typeof sponsorFormSchema>;
export type SponsorFormOutput = z.output<typeof sponsorFormSchema>;
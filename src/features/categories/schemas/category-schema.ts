import { z } from "zod";

export const categoryFormSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "El título es requerido")
      .max(200, "Máximo 200 caracteres"),
    minAge: z
      .string()
      .optional()
      .transform((val) => (val === "" || val === undefined ? null : Number(val)))
      .pipe(
        z
          .number()
          .int("Debe ser un número entero")
          .min(0, "La edad mínima no puede ser menor a 0")
          .max(120, "La edad mínima no puede ser mayor a 120")
          .nullable()
      ),
    maxAge: z
      .string()
      .optional()
      .transform((val) => (val === "" || val === undefined ? null : Number(val)))
      .pipe(
        z
          .number()
          .int("Debe ser un número entero")
          .min(0, "La edad máxima no puede ser menor a 0")
          .max(120, "La edad máxima no puede ser mayor a 120")
          .nullable()
      ),
    description: z
      .string()
      .max(2000, "Máximo 2000 caracteres")
      .optional()
      .transform((val) => (val === "" || val === undefined ? null : val)),
    order: z
      .string()
      .optional()
      .transform((val) => (val === "" || val === undefined ? 0 : Number(val)))
      .pipe(z.number().int("Debe ser un número entero")),
  })
  .refine(
    (data) => {
      if (data.minAge !== null && data.maxAge !== null) {
        return data.maxAge >= data.minAge;
      }
      return true;
    },
    {
      message: "La edad máxima debe ser mayor o igual a la edad mínima",
      path: ["maxAge"],
    }
  );

export type CategoryFormValues = z.input<typeof categoryFormSchema>;
export type CategoryFormOutput = z.output<typeof categoryFormSchema>;

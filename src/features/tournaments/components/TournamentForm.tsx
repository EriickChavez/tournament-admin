import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  editTournamentSchema,
  type EditTournamentFormValues,
} from "../schemas/create-tournament-schema";

interface TournamentFormProps {
  defaultValues?: Partial<EditTournamentFormValues>;
  onSubmit: (values: EditTournamentFormValues, changedName: boolean) => void;
  submitting: boolean;
  submitLabel: string;
  generalError?: string | null;
  fieldErrors?: Partial<Record<"name" | "subtitle" | "description", string>>;
  isEdit?: boolean;
}

export function TournamentForm({
  defaultValues,
  onSubmit,
  submitting,
  submitLabel,
  generalError,
  fieldErrors,
  isEdit,
}: TournamentFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<EditTournamentFormValues>({
    resolver: zodResolver(editTournamentSchema),
    defaultValues,
  });

  if (fieldErrors) {
    Object.entries(fieldErrors).forEach(([field, message]) => {
      if (message)
        setError(field as "name" | "subtitle" | "description", { message });
    });
  }

  const name = watch("name");
  const nameChanged =
    isEdit && defaultValues?.name !== undefined && name !== defaultValues.name;

  function handleFormSubmit(values: EditTournamentFormValues) {
    onSubmit(values, nameChanged ?? false);
  }

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="w-full max-w-lg flex flex-col gap-4 p-4"
    >
      <div>
        <label htmlFor="name" className="block text-sm mb-1">
          Nombre del torneo
        </label>
        <input
          id="name"
          className="w-full min-h-11 px-3 border rounded"
          {...register("name")}
        />
        {nameChanged && (
          <p className="text-sm text-amber-600 mt-1">
            ⚠ Cambiar el nombre generará una nueva URL pública; los enlaces
            anteriores dejarán de funcionar.
          </p>
        )}
        {errors.name && (
          <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="subtitle" className="block text-sm mb-1">
          Subtítulo (opcional)
        </label>
        <input
          id="subtitle"
          className="w-full min-h-11 px-3 border rounded"
          {...register("subtitle")}
        />
        {errors.subtitle && (
          <p className="text-sm text-red-600 mt-1">{errors.subtitle.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm mb-1">
          Descripción (opcional)
        </label>
        <textarea
          id="description"
          rows={4}
          className="w-full px-3 py-2 border rounded"
          {...register("description")}
        />
        {errors.description && (
          <p className="text-sm text-red-600 mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      {generalError && <p className="text-sm text-red-600">{generalError}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="min-h-11 rounded bg-gray-900 text-white disabled:opacity-50"
      >
        {submitting ? "Guardando..." : submitLabel}
      </button>
    </form>
  );
}

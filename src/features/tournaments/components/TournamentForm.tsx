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

  const inputClass =
    "w-full min-h-11 px-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors";

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="w-full max-w-lg flex flex-col gap-5"
    >
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
          Nombre del torneo
        </label>
        <input
          id="name"
          className={inputClass}
          {...register("name")}
        />
        {nameChanged && (
          <div className="mt-2 rounded-xl bg-amber-50 border border-amber-100 px-3 py-2">
            <p className="text-xs text-amber-700">
              ⚠ Cambiar el nombre generará una nueva URL pública; los enlaces
              anteriores dejarán de funcionar.
            </p>
          </div>
        )}
        {errors.name && (
          <p className="text-xs text-red-500 mt-1.5">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 mb-1.5">
          Subtítulo <span className="text-gray-400 font-normal">(opcional)</span>
        </label>
        <input
          id="subtitle"
          className={inputClass}
          {...register("subtitle")}
        />
        {errors.subtitle && (
          <p className="text-xs text-red-500 mt-1.5">{errors.subtitle.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
          Descripción <span className="text-gray-400 font-normal">(opcional)</span>
        </label>
        <textarea
          id="description"
          rows={4}
          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
          {...register("description")}
        />
        {errors.description && (
          <p className="text-xs text-red-500 mt-1.5">
            {errors.description.message}
          </p>
        )}
      </div>

      {generalError && (
        <div className="rounded-xl bg-red-50 border border-red-100 px-3 py-2.5">
          <p className="text-sm text-red-600">{generalError}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="min-h-11 rounded-xl bg-primary text-white text-sm font-medium disabled:opacity-50 hover:opacity-90 transition-opacity"
      >
        {submitting ? "Guardando..." : submitLabel}
      </button>
    </form>
  );
}

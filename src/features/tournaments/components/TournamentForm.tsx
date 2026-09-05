import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  editTournamentSchema,
  type EditTournamentFormValues,
} from "../schemas/create-tournament-schema";

interface TournamentFormProps {
  defaultValues?: Partial<EditTournamentFormValues>;
  onSubmit: (values: EditTournamentFormValues, changedName: boolean) => void;
  onCancel?: () => void;
  submitting: boolean;
  submitLabel: string;
  generalError?: string | null;
  fieldErrors?: Partial<
    Record<
      | "name"
      | "subtitle"
      | "description"
      | "startDate"
      | "endDate"
      | "timezone",
      string
    >
  >;
  isEdit?: boolean;
}

export function TournamentForm({
  defaultValues,
  onSubmit,
  onCancel,
  submitting,
  submitLabel,
  generalError,
  fieldErrors,
  isEdit,
}: TournamentFormProps) {
  const autoTimezone =
    Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Mexico_City";

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<EditTournamentFormValues>({
    resolver: zodResolver(editTournamentSchema),
    defaultValues: {
      timezone: autoTimezone,
      ...defaultValues,
    },
  });

  if (fieldErrors) {
    Object.entries(fieldErrors).forEach(([field, message]) => {
      if (message)
        setError(
          field as
            | "name"
            | "subtitle"
            | "description"
            | "startDate"
            | "endDate"
            | "timezone",
          { message },
        );
    });
  }

  const name = watch("name");
  const nameChanged =
    isEdit && defaultValues?.name !== undefined && name !== defaultValues.name;

  function handleFormSubmit(values: EditTournamentFormValues) {
    onSubmit(
      {
        ...values,
        timezone: values.timezone || autoTimezone,
      },
      nameChanged ?? false,
    );
  }

  const inputClass =
    "w-full h-12 px-4 border border-gray-200/80 rounded-xl text-sm text-gray-900 bg-white placeholder:text-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all";

  const labelClass = "block text-[13px] font-medium text-gray-600 mb-2";
  const optionalClass = "text-gray-400 font-normal";
  const errorClass = "text-xs text-red-500 mt-2";

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="w-full flex flex-col gap-8"
    >
      {/* Información general */}
      <section className="rounded-2xl border border-gray-200/70 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <header className="px-6 pt-6 pb-5 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">
            Información general
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Datos básicos que verán los participantes
          </p>
        </header>

        <div className="px-6 py-6 space-y-6">
          <div>
            <label htmlFor="name" className={labelClass}>
              Nombre del torneo
            </label>
            <input
              id="name"
              className={inputClass}
              placeholder="Ej. Liga Municipal 2026"
              {...register("name")}
            />
            {nameChanged && (
              <div className="mt-3 rounded-xl bg-amber-50 border border-amber-100/80 px-4 py-3">
                <p className="text-xs text-amber-700 leading-relaxed">
                  ⚠ Cambiar el nombre generará una nueva URL pública; los
                  enlaces anteriores dejarán de funcionar.
                </p>
              </div>
            )}
            {errors.name && <p className={errorClass}>{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="subtitle" className={labelClass}>
              Subtítulo <span className={optionalClass}>(opcional)</span>
            </label>
            <input
              id="subtitle"
              className={inputClass}
              placeholder="Ej. Temporada de primavera"
              {...register("subtitle")}
            />
            {errors.subtitle && (
              <p className={errorClass}>{errors.subtitle.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className={labelClass}>
              Descripción <span className={optionalClass}>(opcional)</span>
            </label>
            <textarea
              id="description"
              rows={4}
              className="w-full px-4 py-3 border border-gray-200/80 rounded-xl text-sm text-gray-900 bg-white placeholder:text-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none leading-relaxed"
              placeholder="Cuéntales de qué se trata el torneo..."
              {...register("description")}
            />
            {errors.description && (
              <p className={errorClass}>{errors.description.message}</p>
            )}
          </div>
        </div>
      </section>

      {/* Fechas y ubicación */}
      <section className="rounded-2xl border border-gray-200/70 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <header className="px-6 pt-6 pb-5 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">
            Fechas y ubicación
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Cuándo se juega y en qué zona horaria
          </p>
        </header>

        <div className="px-6 py-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="startDate" className={labelClass}>
                Fecha de inicio{" "}
                <span className={optionalClass}>(opcional)</span>
              </label>
              <input
                id="startDate"
                type="date"
                className={inputClass}
                min={new Date().toISOString().split("T")[0]}
                {...register("startDate")}
              />
              {errors.startDate && (
                <p className={errorClass}>{errors.startDate.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="endDate" className={labelClass}>
                Fecha de fin <span className={optionalClass}>(opcional)</span>
              </label>
              <input
                id="endDate"
                type="date"
                className={inputClass}
                min={new Date().toISOString().split("T")[0]}
                {...register("endDate")}
              />
              {errors.endDate && (
                <p className={errorClass}>{errors.endDate.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="timezone" className={labelClass}>
              Zona horaria
            </label>
            <div className="relative">
              <input
                id="timezone"
                type="text"
                readOnly
                className={`${inputClass} bg-gray-50 text-gray-600 cursor-not-allowed pr-28`}
                {...register("timezone")}
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg">
                Automática
              </span>
            </div>
            {errors.timezone && (
              <p className={errorClass}>{errors.timezone.message}</p>
            )}
          </div>
        </div>
      </section>

      {generalError && (
        <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3.5">
          <p className="text-sm text-red-600">{generalError}</p>
        </div>
      )}

      {/* Acciones */}
      <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 pt-2 pb-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="h-11 px-5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="h-11 px-7 rounded-xl bg-primary text-white text-sm font-medium shadow-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {submitting ? "Guardando..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  phaseFormSchema,
  type PhaseFormValues,
  type PhaseFormOutput,
} from "../schemas/phase-schema";
import type { Phase } from "../types";
import { PHASE_STATUS_LABELS, PHASE_TYPE_LABELS } from "../types";

const CloseIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

interface PhaseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: PhaseFormOutput) => void;
  phase?: Phase | null;
  isSubmitting: boolean;
  errorMessage?: string | null;
}

export function PhaseFormModal({
  isOpen,
  onClose,
  onSubmit,
  phase,
  isSubmitting,
  errorMessage,
}: PhaseFormModalProps) {
  const isEdit = Boolean(phase);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PhaseFormValues, unknown, PhaseFormOutput>({
    resolver: zodResolver(phaseFormSchema),
    defaultValues: {
      name: "",
      type: "group",
      status: "upcoming",
      sortOrder: "0",
      startDate: "",
      endDate: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (phase) {
        reset({
          name: phase.name,
          type: phase.type,
          status: phase.status,
          sortOrder: String(phase.sortOrder ?? 0),
          startDate: phase.startDate ?? "",
          endDate: phase.endDate ?? "",
        });
      } else {
        reset({
          name: "",
          type: "group",
          status: "upcoming",
          sortOrder: "0",
          startDate: "",
          endDate: "",
        });
      }
    }
  }, [isOpen, phase, reset]);

  if (!isOpen) return null;

  const inputClass =
    "w-full min-h-11 px-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between border-b border-gray-100 pb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEdit ? "Editar fase" : "Nueva fase"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"
          >
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              {...register("name")}
              className={inputClass}
              placeholder="Ej. Fase de grupos"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Tipo
              </label>
              <select {...register("type")} className={inputClass}>
                {(
                  Object.keys(PHASE_TYPE_LABELS) as Array<
                    keyof typeof PHASE_TYPE_LABELS
                  >
                ).map((key) => (
                  <option key={key} value={key}>
                    {PHASE_TYPE_LABELS[key]}
                  </option>
                ))}
              </select>
              {errors.type && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.type.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Estado
              </label>
              <select {...register("status")} className={inputClass}>
                {(
                  Object.keys(PHASE_STATUS_LABELS) as Array<
                    keyof typeof PHASE_STATUS_LABELS
                  >
                ).map((key) => (
                  <option key={key} value={key}>
                    {PHASE_STATUS_LABELS[key]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Orden
            </label>
            <input
              type="number"
              {...register("sortOrder")}
              className={inputClass}
              placeholder="0"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Inicio
              </label>
              <input
                type="date"
                {...register("startDate")}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Fin
              </label>
              <input
                type="date"
                {...register("endDate")}
                className={inputClass}
              />
              {errors.endDate && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.endDate.message}
                </p>
              )}
            </div>
          </div>

          {errorMessage && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="min-h-11 rounded-xl border border-gray-200 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="min-h-11 rounded-xl bg-primary px-4 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
            >
              {isSubmitting
                ? "Guardando..."
                : isEdit
                  ? "Guardar cambios"
                  : "Crear fase"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

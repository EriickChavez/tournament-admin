import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  matchFormSchema,
  type MatchFormValues,
  type MatchFormOutput,
} from "../schemas/match-schema";
import { isoToDatetimeLocal } from "../utils/datetime";
import type { Match } from "../types";
import type { Category } from "../../categories/types";
import type { Team } from "../../teams/types";

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

const STATUS_OPTIONS: { value: Match["status"]; label: string }[] = [
  { value: "scheduled", label: "Programado" },
  { value: "in_progress", label: "En curso" },
  { value: "finished", label: "Finalizado" },
  { value: "cancelled", label: "Cancelado" },
  { value: "postponed", label: "Pospuesto" },
];

interface MatchFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: MatchFormOutput) => void;
  match?: Match | null;
  categories: Category[];
  teams: Team[];
  isSubmitting: boolean;
  errorMessage?: string | null;
}

export function MatchFormModal({
  isOpen,
  onClose,
  onSubmit,
  match,
  categories,
  teams,
  isSubmitting,
  errorMessage,
}: MatchFormModalProps) {
  const isEdit = Boolean(match);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<MatchFormValues, unknown, MatchFormOutput>({
    resolver: zodResolver(matchFormSchema),
    defaultValues: {
      categoryId: "",
      homeTeamId: "",
      awayTeamId: "",
      scheduledAt: "",
      venue: "",
      status: "scheduled",
    },
  });

  const selectedCategoryId = watch("categoryId");
  const homeTeamId = watch("homeTeamId");
  const awayTeamId = watch("awayTeamId");

  const teamsInCategory = useMemo(
    () => teams.filter((t) => t.categoryId === selectedCategoryId),
    [teams, selectedCategoryId],
  );

  useEffect(() => {
    if (!isOpen) return;
    if (match) {
      reset({
        categoryId: match.categoryId,
        homeTeamId: match.homeTeamId,
        awayTeamId: match.awayTeamId,
        scheduledAt: isoToDatetimeLocal(match.scheduledAt),
        venue: match.venue ?? "",
        status: match.status,
      });
    } else {
      reset({
        categoryId: categories[0]?.id ?? "",
        homeTeamId: "",
        awayTeamId: "",
        scheduledAt: "",
        venue: "",
        status: "scheduled",
      });
    }
  }, [isOpen, match, categories, reset]);

  useEffect(() => {
    if (!isOpen) return;
    const currentHome = watch("homeTeamId");
    const currentAway = watch("awayTeamId");
    if (!teamsInCategory.some((t) => t.id === currentHome)) {
      setValue("homeTeamId", "");
    }
    if (!teamsInCategory.some((t) => t.id === currentAway)) {
      setValue("awayTeamId", "");
    }
  }, [selectedCategoryId, teamsInCategory, isOpen, setValue, watch]);

  if (!isOpen) return null;

  const inputClass =
    "w-full min-h-11 px-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors";

  const canSubmit = categories.length > 0 && teamsInCategory.length >= 2;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-base font-bold text-gray-900">
            {isEdit ? "Editar partido" : "Nuevo partido"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="px-5 py-4 flex flex-col gap-4"
        >
          {errorMessage && (
            <div className="rounded-xl bg-red-50 border border-red-100 px-3 py-2 text-sm text-red-600">
              {errorMessage}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600">
              Categoría <span className="text-red-500">*</span>
            </label>
            <select {...register("categoryId")} className={inputClass}>
              <option value="">Selecciona</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.title}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-xs text-red-500">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-600">
                Equipo local <span className="text-red-500">*</span>
              </label>
              <select
                {...register("homeTeamId")}
                className={inputClass}
                disabled={teamsInCategory.length === 0}
              >
                <option value="">Selecciona</option>
                {teamsInCategory
                  .filter((t) => t.id !== awayTeamId)
                  .map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
              </select>
              {errors.homeTeamId && (
                <p className="text-xs text-red-500">
                  {errors.homeTeamId.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-600">
                Equipo visitante <span className="text-red-500">*</span>
              </label>
              <select
                {...register("awayTeamId")}
                className={inputClass}
                disabled={teamsInCategory.length === 0}
              >
                <option value="">Selecciona</option>
                {teamsInCategory
                  .filter((t) => t.id !== homeTeamId)
                  .map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
              </select>
              {errors.awayTeamId && (
                <p className="text-xs text-red-500">
                  {errors.awayTeamId.message}
                </p>
              )}
            </div>
          </div>

          {selectedCategoryId && teamsInCategory.length < 2 && (
            <p className="text-xs text-amber-600 -mt-2">
              Esta categoría necesita al menos 2 equipos para programar
              partidos.
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-600">
                Fecha y hora <span className="text-red-500">*</span>
              </label>
              <input
                {...register("scheduledAt")}
                type="datetime-local"
                className={inputClass}
              />
              {errors.scheduledAt && (
                <p className="text-xs text-red-500">
                  {errors.scheduledAt.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-600">
                Estado
              </label>
              <select {...register("status")} className={inputClass}>
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600">Sede</label>
            <input
              {...register("venue")}
              className={inputClass}
              placeholder="Ej. Cancha Municipal 1"
              autoComplete="off"
            />
            {errors.venue && (
              <p className="text-xs text-red-500">{errors.venue.message}</p>
            )}
          </div>

          {!canSubmit && categories.length === 0 && (
            <p className="text-xs text-amber-600">
              Primero crea una categoría en este torneo.
            </p>
          )}

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="min-h-10 px-4 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !canSubmit}
              className="min-h-10 px-4 rounded-xl bg-primary text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {isSubmitting
                ? "Guardando..."
                : isEdit
                  ? "Guardar cambios"
                  : "Crear partido"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

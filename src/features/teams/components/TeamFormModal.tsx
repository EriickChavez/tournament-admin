import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  teamFormSchema,
  type TeamFormValues,
  type TeamFormOutput,
} from "../schemas/team-schema";
import type { Team } from "../types";
import type { Category } from "../../categories/types";

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

interface TeamFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: TeamFormOutput) => void;
  team?: Team | null;
  categories: Category[];
  isSubmitting: boolean;
  errorMessage?: string | null;
}

export function TeamFormModal({
  isOpen,
  onClose,
  onSubmit,
  team,
  categories,
  isSubmitting,
  errorMessage,
}: TeamFormModalProps) {
  const isEdit = Boolean(team);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TeamFormValues, unknown, TeamFormOutput>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: { categoryId: "", name: "", abbreviation: "", logoUrl: "" },
  });

  useEffect(() => {
    if (isOpen) {
      if (team) {
        reset({
          categoryId: team.categoryId,
          name: team.name,
          abbreviation: team.abbreviation ?? "",
          logoUrl: team.logoUrl ?? "",
        });
      } else {
        reset({
          categoryId: categories[0]?.id ?? "",
          name: "",
          abbreviation: "",
          logoUrl: "",
        });
      }
    }
  }, [isOpen, team, categories, reset]);

  if (!isOpen) return null;

  const inputClass =
    "w-full min-h-11 px-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">
            {isEdit ? "Editar equipo" : "Nuevo equipo"}
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
              <option value="">Selecciona una categoría</option>
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
            {categories.length === 0 && (
              <p className="text-xs text-amber-600">
                Primero crea al menos una categoría en este torneo.
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              {...register("name")}
              className={inputClass}
              placeholder="Ej. Águilas FC"
              autoComplete="off"
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600">Siglas</label>
            <input
              {...register("abbreviation")}
              className={inputClass}
              placeholder="Ej. AGU"
              autoComplete="off"
            />
            {errors.abbreviation && (
              <p className="text-xs text-red-500">
                {errors.abbreviation.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600">
              URL del logo
            </label>
            <input
              {...register("logoUrl")}
              className={inputClass}
              placeholder="https://..."
              autoComplete="off"
            />
            {errors.logoUrl && (
              <p className="text-xs text-red-500">{errors.logoUrl.message}</p>
            )}
          </div>
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
              disabled={isSubmitting || categories.length === 0}
              className="min-h-10 px-4 rounded-xl bg-primary text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {isSubmitting
                ? "Guardando..."
                : isEdit
                  ? "Guardar cambios"
                  : "Crear equipo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  playerFormSchema,
  type PlayerFormValues,
  type PlayerFormOutput,
} from "../schemas/player-schema";
import type { Player } from "../types";
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

interface PlayerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: PlayerFormOutput) => void;
  player?: Player | null;
  categories: Category[];
  teams: Team[];
  isSubmitting: boolean;
  errorMessage?: string | null;
}

export function PlayerFormModal({
  isOpen,
  onClose,
  onSubmit,
  player,
  categories,
  teams,
  isSubmitting,
  errorMessage,
}: PlayerFormModalProps) {
  const isEdit = Boolean(player);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    getValues,
    setValue,
    control,
    formState: { errors },
  } = useForm<PlayerFormValues, unknown, PlayerFormOutput>({
    resolver: zodResolver(playerFormSchema),
    defaultValues: {
      categoryId: "",
      teamId: "",
      firstName: "",
      lastName: "",
      birthDate: "",
      number: "",
      isCaptain: false,
      role: "",
    },
  });

  const selectedCategoryId = watch("categoryId");

  const teamsInCategory = useMemo(
    () => teams.filter((t) => t.categoryId === selectedCategoryId),
    [teams, selectedCategoryId],
  );

  useEffect(() => {
    if (!isOpen) return;
    if (player) {
      reset({
        categoryId: player.categoryId,
        teamId: player.teamId,
        firstName: player.firstName,
        lastName: player.lastName,
        birthDate: player.birthDate ?? "",
        number: player.number !== null ? String(player.number) : "",
        isCaptain: player.isCaptain,
        role: player.role ?? "",
      });
    } else {
      const firstCat = categories[0]?.id ?? "";
      const firstTeam = teams.find((t) => t.categoryId === firstCat)?.id ?? "";
      reset({
        categoryId: firstCat,
        teamId: firstTeam,
        firstName: "",
        lastName: "",
        birthDate: "",
        number: "",
        isCaptain: false,
        role: "",
      });
    }
  }, [isOpen, player, categories, teams, reset]);

  // getValues (no watch): aquí solo necesitamos leer el valor actual una vez,
  // no suscribirnos a cambios. watch() dentro de un effect puede devolver un
  // valor desactualizado y además rompe la memoización del React Compiler.
  useEffect(() => {
    if (!isOpen) return;
    const currentTeamId = getValues("teamId");
    const stillValid = teamsInCategory.some((t) => t.id === currentTeamId);
    if (!stillValid) {
      setValue("teamId", teamsInCategory[0]?.id ?? "");
    }
  }, [selectedCategoryId, teamsInCategory, isOpen, setValue, getValues]);

  if (!isOpen) return null;

  const inputClass =
    "w-full min-h-11 px-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors";

  const canSubmit = categories.length > 0 && teams.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-base font-bold text-gray-900">
            {isEdit ? "Editar jugador" : "Nuevo jugador"}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-600">
                Equipo <span className="text-red-500">*</span>
              </label>
              <select
                {...register("teamId")}
                className={inputClass}
                disabled={teamsInCategory.length === 0}
              >
                <option value="">Selecciona</option>
                {teamsInCategory.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
              {errors.teamId && (
                <p className="text-xs text-red-500">{errors.teamId.message}</p>
              )}
              {selectedCategoryId && teamsInCategory.length === 0 && (
                <p className="text-xs text-amber-600">
                  No hay equipos en esta categoría.
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-600">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                {...register("firstName")}
                className={inputClass}
                placeholder="Juan"
                autoComplete="off"
              />
              {errors.firstName && (
                <p className="text-xs text-red-500">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-600">
                Apellido <span className="text-red-500">*</span>
              </label>
              <input
                {...register("lastName")}
                className={inputClass}
                placeholder="Pérez"
                autoComplete="off"
              />
              {errors.lastName && (
                <p className="text-xs text-red-500">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-600">
                Número <span className="text-red-500">*</span>
              </label>
              <input
                {...register("number")}
                type="number"
                min={0}
                max={999}
                className={inputClass}
                placeholder="10"
              />
              {errors.number && (
                <p className="text-xs text-red-500">{errors.number.message}</p>
              )}
              <p className="text-[11px] text-gray-400">
                Único en todo el torneo
              </p>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-600">
                Fecha de nacimiento
              </label>
              <input
                {...register("birthDate")}
                type="date"
                className={inputClass}
              />
              {errors.birthDate && (
                <p className="text-xs text-red-500">
                  {errors.birthDate.message as string}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600">
              Posición / rol
            </label>
            <input
              {...register("role")}
              className={inputClass}
              placeholder="Ej. delantero, portero"
              autoComplete="off"
            />
            {errors.role && (
              <p className="text-xs text-red-500">{errors.role.message}</p>
            )}
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <Controller
              name="isCaptain"
              control={control}
              render={({ field }) => (
                <input
                  type="checkbox"
                  checked={field.value ?? false}
                  onChange={(e) => field.onChange(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20"
                />
              )}
            />
            Es capitán del equipo
          </label>

          {!canSubmit && (
            <p className="text-xs text-amber-600">
              Necesitas al menos una categoría y un equipo para crear jugadores.
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
                  : "Crear jugador"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

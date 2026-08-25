import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import {
  createTournamentSchema,
  type CreateTournamentFormValues,
} from "../schemas/create-tournament-schema";
import { useCreateTournament } from "../hooks/use-create-tournament";
import { getCreateTournamentErrorMessage } from "../utils/create-tournament-error-message";
import { ApiError } from "../../../shared/types/api-error";

export function CreateTournamentForm() {
  const navigate = useNavigate();
  const createTournament = useCreateTournament();
  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm<CreateTournamentFormValues>({
    resolver: zodResolver(createTournamentSchema),
  });

  const name = watch("name");
  const slugPreview = name
    ? name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
    : "";

  function onSubmit(values: CreateTournamentFormValues) {
    createTournament.mutate(
      {
        name: values.name,
        subtitle: values.subtitle || undefined,
        description: values.description || undefined,
      },
      {
        onSuccess: () => navigate("/home", { replace: true }),
        onError: (error) => {
          if (
            error instanceof ApiError &&
            error.code === "VALIDATION_ERROR" &&
            error.details
          ) {
            error.details.forEach((d) => {
              if (
                d.path === "name" ||
                d.path === "subtitle" ||
                d.path === "description"
              ) {
                setError(d.path, { message: d.message });
              }
            });
          }
        },
      },
    );
  }

  const generalError =
    createTournament.isError &&
    !(
      createTournament.error instanceof ApiError &&
      createTournament.error.code === "VALIDATION_ERROR"
    )
      ? getCreateTournamentErrorMessage(createTournament.error)
      : null;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
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
        {slugPreview && (
          <p className="text-xs text-gray-400 mt-1">URL: /{slugPreview}</p>
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
        disabled={createTournament.isPending}
        className="min-h-11 rounded bg-gray-900 text-white disabled:opacity-50"
      >
        {createTournament.isPending ? "Creando..." : "Crear torneo"}
      </button>
    </form>
  );
}

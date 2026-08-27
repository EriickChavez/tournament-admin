import { useNavigate } from "react-router";
import { TournamentForm } from "./TournamentForm";
import { useUpdateTournament } from "../hooks/use-update-tournament";
import { ApiError } from "../../../shared/types/api-error";
import type { Tournament } from "../types";
import type { EditTournamentFormValues } from "../schemas/create-tournament-schema";
import { getTournamentErrorMessage } from "../utils/create-tournament-error-message";

export function EditTournamentForm({ tournament }: { tournament: Tournament }) {
  const navigate = useNavigate();
  const updateTournament = useUpdateTournament(tournament.id);

  function formatDate(dateStr?: string | null): string {
    if (!dateStr) return "";
    return dateStr.split("T")[0] || "";
  }

  function handleSubmit(
    values: EditTournamentFormValues,
    changedName: boolean,
  ) {
    updateTournament.mutate(
      {
        name: changedName ? values.name : undefined,
        subtitle: values.subtitle || undefined,
        description: values.description || undefined,
        startDate: values.startDate || undefined,
        endDate: values.endDate || undefined,
        timezone: values.timezone || undefined,
      },
      {
        onSuccess: () => navigate("/home", { replace: true }),
        onError: (error) => {
          if (
            error instanceof ApiError &&
            error.code === "TOURNAMENT_NOT_FOUND"
          ) {
            navigate("/home", { replace: true });
          }
        },
      },
    );
  }

  const fieldErrors =
    updateTournament.error instanceof ApiError &&
    updateTournament.error.code === "VALIDATION_ERROR"
      ? Object.fromEntries(
          (updateTournament.error.details ?? []).map((d) => [
            d.path,
            d.message,
          ]),
        )
      : undefined;

  const generalError =
    updateTournament.isError && !fieldErrors
      ? getTournamentErrorMessage(updateTournament.error)
      : null;

  return (
    <TournamentForm
      defaultValues={{
        name: tournament.name,
        subtitle: tournament.subtitle ?? "",
        description: tournament.description ?? "",
        startDate: formatDate(tournament.startDate),
        endDate: formatDate(tournament.endDate),
        timezone: tournament.timezone,
      }}
      onSubmit={handleSubmit}
      submitting={updateTournament.isPending}
      submitLabel="Guardar cambios"
      generalError={generalError}
      fieldErrors={fieldErrors}
      isEdit
    />
  );
}

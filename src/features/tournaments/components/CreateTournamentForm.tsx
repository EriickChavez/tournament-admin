import { useNavigate } from "react-router";
import { TournamentForm } from "./TournamentForm";
import { useCreateTournament } from "../hooks/use-create-tournament";
import { ApiError } from "../../../shared/types/api-error";
import type { EditTournamentFormValues } from "../schemas/create-tournament-schema";
import { getTournamentErrorMessage } from "../utils/create-tournament-error-message";

export function CreateTournamentForm() {
  const navigate = useNavigate();
  const createTournament = useCreateTournament();

  function handleSubmit(values: EditTournamentFormValues) {
    createTournament.mutate(
      {
        name: values.name,
        subtitle: values.subtitle || undefined,
        description: values.description || undefined,
      },
      { onSuccess: () => navigate("/home", { replace: true }) },
    );
  }

  const fieldErrors =
    createTournament.error instanceof ApiError &&
    createTournament.error.code === "VALIDATION_ERROR"
      ? Object.fromEntries(
          (createTournament.error.details ?? []).map((d) => [
            d.path,
            d.message,
          ]),
        )
      : undefined;

  const generalError =
    createTournament.isError && !fieldErrors
      ? getTournamentErrorMessage(createTournament.error)
      : null;

  return (
    <TournamentForm
      onSubmit={handleSubmit}
      submitting={createTournament.isPending}
      submitLabel="Crear torneo"
      generalError={generalError}
      fieldErrors={fieldErrors}
    />
  );
}

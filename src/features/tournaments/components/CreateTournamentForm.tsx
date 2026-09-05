import { useNavigate } from "react-router";
import { TournamentForm } from "./TournamentForm";
import { useCreateTournament } from "../hooks/use-create-tournament";
import { ApiError } from "../../../shared/types/api-error";
import type { EditTournamentFormValues } from "../schemas/create-tournament-schema";
import { getTournamentErrorMessage } from "../utils/create-tournament-error-message";

interface CreateTournamentFormProps {
  onCancel?: () => void;
}

export function CreateTournamentForm({ onCancel }: CreateTournamentFormProps) {
  const navigate = useNavigate();
  const createTournament = useCreateTournament();

  function handleSubmit(values: EditTournamentFormValues) {
    createTournament.mutate(
      {
        name: values.name,
        subtitle: values.subtitle || undefined,
        description: values.description || undefined,
        startDate: values.startDate || undefined,
        endDate: values.endDate || undefined,
        timezone: values.timezone || undefined,
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
      onCancel={onCancel}
      submitting={createTournament.isPending}
      submitLabel="Crear torneo"
      generalError={generalError}
      fieldErrors={fieldErrors}
    />
  );
}

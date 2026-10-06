import { useState } from "react";
import { useNavigate, useParams, Navigate } from "react-router";
import { useTournament } from "../features/tournaments/hooks/use-tournament";
import { useCategories } from "../features/categories/hooks/use-categories";
import { useCategoryClosures } from "../features/category-closures/hooks/use-category-closures";
import { usePhases } from "../features/phases/hooks/use-phases";
import { useCreatePhase } from "../features/phases/hooks/use-create-phase";
import { useUpdatePhase } from "../features/phases/hooks/use-update-phase";
import { useDeletePhase } from "../features/phases/hooks/use-delete-phase";
import { PhaseItem } from "../features/phases/components/PhaseItem";
import { PhaseFormModal } from "../features/phases/components/PhaseFormModal";
import { getPhaseErrorMessage } from "../features/phases/utils/phase-error-message";
import type { Phase } from "../features/phases/types";
import type { PhaseFormOutput } from "../features/phases/schemas/phase-schema";
import { useApplyPhaseFormat } from "../features/categories/hooks/use-apply-phase-format";

const ArrowLeftIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const PlusIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export function PhasesPage() {
  const { tournamentId, categoryId } = useParams<{
    tournamentId: string;
    categoryId: string;
  }>();
  const navigate = useNavigate();

  const { data: tournamentData, isLoading: loadingTournament } =
    useTournament(tournamentId);
  const { data: categoriesData } = useCategories(tournamentId);
  const { data: closuresData } = useCategoryClosures(tournamentId);
  const { data, isLoading, isError, error, refetch } = usePhases(
    tournamentId,
    categoryId,
  );

  const createPhase = useCreatePhase(tournamentId!, categoryId!);
  const updatePhase = useUpdatePhase(tournamentId!, categoryId!);
  const deletePhase = useDeletePhase(tournamentId!, categoryId!);
  const applyFormat = useApplyPhaseFormat(tournamentId!, categoryId!);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPhase, setEditingPhase] = useState<Phase | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (!tournamentId || !categoryId) {
    return <Navigate to="/home" replace />;
  }

  if (loadingTournament) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-gray-500">
        Cargando...
      </div>
    );
  }

  if (!tournamentData?.tournament) {
    return <Navigate to="/home" replace />;
  }

  const tournament = tournamentData.tournament;
  const category = categoriesData?.categories?.find((c) => c.id === categoryId);
  const phases = data?.phases ?? [];
  // Con el campeonato cerrado el backend rechaza fases nuevas; aquí solo se avisa y se bloquea el botón.
  const isClosed =
    closuresData?.closures.some((c) => c.categoryId === categoryId) ?? false;

  function handleOpenCreate() {
    if (isClosed) return;
    setEditingPhase(null);
    setModalError(null);
    setModalOpen(true);
  }

  function handleOpenEdit(phase: Phase) {
    setEditingPhase(phase);
    setModalError(null);
    setModalOpen(true);
  }

  function handleCloseModal() {
    setModalOpen(false);
    setEditingPhase(null);
    setModalError(null);
  }

  function handleSubmitForm(values: PhaseFormOutput) {
    setModalError(null);

    const payload = {
      name: values.name,
      type: values.type,
      status: values.status,
      sortOrder: values.sortOrder,
      startDate: values.startDate,
      endDate: values.endDate,
    };

    if (editingPhase) {
      updatePhase.mutate(
        { id: editingPhase.id, payload },
        {
          onSuccess: () => handleCloseModal(),
          onError: (err) => setModalError(getPhaseErrorMessage(err)),
        },
      );
    } else {
      createPhase.mutate(payload, {
        onSuccess: () => handleCloseModal(),
        onError: (err) => setModalError(getPhaseErrorMessage(err)),
      });
    }
  }
  function handleApplyToAll() {
    if (phases.length === 0) {
      window.alert(
        "Crea al menos una fase en esta categoría antes de aplicar el formato.",
      );
      return;
    }

    const ok = window.confirm(
      "Se copiarán estas fases (y sus grupos) a las demás categorías del torneo que aún no tengan fases.\n\nNo se copian equipos ni partidos. Las categorías con el campeonato cerrado se omiten.\n\n¿Continuar?",
    );
    if (!ok) return;

    applyFormat.mutate(
      { force: false },
      {
        onSuccess: (result) => {
          const applied = result.appliedTo.length;
          const skipped = result.skipped.length;
          window.alert(
            `Listo.\n` +
              `Categorías actualizadas: ${applied}\n` +
              `Omitidas (ya tenían fases o están cerradas): ${skipped}\n` +
              `Fases creadas: ${result.createdPhases}\n` +
              `Grupos creados: ${result.createdGroups}`,
          );
        },
        onError: (err) => {
          if (err instanceof Error && err.message === "EMPTY_SOURCE") {
            window.alert("Esta categoría no tiene fases para copiar.");
            return;
          }
          window.alert(getPhaseErrorMessage(err));
        },
      },
    );
  }
  function handleDelete(phase: Phase) {
    if (
      !window.confirm(
        `¿Eliminar la fase "${phase.name}"? Esta acción no se puede deshacer.`,
      )
    ) {
      return;
    }
    setDeletingId(phase.id);
    deletePhase.mutate(phase.id, {
      onSettled: () => setDeletingId(null),
      onError: (err) => {
        window.alert(getPhaseErrorMessage(err));
      },
    });
  }

  function handleOpenPhase(phase: Phase) {
    navigate(
      `/torneos/${tournamentId}/categorias/${categoryId}/fases/${phase.id}`,
    );
  }

  return (
    <div className="w-full">
      <button
        onClick={() => navigate(`/torneos/${tournamentId}/editar`)}
        className="group mb-6 inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-800"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition-colors group-hover:border-gray-300 group-hover:bg-gray-50 group-hover:text-gray-700">
          <ArrowLeftIcon />
        </span>
        Volver al torneo
      </button>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm text-gray-500">{tournament.name}</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900">
            Fases
            {category ? (
              <span className="font-semibold text-gray-600">
                {" "}
                · {category.title}
              </span>
            ) : null}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Organiza grupos, eliminatorias y el orden del torneo.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          disabled={isClosed}
          title={
            isClosed
              ? "El campeonato de esta categoría está cerrado"
              : "Nueva fase"
          }
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          <PlusIcon />
          Nueva fase
        </button>

        <button
          type="button"
          onClick={handleApplyToAll}
          disabled={applyFormat.isPending || phases.length === 0}
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          {applyFormat.isPending
            ? "Aplicando..."
            : "Aplicar a todas las categorías"}
        </button>
      </div>

      {isClosed && (
        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          El campeonato de esta categoría está cerrado, así que no se pueden
          crear fases nuevas. Si necesitas hacer cambios, reábrelo desde la
          llave de la fase de eliminatoria.
        </div>
      )}

      {isLoading && (
        <div className="rounded-xl border border-gray-200 bg-white px-4 py-10 text-center text-sm text-gray-500">
          Cargando fases...
        </div>
      )}

      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-6 text-center">
          <p className="text-sm text-red-700">{getPhaseErrorMessage(error)}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-3 text-sm font-medium text-red-800 underline"
          >
            Reintentar
          </button>
        </div>
      )}

      {!isLoading && !isError && phases.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white px-4 py-12 text-center">
          <p className="text-sm font-medium text-gray-800">
            Aún no hay fases en esta categoría
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Crea la primera fase para organizar partidos y clasificaciones.
          </p>
          <button
            type="button"
            onClick={handleOpenCreate}
            disabled={isClosed}
            className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            <PlusIcon />
            Crear fase
          </button>
        </div>
      )}

      {!isLoading && !isError && phases.length > 0 && (
        <div className="space-y-2">
          {phases.map((phase) => (
            <PhaseItem
              key={phase.id}
              phase={phase}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
              onOpen={handleOpenPhase}
              isDeleting={deletingId === phase.id}
            />
          ))}
        </div>
      )}

      <PhaseFormModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitForm}
        phase={editingPhase}
        isSubmitting={createPhase.isPending || updatePhase.isPending}
        errorMessage={modalError}
      />
    </div>
  );
}

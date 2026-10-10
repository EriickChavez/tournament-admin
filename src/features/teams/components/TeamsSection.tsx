import { useState } from "react";
import { useTeams } from "../hooks/use-teams";
import { useCreateTeam } from "../hooks/use-create-team";
import { useUpdateTeam } from "../hooks/use-update-team";
import { useDeleteTeam } from "../hooks/use-delete-team";
import { useCategories } from "../../categories/hooks/use-categories";
import { useCategoryLocks } from "../../competition-state/hooks/use-category-locks";
import { RosterLockNotice } from "../../competition-state/components/RosterLockNotice";
import { TeamItem } from "./TeamItem";
import { TeamFormModal } from "./TeamFormModal";
import { Pagination } from "../../../shared/components/Pagination";
import { getTeamErrorMessage } from "../utils/team-error-message";
import type { Team } from "../types";
import type { TeamFormOutput } from "../schemas/team-schema";

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

const ShieldIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

interface TeamsSectionProps {
  tournamentId: string;
}

export function TeamsSection({ tournamentId }: TeamsSectionProps) {
  const [page, setPage] = useState(1);

  // Si cambia el torneo, arrancamos en la página 1. Se ajusta durante el
  // render (patrón recomendado por React) en vez de con un useEffect.
  const [prevTournamentId, setPrevTournamentId] = useState(tournamentId);
  if (tournamentId !== prevTournamentId) {
    setPrevTournamentId(tournamentId);
    setPage(1);
  }

  const {
    data: teamsData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useTeams(tournamentId, page);
  const { data: categoriesData } = useCategories(tournamentId);
  const { isOpen } = useCategoryLocks(tournamentId);
  const createTeam = useCreateTeam(tournamentId);
  const updateTeam = useUpdateTeam(tournamentId);
  const deleteTeam = useDeleteTeam(tournamentId);

  // Si borramos el último equipo de una página y esa página ya no existe
  // (p. ej. estábamos en la página 3 de 3 y ahora solo hay 2), regresamos
  // a la última página válida.
  if (
    teamsData &&
    teamsData.pagination.totalPages > 0 &&
    page > teamsData.pagination.totalPages
  ) {
    setPage(teamsData.pagination.totalPages);
  }

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  const teams = teamsData?.teams ?? [];
  const categories = categoriesData?.categories ?? [];
  const categoryTitleById = new Map(
    categories.map((c) => [c.id, c.title] as const),
  );

  // Solo se ofrecen categorías que todavía aceptan equipos. Al editar se conserva la
  // categoría actual del equipo, aunque ya esté bloqueada, para que el selector la muestre.
  const openCategories = categories.filter((c) => isOpen(c.id));
  const formCategories = categories.filter(
    (c) => isOpen(c.id) || c.id === editingTeam?.categoryId,
  );

  function handleOpenCreate() {
    setEditingTeam(null);
    setModalError(null);
    setModalOpen(true);
  }

  function handleOpenEdit(team: Team) {
    setEditingTeam(team);
    setModalError(null);
    setModalOpen(true);
  }

  function handleCloseModal() {
    setModalOpen(false);
    setEditingTeam(null);
    setModalError(null);
  }

  function handleSubmitForm(values: TeamFormOutput) {
    setModalError(null);
    if (editingTeam) {
      updateTeam.mutate(
        {
          id: editingTeam.id,
          payload: {
            categoryId: values.categoryId,
            name: values.name,
            abbreviation: values.abbreviation,
            logoUrl: values.logoUrl,
          },
        },
        {
          onSuccess: () => handleCloseModal(),
          onError: (err) => setModalError(getTeamErrorMessage(err)),
        },
      );
    } else {
      createTeam.mutate(
        {
          categoryId: values.categoryId,
          name: values.name,
          abbreviation: values.abbreviation,
          logoUrl: values.logoUrl,
        },
        {
          onSuccess: () => handleCloseModal(),
          onError: (err) => setModalError(getTeamErrorMessage(err)),
        },
      );
    }
  }

  function handleDeleteTeam(team: Team) {
    if (!isOpen(team.categoryId)) {
      window.alert(
        "Esta categoría ya empezó o su campeonato está cerrado: ya no se pueden eliminar equipos.",
      );
      return;
    }
    if (
      !window.confirm(
        `¿Eliminar el equipo "${team.name}"? Esta acción no se puede deshacer.`,
      )
    )
      return;
    deleteTeam.mutate(team.id, {
      onError: (err) => window.alert(getTeamErrorMessage(err)),
    });
  }

  const newTeamTitle =
    categories.length === 0
      ? "Crea una categoría primero"
      : openCategories.length === 0
        ? "Todas las categorías ya empezaron o están cerradas"
        : "Nuevo equipo";

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-5 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <ShieldIcon />
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-bold text-gray-900">Equipos</h2>
            <p className="text-xs text-gray-500">
              Planteles del torneo por categoría
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleOpenCreate}
          disabled={openCategories.length === 0}
          className="min-h-9 px-3 rounded-xl bg-primary text-white text-xs font-medium flex items-center gap-1.5 hover:opacity-90 disabled:opacity-50 transition-opacity shrink-0"
          title={newTeamTitle}
        >
          <PlusIcon /> Nuevo equipo
        </button>
      </div>

      <RosterLockNotice tournamentId={tournamentId} categories={categories} />

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-gray-400 py-6">
          <svg
            className="animate-spin text-primary"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <path d="M12 2a10 10 0 0 1 10 10" opacity="0.3" />
            <path d="M12 2a10 10 0 0 1 10 10" />
          </svg>
          Cargando equipos...
        </div>
      )}

      {isError && (
        <div className="rounded-xl bg-red-50 border border-red-100 p-4 flex flex-col sm:flex-row sm:items-center gap-3">
          <p className="text-sm text-red-600 flex-1">
            {getTeamErrorMessage(error)}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="text-xs text-red-700 underline font-medium hover:opacity-80"
          >
            Reintentar
          </button>
        </div>
      )}

      {!isLoading && !isError && teams.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center py-10 px-4 rounded-xl border border-dashed border-gray-200 bg-gray-50/50">
          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
            <ShieldIcon />
          </div>
          <h3 className="text-sm font-semibold text-gray-800">
            No hay equipos registrados
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mt-1 mb-4">
            {categories.length === 0
              ? "Primero crea una categoría y después agrega los equipos participantes."
              : "Agrega los equipos que participarán en cada categoría del torneo."}
          </p>
          {openCategories.length > 0 && (
            <button
              type="button"
              onClick={handleOpenCreate}
              className="min-h-9 px-4 rounded-xl bg-primary text-white text-xs font-medium hover:opacity-90 transition-opacity"
            >
              + Crear primer equipo
            </button>
          )}
        </div>
      )}

      {!isLoading && !isError && teams.length > 0 && (
        <div className="flex flex-col gap-2.5">
          {teams.map((team) => (
            <TeamItem
              key={team.id}
              team={team}
              categoryTitle={categoryTitleById.get(team.categoryId)}
              onEdit={handleOpenEdit}
              onDelete={handleDeleteTeam}
              isDeleting={deleteTeam.isPending}
            />
          ))}
        </div>
      )}

      {!isLoading && !isError && teamsData && (
        <Pagination
          pagination={teamsData.pagination}
          onPageChange={setPage}
          isFetching={isFetching}
        />
      )}

      <TeamFormModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitForm}
        team={editingTeam}
        categories={formCategories}
        isSubmitting={createTeam.isPending || updateTeam.isPending}
        errorMessage={modalError}
      />
    </div>
  );
}

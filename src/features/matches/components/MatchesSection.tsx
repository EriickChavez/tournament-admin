import { useState } from "react";
import { useMatches } from "../hooks/use-matches";
import { useCreateMatch } from "../hooks/use-create-match";
import { useUpdateMatch } from "../hooks/use-update-match";
import { useDeleteMatch } from "../hooks/use-delete-match";
import { useCategories } from "../../categories/hooks/use-categories";
import { useTeams } from "../../teams/hooks/use-teams";
import { MatchItem } from "./MatchItem";
import { MatchFormModal } from "./MatchFormModal";
import { Pagination } from "../../../shared/components/Pagination";
import { getMatchErrorMessage } from "../utils/match-error-message";
import { datetimeLocalToIso } from "../utils/datetime";
import type { Match, MatchStatus } from "../types";
import type { MatchFormOutput } from "../schemas/match-schema";

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

const CalendarIcon = () => (
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
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const STATUS_FILTER_OPTIONS: { value: MatchStatus | ""; label: string }[] = [
  { value: "", label: "Todos los estados" },
  { value: "scheduled", label: "Programado" },
  { value: "in_progress", label: "En curso" },
  { value: "finished", label: "Finalizado" },
  { value: "cancelled", label: "Cancelado" },
  { value: "postponed", label: "Pospuesto" },
];

interface MatchesSectionProps {
  tournamentId: string;
}

export function MatchesSection({ tournamentId }: MatchesSectionProps) {
  const [page, setPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<MatchStatus | "">("");

  // Si cambia el torneo, arrancamos en la página 1 y sin filtros. Se ajusta
  // durante el render (patrón recomendado por React) en vez de con un
  // useEffect.
  const [prevTournamentId, setPrevTournamentId] = useState(tournamentId);
  if (tournamentId !== prevTournamentId) {
    setPrevTournamentId(tournamentId);
    setPage(1);
    setCategoryFilter("");
    setStatusFilter("");
  }

  const filters = {
    categoryId: categoryFilter || undefined,
    status: statusFilter || undefined,
  };

  const {
    data: matchesData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useMatches(tournamentId, page, undefined, filters);
  const { data: categoriesData } = useCategories(tournamentId);
  // Límite máximo: esta lista alimenta los selects del modal y el lookup de
  // nombres, no es la vista paginada — necesita "todos" los equipos.
  const { data: teamsData } = useTeams(tournamentId, 1, 100);

  const createMatch = useCreateMatch(tournamentId);
  const updateMatch = useUpdateMatch(tournamentId);
  const deleteMatch = useDeleteMatch(tournamentId);

  // Si borramos el último partido de una página y esa página ya no existe,
  // regresamos a la última página válida.
  if (
    matchesData &&
    matchesData.pagination.totalPages > 0 &&
    page > matchesData.pagination.totalPages
  ) {
    setPage(matchesData.pagination.totalPages);
  }

  const [modalOpen, setModalOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  const matches = matchesData?.matches ?? [];
  const categories = categoriesData?.categories ?? [];
  const teams = teamsData?.teams ?? [];

  const categoryTitleById = new Map(
    categories.map((c) => [c.id, c.title] as const),
  );
  const teamNameById = new Map(teams.map((t) => [t.id, t.name] as const));
  const canCreate = categories.length > 0 && teams.length >= 2;

  function handleOpenCreate() {
    setEditingMatch(null);
    setModalError(null);
    setModalOpen(true);
  }

  function handleOpenEdit(match: Match) {
    setEditingMatch(match);
    setModalError(null);
    setModalOpen(true);
  }

  function handleCloseModal() {
    setModalOpen(false);
    setEditingMatch(null);
    setModalError(null);
  }

  function handleSubmitForm(values: MatchFormOutput) {
    setModalError(null);
    const payload = {
      categoryId: values.categoryId,
      homeTeamId: values.homeTeamId,
      awayTeamId: values.awayTeamId,
      scheduledAt: datetimeLocalToIso(values.scheduledAt),
      venue: values.venue,
      status: values.status,
    };

    if (editingMatch) {
      updateMatch.mutate(
        {
          id: editingMatch.id,
          payload: { ...payload, venue: values.venue ?? null },
        },
        {
          onSuccess: () => handleCloseModal(),
          onError: (err) => setModalError(getMatchErrorMessage(err)),
        },
      );
    } else {
      createMatch.mutate(payload, {
        onSuccess: () => handleCloseModal(),
        onError: (err) => setModalError(getMatchErrorMessage(err)),
      });
    }
  }

  function handleDeleteMatch(match: Match) {
    const home = teamNameById.get(match.homeTeamId) ?? "equipo local";
    const away = teamNameById.get(match.awayTeamId) ?? "equipo visitante";
    if (
      !window.confirm(
        `¿Eliminar el partido "${home} vs ${away}"? Esta acción no se puede deshacer.`,
      )
    )
      return;
    deleteMatch.mutate(match.id);
  }

  function handleCategoryFilterChange(value: string) {
    setCategoryFilter(value);
    setPage(1);
  }

  function handleStatusFilterChange(value: MatchStatus | "") {
    setStatusFilter(value);
    setPage(1);
  }

  const selectClass =
    "min-h-9 px-3 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors";

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-5 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <CalendarIcon />
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-bold text-gray-900">Partidos</h2>
            <p className="text-xs text-gray-500">
              Calendario de encuentros del torneo
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleOpenCreate}
          disabled={!canCreate}
          className="min-h-9 px-3 rounded-xl bg-primary text-white text-xs font-medium flex items-center gap-1.5 hover:opacity-90 disabled:opacity-50 transition-opacity shrink-0"
          title={
            !canCreate
              ? "Crea una categoría y al menos 2 equipos primero"
              : "Nuevo partido"
          }
        >
          <PlusIcon /> Nuevo partido
        </button>
      </div>

      {categories.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <select
            value={categoryFilter}
            onChange={(e) => handleCategoryFilterChange(e.target.value)}
            className={selectClass}
          >
            <option value="">Todas las categorías</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.title}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) =>
              handleStatusFilterChange(e.target.value as MatchStatus | "")
            }
            className={selectClass}
          >
            {STATUS_FILTER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )}

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
          Cargando partidos...
        </div>
      )}

      {isError && (
        <div className="rounded-xl bg-red-50 border border-red-100 p-4 flex flex-col sm:flex-row sm:items-center gap-3">
          <p className="text-sm text-red-600 flex-1">
            {getMatchErrorMessage(error)}
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

      {!isLoading && !isError && matches.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center py-10 px-4 rounded-xl border border-dashed border-gray-200 bg-gray-50/50">
          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
            <CalendarIcon />
          </div>
          <h3 className="text-sm font-semibold text-gray-800">
            No hay partidos registrados
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mt-1 mb-4">
            {!canCreate
              ? "Primero crea una categoría y al menos 2 equipos para programar partidos."
              : categoryFilter || statusFilter
                ? "No hay partidos que coincidan con los filtros seleccionados."
                : "Agrega el calendario de encuentros del torneo."}
          </p>
          {canCreate && !categoryFilter && !statusFilter && (
            <button
              type="button"
              onClick={handleOpenCreate}
              className="min-h-9 px-4 rounded-xl bg-primary text-white text-xs font-medium hover:opacity-90 transition-opacity"
            >
              + Crear primer partido
            </button>
          )}
        </div>
      )}

      {!isLoading && !isError && matches.length > 0 && (
        <div className="flex flex-col gap-2.5">
          {matches.map((match) => (
            <MatchItem
              key={match.id}
              match={match}
              homeTeamName={teamNameById.get(match.homeTeamId)}
              awayTeamName={teamNameById.get(match.awayTeamId)}
              categoryTitle={categoryTitleById.get(match.categoryId)}
              onEdit={handleOpenEdit}
              onDelete={handleDeleteMatch}
              isDeleting={deleteMatch.isPending}
            />
          ))}
        </div>
      )}

      {!isLoading && !isError && matchesData && (
        <Pagination
          pagination={matchesData.pagination}
          onPageChange={setPage}
          isFetching={isFetching}
        />
      )}

      <MatchFormModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitForm}
        match={editingMatch}
        categories={categories}
        teams={teams}
        isSubmitting={createMatch.isPending || updateMatch.isPending}
        errorMessage={modalError}
      />
    </div>
  );
}

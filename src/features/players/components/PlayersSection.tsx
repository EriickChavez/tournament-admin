import { useState } from "react";
import { usePlayers } from "../hooks/use-players";
import { useCreatePlayer } from "../hooks/use-create-player";
import { useUpdatePlayer } from "../hooks/use-update-player";
import { useDeletePlayer } from "../hooks/use-delete-player";
import { useCategories } from "../../categories/hooks/use-categories";
import { useTeams } from "../../teams/hooks/use-teams";
import { PlayerItem } from "./PlayerItem";
import { PlayerFormModal } from "./PlayerFormModal";
import { getPlayerErrorMessage } from "../utils/player-error-message";
import type { Player } from "../types";
import type { PlayerFormOutput } from "../schemas/player-schema";

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

const UsersIcon = () => (
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
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

interface PlayersSectionProps {
  tournamentId: string;
}

export function PlayersSection({ tournamentId }: PlayersSectionProps) {
  const {
    data: playersData,
    isLoading,
    isError,
    error,
    refetch,
  } = usePlayers(tournamentId);
  const { data: categoriesData } = useCategories(tournamentId);
  const { data: teamsData } = useTeams(tournamentId);

  const createPlayer = useCreatePlayer(tournamentId);
  const updatePlayer = useUpdatePlayer(tournamentId);
  const deletePlayer = useDeletePlayer(tournamentId);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  const players = playersData?.players ?? [];
  const categories = categoriesData?.categories ?? [];
  const teams = teamsData?.teams ?? [];

  const categoryTitleById = new Map(
    categories.map((c) => [c.id, c.title] as const),
  );
  const teamNameById = new Map(teams.map((t) => [t.id, t.name] as const));
  const canCreate = categories.length > 0 && teams.length > 0;

  function handleOpenCreate() {
    setEditingPlayer(null);
    setModalError(null);
    setModalOpen(true);
  }

  function handleOpenEdit(player: Player) {
    setEditingPlayer(player);
    setModalError(null);
    setModalOpen(true);
  }

  function handleCloseModal() {
    setModalOpen(false);
    setEditingPlayer(null);
    setModalError(null);
  }

  function handleSubmitForm(values: PlayerFormOutput) {
    setModalError(null);
    const payload = {
      categoryId: values.categoryId,
      teamId: values.teamId,
      firstName: values.firstName,
      lastName: values.lastName,
      number: values.number,
      birthDate: values.birthDate,
      isCaptain: values.isCaptain,
      role: values.role,
    };

    if (editingPlayer) {
      updatePlayer.mutate(
        {
          id: editingPlayer.id,
          payload: {
            ...payload,
            birthDate: values.birthDate ?? null,
            role: values.role ?? null,
          },
        },
        {
          onSuccess: () => handleCloseModal(),
          onError: (err) => setModalError(getPlayerErrorMessage(err)),
        },
      );
    } else {
      createPlayer.mutate(payload, {
        onSuccess: () => handleCloseModal(),
        onError: (err) => setModalError(getPlayerErrorMessage(err)),
      });
    }
  }

  function handleDeletePlayer(player: Player) {
    const name = `${player.firstName} ${player.lastName}`.trim();
    if (
      !window.confirm(
        `¿Eliminar al jugador "${name}"? Esta acción no se puede deshacer.`,
      )
    )
      return;
    deletePlayer.mutate(player.id);
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-5 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <UsersIcon />
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-bold text-gray-900">Jugadores</h2>
            <p className="text-xs text-gray-500">
              Plantilla del torneo (número único por torneo)
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleOpenCreate}
          disabled={!canCreate}
          className="min-h-9 px-3 rounded-xl bg-primary text-white text-xs font-medium flex items-center gap-1.5 hover:opacity-90 disabled:opacity-50 transition-opacity shrink-0"
          title={
            !canCreate ? "Crea categoría y equipo primero" : "Nuevo jugador"
          }
        >
          <PlusIcon /> Nuevo jugador
        </button>
      </div>

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
          Cargando jugadores...
        </div>
      )}

      {isError && (
        <div className="rounded-xl bg-red-50 border border-red-100 p-4 flex flex-col sm:flex-row sm:items-center gap-3">
          <p className="text-sm text-red-600 flex-1">
            {getPlayerErrorMessage(error)}
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

      {!isLoading && !isError && players.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center py-10 px-4 rounded-xl border border-dashed border-gray-200 bg-gray-50/50">
          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
            <UsersIcon />
          </div>
          <h3 className="text-sm font-semibold text-gray-800">
            No hay jugadores registrados
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mt-1 mb-4">
            {!canCreate
              ? "Primero crea categorías y equipos; después agrega la plantilla."
              : "Agrega jugadores a cada equipo del torneo."}
          </p>
          {canCreate && (
            <button
              type="button"
              onClick={handleOpenCreate}
              className="min-h-9 px-4 rounded-xl bg-primary text-white text-xs font-medium hover:opacity-90 transition-opacity"
            >
              + Crear primer jugador
            </button>
          )}
        </div>
      )}

      {!isLoading && !isError && players.length > 0 && (
        <div className="flex flex-col gap-2.5">
          {players.map((player) => (
            <PlayerItem
              key={player.id}
              player={player}
              teamName={teamNameById.get(player.teamId)}
              categoryTitle={categoryTitleById.get(player.categoryId)}
              onEdit={handleOpenEdit}
              onDelete={handleDeletePlayer}
              isDeleting={deletePlayer.isPending}
            />
          ))}
        </div>
      )}

      <PlayerFormModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitForm}
        player={editingPlayer}
        categories={categories}
        teams={teams}
        isSubmitting={createPlayer.isPending || updatePlayer.isPending}
        errorMessage={modalError}
      />
    </div>
  );
}

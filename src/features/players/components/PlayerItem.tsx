import type { Player } from "../types";

const EditIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const TrashIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

interface PlayerItemProps {
  player: Player;
  teamName?: string;
  categoryTitle?: string;
  onEdit: (player: Player) => void;
  onDelete: (player: Player) => void;
  isDeleting: boolean;
}

export function PlayerItem({
  player,
  teamName,
  categoryTitle,
  onEdit,
  onDelete,
  isDeleting,
}: PlayerItemProps) {
  const fullName = `${player.firstName} ${player.lastName}`.trim();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-colors">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0">
          {player.number !== null ? player.number : "—"}
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-0.5">
            <h3 className="text-base font-bold text-gray-900 truncate">
              {fullName}
            </h3>
            {player.isCaptain && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-100 text-amber-700 text-[11px] font-semibold">
                Capitán
              </span>
            )}
            {player.role && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-200/70 text-gray-600 text-[11px] font-semibold">
                {player.role}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 truncate">
            {[teamName, categoryTitle].filter(Boolean).join(" · ") ||
              "Sin equipo / categoría"}
            {player.birthDate ? ` · ${player.birthDate}` : ""}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
        <button
          type="button"
          onClick={() => onEdit(player)}
          className="min-h-8 px-3 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 hover:text-primary transition-colors flex items-center gap-1.5"
          title="Editar jugador"
        >
          <EditIcon /> Editar
        </button>
        <button
          type="button"
          disabled={isDeleting}
          onClick={() => onDelete(player)}
          className="min-h-8 px-3 rounded-lg border border-red-200 text-xs font-medium text-red-600 bg-white hover:bg-red-50 disabled:opacity-50 transition-colors flex items-center gap-1.5"
          title="Eliminar jugador"
        >
          <TrashIcon /> Eliminar
        </button>
      </div>
    </div>
  );
}

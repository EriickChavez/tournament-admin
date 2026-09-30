import type { Match } from "../types";
import { MATCH_STATUS_LABELS } from "../types";

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

const CalendarIcon = () => (
  <svg
    width="12"
    height="12"
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

const MapPinIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const STATUS_STYLES: Record<Match["status"], string> = {
  scheduled: "bg-blue-50 text-blue-600",
  in_progress: "bg-amber-50 text-amber-600",
  finished: "bg-green-50 text-green-600",
  cancelled: "bg-red-50 text-red-600",
  postponed: "bg-gray-100 text-gray-500",
};

interface MatchItemProps {
  match: Match;
  homeTeamName?: string;
  awayTeamName?: string;
  categoryTitle?: string;
  groupName?: string;
  onEdit: (match: Match) => void;
  onDelete: (match: Match) => void;
  isDeleting: boolean;
}

export function MatchItem({
  match,
  homeTeamName,
  awayTeamName,
  categoryTitle,
  groupName,
  onEdit,
  onDelete,
  isDeleting,
}: MatchItemProps) {
  const formattedDate = new Date(match.scheduledAt).toLocaleString("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-colors">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h3 className="text-sm font-bold text-gray-900 truncate">
            {homeTeamName ?? "Equipo local"}{" "}
            <span className="text-gray-400 font-normal">vs</span>{" "}
            {awayTeamName ?? "Equipo visitante"}
          </h3>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold ${STATUS_STYLES[match.status]}`}
          >
            {MATCH_STATUS_LABELS[match.status]}
          </span>
          {categoryTitle && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[11px] font-semibold">
              {categoryTitle}
            </span>
          )}
          {groupName && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-violet-50 text-violet-600 text-[11px] font-semibold">
              {groupName}
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <CalendarIcon /> {formattedDate}
          </span>
          {match.round != null && <span>Jornada {match.round}</span>}
          {match.venue && (
            <span className="flex items-center gap-1">
              <MapPinIcon /> {match.venue}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
        <button
          type="button"
          onClick={() => onEdit(match)}
          className="min-h-8 px-3 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 hover:text-primary transition-colors flex items-center gap-1.5"
          title="Editar partido"
        >
          <EditIcon /> Editar
        </button>
        <button
          type="button"
          disabled={isDeleting}
          onClick={() => onDelete(match)}
          className="min-h-8 px-3 rounded-lg border border-red-200 text-xs font-medium text-red-600 bg-white hover:bg-red-50 disabled:opacity-50 transition-colors flex items-center gap-1.5"
          title="Eliminar partido"
        >
          <TrashIcon /> Eliminar
        </button>
      </div>
    </div>
  );
}

import { Link } from "react-router";
import type { Tournament } from "../types";

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

export function TournamentList({ tournaments }: { tournaments: Tournament[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {tournaments.map((t) => (
        <li
          key={t.id}
          className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="min-w-0 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-sm">🏆</span>
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 truncate">{t.name}</p>
              {t.subtitle && (
                <p className="text-xs text-gray-500 truncate">{t.subtitle}</p>
              )}
            </div>
          </div>
          <Link
            to={`/torneos/${t.id}/editar`}
            className="shrink-0 min-h-9 px-3 flex items-center gap-1.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary hover:border-primary/30 transition-colors"
          >
            <EditIcon />
            Editar
          </Link>
        </li>
      ))}
    </ul>
  );
}

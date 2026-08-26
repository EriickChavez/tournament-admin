import { Link } from "react-router";
import type { Tournament } from "../types";

export function TournamentList({ tournaments }: { tournaments: Tournament[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {tournaments.map((t) => (
        <li
          key={t.id}
          className="flex items-center justify-between gap-3 p-4 border rounded-lg bg-white"
        >
          <div className="min-w-0">
            <p className="font-medium truncate">{t.name}</p>
            {t.subtitle && (
              <p className="text-sm text-gray-500 truncate">{t.subtitle}</p>
            )}
          </div>
          <Link
            to={`/torneos/${t.id}/editar`}
            className="shrink-0 min-h-11 px-4 flex items-center rounded border text-sm"
          >
            Editar
          </Link>
        </li>
      ))}
    </ul>
  );
}

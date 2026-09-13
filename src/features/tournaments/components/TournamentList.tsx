import { useNavigate } from "react-router";
import type { Tournament } from "../types";
import { useDeleteTournament } from "../hooks/use-delete-tournament";

interface StatColumnProps {
  label: string;
  value: string | number;
  accent?: boolean;
}

function StatColumn({ label, value, accent }: StatColumnProps) {
  return (
    <div className="min-w-[72px]">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400">
        {label}
      </p>

      <p
        className={`mt-1 text-lg font-bold ${
          accent ? "text-primary" : "text-gray-800"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function formatDisplayDate(dateStr?: string | null): string {
  if (!dateStr) return "";

  try {
    const [year, month, day] = dateStr.split("T")[0].split("-");

    if (!year || !month || !day) return dateStr;

    const date = new Date(Number(year), Number(month) - 1, Number(day));

    return date.toLocaleDateString("es-MX", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

/** Días que faltan para endDate, comparando por día calendario (sin horas). */
function getDaysRemaining(endDate?: string | null): number | null {
  if (!endDate) return null;

  const [year, month, day] = endDate.split("T")[0].split("-").map(Number);
  if (!year || !month || !day) return null;

  const end = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffMs = end.getTime() - today.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

function formatDaysRemaining(days: number | null): string {
  if (days === null) return "—";
  if (days < 0) return "Finalizado";
  if (days === 0) return "Hoy";
  return String(days);
}

export function TournamentList({ tournaments }: { tournaments: Tournament[] }) {
  const navigate = useNavigate();
  const deleteTournament = useDeleteTournament();

  const handleDeleteTournament = (id: string) => {
    deleteTournament.mutate(id, {
      onSuccess: () => {
        window.location.reload();
      },
    });
  };

  return (
    <ul className="space-y-3">
      {tournaments.map((tournament) => (
        <li key={tournament.id}>
          <article className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-primary/20 hover:shadow-md sm:p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              {/* Main information */}
              <button
                type="button"
                onClick={() => navigate(`/torneos/${tournament.id}/editar`)}
                className="min-w-0 flex-1 text-left"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
                    Activo
                  </span>

                  {tournament.startDate && (
                    <span className="text-xs text-gray-400">
                      Desde {formatDisplayDate(tournament.startDate)}
                    </span>
                  )}
                </div>

                <h3 className="mt-3 truncate text-lg font-bold tracking-tight text-gray-900 transition-colors group-hover:text-primary">
                  {tournament.name}
                </h3>

                {tournament.subtitle && (
                  <p className="mt-1 truncate text-sm text-gray-500">
                    {tournament.subtitle}
                  </p>
                )}

                {tournament.description && (
                  <p className="mt-2 line-clamp-2 max-w-2xl text-sm leading-6 text-gray-400">
                    {tournament.description}
                  </p>
                )}
              </button>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-5 border-t border-gray-100 pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                <StatColumn
                  label="Jugadores"
                  value={tournament.playerCount ?? "—"}
                />
                <StatColumn
                  label="Equipos"
                  value={tournament.teamCount ?? "—"}
                />
                <StatColumn
                  label="Días rest."
                  value={formatDaysRemaining(
                    getDaysRemaining(tournament.endDate),
                  )}
                  accent
                />

                <button
                  type="button"
                  disabled={deleteTournament.isPending}
                  onClick={() => {
                    const confirmed = window.confirm(
                      `¿Estás seguro de eliminar el torneo "${tournament.name}"?`,
                    );

                    if (confirmed) {
                      handleDeleteTournament(tournament.id);
                    }
                  }}
                  className="min-h-9 rounded-xl border border-red-200 px-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}

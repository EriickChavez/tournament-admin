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
    <div className="flex flex-col items-center gap-0.5 min-w-[56px]">
      <span className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
        {label}
      </span>
      <span
        className={`text-2xl font-bold leading-none ${
          accent ? "text-primary" : "text-gray-800"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function formatDisplayDate(dateStr?: string | null): string {
  if (!dateStr) return "";
  try {
    const [year, month, day] = dateStr.split("T")[0].split("-");
    if (!year || !month || !day) return dateStr;
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
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
    <ul className="flex flex-col gap-3">
      {tournaments.map((t) => (
        <li key={t.id}>
          <button
            onClick={() => navigate(`/torneos/${t.id}/editar`)}
            className="w-full text-left group"
          >
            <div className="flex items-center justify-between gap-6 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200">
              {/* Left: badge + name + description */}
              <div className="min-w-0 flex-1">
                {/* Badge row */}
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-[10px] font-bold tracking-widest text-primary uppercase">
                    Activo
                  </span>
                  {t.startDate && (
                    <span className="text-xs text-gray-400">
                      Desde {formatDisplayDate(t.startDate)}
                    </span>
                  )}
                  {t.subtitle && (
                    <span className="text-xs text-gray-400 italic truncate">
                      {t.startDate ? `• ${t.subtitle}` : t.subtitle}
                    </span>
                  )}
                </div>

                {/* Tournament name */}
                <p className="text-lg font-bold text-gray-900 leading-tight truncate group-hover:text-primary transition-colors">
                  {t.name}
                </p>

                {/* Description */}
                {t.description && (
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2 max-w-lg">
                    {t.description}
                  </p>
                )}
              </div>

              {/* Divider */}
              <div className="hidden sm:block h-10 w-px bg-gray-100 shrink-0" />

              {/* Right: stats */}
              <div className="hidden sm:flex items-center gap-6 shrink-0">
                <StatColumn label="Jugadores" value="—" />
                <StatColumn label="Equipos" value="—" />
                <StatColumn label="Días rest." value="—" accent />
                <button
                  disabled={deleteTournament.isPending}
                  onClick={(e) => {
                    e.stopPropagation();
                    const isConfirm = confirm(
                      "¿Estás seguro de eliminar el torneo: " + t.name + "?",
                    );
                    if (isConfirm) {
                      handleDeleteTournament(t.id);
                    }
                  }}
                  className="min-h-9 px-4 rounded-xl bg-red-500 text-white text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-opacity"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
}

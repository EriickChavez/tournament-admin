import { useParams, useNavigate, Navigate } from "react-router";
import { useTournaments } from "../features/tournaments/hooks/use-tournaments";
import { EditTournamentForm } from "../features/tournaments/components/EditTournamentForm";
import { CategoriesSection } from "../features/categories/components/CategoriesSection";
import { TeamsSection } from "../features/teams/components/TeamsSection";
import { PlayersSection } from "../features/players/components/PlayersSection";
import { MatchesSection } from "../features/matches/components/MatchesSection";

const ArrowLeftIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

export function EditTournamentPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useTournaments();
  const navigate = useNavigate();

  if (isLoading)
    return (
      <div className="flex items-center gap-2 text-sm text-gray-400 py-8">
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
        Cargando...
      </div>
    );

  const tournament = data?.tournaments.find((t) => t.id === id);
  if (!tournament) return <Navigate to="/home" replace />;

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
          title="Volver"
        >
          <ArrowLeftIcon />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Editar torneo</h1>
          <p className="text-sm text-gray-500 truncate max-w-xs">
            {tournament.name}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-base font-bold text-gray-900 mb-5 pb-3 border-b border-gray-100">
          Información general
        </h2>
        <EditTournamentForm tournament={tournament} />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <CategoriesSection tournamentId={tournament.id} />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <TeamsSection tournamentId={tournament.id} />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <PlayersSection tournamentId={tournament.id} />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <MatchesSection tournamentId={tournament.id} />
      </div>
    </div>
  );
}

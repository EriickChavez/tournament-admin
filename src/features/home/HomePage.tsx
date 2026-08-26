import { useNavigate } from "react-router";
import { useTournaments } from "../tournaments/hooks/use-tournaments";
import { TournamentList } from "../tournaments/components/TournamentList";
import { EmptyTournamentState } from "./components/EmptyTournamentState";
import { getTournamentErrorMessage } from "../tournaments/utils/create-tournament-error-message";

const PlusIcon = () => (
  <svg
    width="16"
    height="16"
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

export function HomePage() {
  const { data, isLoading, isError, error, refetch } = useTournaments();
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl">
      <h1 className="text-2xl font-bold text-gray-900 mt-2">Buenas tardes</h1>
      <p className="text-sm text-gray-500 mt-1">
        Esto es lo que sucede en tu torneo
      </p>

      <div className="mt-6">
        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-gray-400 py-4">
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
            Cargando torneos...
          </div>
        )}

        {isError && (
          <div className="rounded-2xl bg-red-50 border border-red-100 p-4 flex flex-col items-start gap-3">
            <p className="text-sm text-red-600">
              {getTournamentErrorMessage(error)}
            </p>
            <button
              onClick={() => refetch()}
              className="min-h-9 px-4 rounded-xl border border-red-200 text-sm text-red-600 hover:bg-red-100 transition-colors"
            >
              Reintentar
            </button>
          </div>
        )}

        {data && data.tournaments.length === 0 && <EmptyTournamentState />}
        {data && data.tournaments.length > 0 && (
          <>
            <div className="flex justify-end mb-3">
              <button
                onClick={() => navigate("/torneos/crear")}
                className="min-h-10 px-4 rounded-xl bg-primary text-white text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-opacity"
              >
                <PlusIcon />
                Nuevo torneo
              </button>
            </div>
            <TournamentList tournaments={data.tournaments} />
          </>
        )}
      </div>
    </div>
  );
}

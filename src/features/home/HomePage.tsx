import { useNavigate } from "react-router";
import { useTournaments } from "../tournaments/hooks/use-tournaments";
import { TournamentList } from "../tournaments/components/TournamentList";
import { EmptyTournamentState } from "./components/EmptyTournamentState";
import { getTournamentErrorMessage } from "../tournaments/utils/create-tournament-error-message";

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
        {isLoading && <p className="text-gray-400">Cargando torneos...</p>}

        {isError && (
          <div className="flex flex-col items-start gap-2">
            <p className="text-red-600 text-sm">
              {getTournamentErrorMessage(error)}
            </p>
            <button
              onClick={() => refetch()}
              className="min-h-11 px-4 rounded border text-sm"
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
                className="min-h-11 px-4 rounded bg-gray-900 text-white text-sm"
              >
                + Nuevo torneo
              </button>
            </div>
            <TournamentList tournaments={data.tournaments} />
          </>
        )}
      </div>
    </div>
  );
}

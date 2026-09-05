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
    <div className="space-y-8">
      {/* Header */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            Administración
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
            Buenas tardes
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
            Administra tus torneos, equipos, jugadores y partidos desde un solo
            lugar.
          </p>
        </div>

        <button
          onClick={() => navigate("/torneos/crear")}
          className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 hover:shadow-md"
        >
          <PlusIcon />
          Nuevo torneo
        </button>
      </section>

      {/* Content */}
      <section>
        {isLoading && (
          <div className="flex min-h-32 items-center justify-center rounded-2xl border border-gray-200 bg-white">
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <svg
                className="animate-spin text-primary"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M12 2a10 10 0 0 1 10 10" opacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" />
              </svg>
              Cargando torneos...
            </div>
          </div>
        )}

        {isError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
            <p className="text-sm font-medium text-red-700">
              {getTournamentErrorMessage(error)}
            </p>

            <button
              onClick={() => refetch()}
              className="mt-4 min-h-9 rounded-xl border border-red-200 bg-white px-4 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
            >
              Reintentar
            </button>
          </div>
        )}

        {data && data.tournaments.length === 0 && <EmptyTournamentState />}

        {data && data.tournaments.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Tus torneos
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  {data.tournaments.length}{" "}
                  {data.tournaments.length === 1 ? "torneo" : "torneos"}
                </p>
              </div>
            </div>

            <TournamentList tournaments={data.tournaments} />
          </div>
        )}
      </section>
    </div>
  );
}

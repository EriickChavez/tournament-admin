import { useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router";
import { useTournament } from "../features/tournaments/hooks/use-tournament";
import { EditTournamentForm } from "../features/tournaments/components/EditTournamentForm";
import { CategoriesSection } from "../features/categories/components/CategoriesSection";
import { TeamsSection } from "../features/teams/components/TeamsSection";
import { PlayersSection } from "../features/players/components/PlayersSection";
import { ImportSection } from "../features/imports/components/ImportSection";
import { MatchesSection } from "../features/matches/components/MatchesSection";
import { MembersSection } from "../features/members/components/MembersSection";
import { BrandingSection } from "../features/branding/components/BrandingSection";
import { SponsorsSection } from "../features/sponsors/components/SponsorsSection";

const ArrowLeftIcon = () => (
  <svg
    width="16"
    height="16"
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

type TabId =
  | "info"
  | "branding"
  | "categories"
  | "sponsors"
  | "teams"
  | "players"
  | "import"
  | "matches"
  | "members";

const TABS: { id: TabId; label: string }[] = [
  { id: "info", label: "Información" },
  { id: "branding", label: "Branding" },
  { id: "categories", label: "Categorías" },
  { id: "sponsors", label: "Sponsors" },
  { id: "teams", label: "Equipos" },
  { id: "players", label: "Jugadores" },
  { id: "import", label: "Importar" },
  { id: "matches", label: "Partidos" },
  { id: "members", label: "Miembros" },
];

export function EditTournamentPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useTournament(id);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>("info");

  if (isLoading)
    return (
      <div className="flex items-center justify-center gap-2.5 text-sm text-gray-400 py-24">
        <svg
          className="animate-spin text-primary"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <path d="M12 2a10 10 0 0 1 10 10" opacity="0.3" />
          <path d="M12 2a10 10 0 0 1 10 10" />
        </svg>
        Cargando torneo...
      </div>
    );

  if (isError || !data?.tournament) {
    return <Navigate to="/home" replace />;
  }

  const tournament = data.tournament;

  return (
    <div className="w-full">
      {/* Breadcrumb */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-6 group"
      >
        <span className="flex items-center justify-center w-7 h-7 rounded-lg border border-gray-200 bg-white text-gray-500 group-hover:border-gray-300 group-hover:bg-gray-50 group-hover:text-gray-700 transition-colors">
          <ArrowLeftIcon />
        </span>
        Torneos
      </button>

      {/* Title */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          {tournament.name}
        </h1>
        {tournament.subtitle && (
          <p className="text-sm text-gray-500 mt-1">{tournament.subtitle}</p>
        )}
      </div>

      {/* Tabs */}
      <div className="mb-8 border-b border-gray-200">
        <nav className="-mb-px flex gap-1 overflow-x-auto scrollbar-none">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={[
                  "relative shrink-0 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap",
                  isActive
                    ? "text-primary"
                    : "text-gray-500 hover:text-gray-800",
                ].join(" ")}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Solo una sección a la vez */}
      <div>
        {activeTab === "info" && (
          <EditTournamentForm
            tournament={tournament}
            onCancel={() => navigate(-1)}
          />
        )}

        {activeTab === "branding" && (
          <div className="rounded-2xl border border-gray-200/70 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
            <BrandingSection tournamentId={tournament.id} />
          </div>
        )}

        {activeTab === "categories" && (
          <div className="rounded-2xl border border-gray-200/70 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
            <CategoriesSection tournamentId={tournament.id} />
          </div>
        )}

        {activeTab === "sponsors" && (
          <div className="rounded-2xl border border-gray-200/70 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
            <SponsorsSection
              tournamentId={tournament.id}
              maxSponsors={tournament.maxSponsors ?? 0}
            />
          </div>
        )}

        {activeTab === "teams" && (
          <div className="rounded-2xl border border-gray-200/70 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
            <TeamsSection tournamentId={tournament.id} />
          </div>
        )}

        {activeTab === "players" && (
          <div className="rounded-2xl border border-gray-200/70 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
            <PlayersSection tournamentId={tournament.id} />
          </div>
        )}

        {activeTab === "import" && (
          <div className="rounded-2xl border border-gray-200/70 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
            <ImportSection tournamentId={tournament.id} />
          </div>
        )}

        {activeTab === "matches" && (
          <div className="rounded-2xl border border-gray-200/70 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
            <MatchesSection tournamentId={tournament.id} />
          </div>
        )}

        {activeTab === "members" && (
          <div className="rounded-2xl border border-gray-200/70 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
            <MembersSection tournamentId={tournament.id} />
          </div>
        )}
      </div>
    </div>
  );
}

import { useNavigate, useParams, Navigate } from "react-router";
import { useCategoryTeams } from "../../teams/hooks/use-category-teams";
import { usePhase } from "../hooks/use-phase";
import { usePhaseGroups } from "../hooks/use-phase-groups";
import { usePhaseTeams } from "../hooks/use-phase-teams";
import { PHASE_TYPE_LABELS } from "../types";
import { getPhaseErrorMessage } from "../utils/phase-error-message";
import { PhaseFixturesPanel } from "./PhaseFixturesPanel";
import { PhaseGroupsPanel } from "./PhaseGroupsPanel";
import { PhaseResultsPanel } from "./PhaseResultsPanel";
import { PhaseStandingsPanel } from "./PhaseStandingsPanel";
import { PhaseTeamsPanel } from "./PhaseTeamsPanel";

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
    <path d="m15 18-6-6 6-6" />
  </svg>
);

export function PhaseDetailPage() {
  const { tournamentId, categoryId, phaseId } = useParams<{
    tournamentId: string;
    categoryId: string;
    phaseId: string;
  }>();
  const navigate = useNavigate();

  const phaseQuery = usePhase(phaseId);
  const groupsQuery = usePhaseGroups(phaseId);
  const phaseTeamsQuery = usePhaseTeams(phaseId);
  const teamsQuery = useCategoryTeams(tournamentId, categoryId);

  if (!tournamentId || !categoryId || !phaseId) {
    return <Navigate to="/home" replace />;
  }

  const backPath = `/torneos/${tournamentId}/categorias/${categoryId}/fases`;

  if (
    phaseQuery.isLoading ||
    groupsQuery.isLoading ||
    phaseTeamsQuery.isLoading ||
    teamsQuery.isLoading
  ) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-gray-500">
        Cargando fase...
      </div>
    );
  }

  const error =
    phaseQuery.error ??
    groupsQuery.error ??
    phaseTeamsQuery.error ??
    teamsQuery.error;

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-6 text-center">
        <p className="text-sm text-red-700">{getPhaseErrorMessage(error)}</p>
        <button
          type="button"
          onClick={() => navigate(backPath)}
          className="mt-3 text-sm font-medium text-red-800 underline"
        >
          Volver a las fases
        </button>
      </div>
    );
  }

  const phase = phaseQuery.data?.phase;
  if (!phase) return <Navigate to={backPath} replace />;

  const groups = groupsQuery.data?.groups ?? [];
  const teams = teamsQuery.data?.teams ?? [];
  const assignments = phaseTeamsQuery.data?.teams ?? [];
  const isGroupPhase = phase.type === "group";

  return (
    <div className="w-full">
      <button
        onClick={() => navigate(backPath)}
        className="group mb-6 inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-800"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition-colors group-hover:border-gray-300 group-hover:bg-gray-50 group-hover:text-gray-700">
          <ArrowLeftIcon />
        </span>
        Volver a las fases
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          {phase.name}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {PHASE_TYPE_LABELS[phase.type]}
        </p>
      </div>

      <div className="space-y-6">
        {isGroupPhase && (
          <PhaseGroupsPanel phaseId={phase.id} groups={groups} />
        )}
        <PhaseTeamsPanel
          phase={phase}
          groups={groups}
          teams={teams}
          assignments={assignments}
        />
        {isGroupPhase && (
          <PhaseFixturesPanel
            tournamentId={tournamentId}
            categoryId={categoryId}
            phase={phase}
            groups={groups}
            teams={teams}
            assignments={assignments}
          />
        )}
        <PhaseResultsPanel
          tournamentId={tournamentId}
          phase={phase}
          groups={groups}
        />
        {isGroupPhase && (
          <PhaseStandingsPanel
            tournamentId={tournamentId}
            phaseId={phase.id}
            teams={teams}
          />
        )}
      </div>
    </div>
  );
}

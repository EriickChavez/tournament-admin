import { useMemo, useState } from "react";
import { usePhaseStandings } from "../hooks/use-phase-standings";
import { getPhaseErrorMessage } from "../utils/phase-error-message";
import type { StandingRow } from "../types";
import type { Team } from "../../teams/types";

interface PhaseStandingsPanelProps {
  tournamentId: string;
  phaseId: string;
  teams: Team[];
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const HEAD_CELL = "px-2 py-2 text-center font-medium";
const CELL = "px-2 py-1.5 text-center text-gray-700";

export function PhaseStandingsPanel({
  tournamentId,
  phaseId,
  teams,
}: PhaseStandingsPanelProps) {
  const [perGroup, setPerGroup] = useState(2);
  const [bestNext, setBestNext] = useState(0);

  const { data, isLoading, isFetching, error, refetch } = usePhaseStandings(
    tournamentId,
    phaseId,
    perGroup,
    bestNext,
  );

  const teamName = useMemo(() => {
    const map = new Map(teams.map((t) => [t.id, t.name]));
    return (id: string) => map.get(id) ?? "—";
  }, [teams]);

  const groupName = useMemo(() => {
    const map = new Map(data?.groups.map((g) => [g.group.id, g.group.name]));
    return (id: string | null) => (id ? (map.get(id) ?? "—") : "—");
  }, [data]);

  // Equipos que clasifican como mejores del siguiente puesto (para pintarlos distinto).
  const bestNextIds = useMemo(
    () =>
      new Set(
        data?.qualification?.qualified
          .filter((q) => q.via === "best_next")
          .map((q) => q.teamId),
      ),
    [data],
  );

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200/70 bg-white p-6 text-sm text-gray-500">
        Calculando posiciones...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-sm text-red-600">
        {getPhaseErrorMessage(error)}
      </div>
    );
  }

  const { progress, qualification } = data;
  const nextPlace = perGroup + 1;

  function renderRow(row: StandingRow) {
    const direct = row.position <= perGroup;
    const viaBest = bestNextIds.has(row.teamId);
    return (
      <tr
        key={row.teamId}
        className={[
          "border-t border-gray-100",
          direct ? "bg-green-50/70" : viaBest ? "bg-emerald-50/50" : "",
        ].join(" ")}
      >
        <td className={CELL}>{row.position}</td>
        <td className="px-2 py-1.5 text-left text-gray-800">
          <span>{teamName(row.teamId)}</span>
          {row.tieGroup !== null && (
            <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
              Empate
            </span>
          )}
          {viaBest && (
            <span className="ml-2 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
              Mejor {nextPlace}º
            </span>
          )}
        </td>
        <td className={CELL}>{row.played}</td>
        <td className={CELL}>{row.won}</td>
        <td className={CELL}>{row.drawn}</td>
        <td className={CELL}>{row.lost}</td>
        <td className={CELL}>{row.goalsFor}</td>
        <td className={CELL}>{row.goalsAgainst}</td>
        <td className={CELL}>{row.goalDifference}</td>
        <td className="px-2 py-1.5 text-center font-semibold text-gray-900">
          {row.points}
        </td>
      </tr>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-base font-bold text-gray-900">
            Posiciones y clasificación
          </h2>
          <p className="text-xs text-gray-500">
            {progress.finishedMatches} de {progress.expectedMatches} partidos de
            grupos terminados. Desempates: puntos, diferencia de goles, goles a
            favor y enfrentamiento directo.
          </p>
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="min-h-9 shrink-0 rounded-xl border border-gray-200 bg-white px-4 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          {isFetching ? "Actualizando..." : "Actualizar"}
        </button>
      </div>

      {progress.isComplete && (
        <div className="mb-4 rounded-xl border border-green-100 bg-green-50 p-3 text-sm text-green-700">
          Todos los partidos de grupos terminaron: la fase está lista para
          cerrarse.
        </div>
      )}

      <div className="mb-5 flex flex-wrap items-end gap-4 rounded-xl border border-gray-200 bg-gray-50/60 p-4">
        <label className="flex flex-col gap-1 text-xs text-gray-500">
          Clasifican por grupo
          <input
            type="number"
            min={1}
            max={32}
            value={perGroup}
            onChange={(e) =>
              setPerGroup(clamp(Number(e.target.value) || 1, 1, 32))
            }
            className="min-h-9 w-24 rounded-lg border border-gray-200 bg-white px-2 text-sm text-gray-800 outline-none focus:border-primary"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-gray-500">
          Mejores {nextPlace}º lugares que también pasan
          <input
            type="number"
            min={0}
            max={64}
            value={bestNext}
            onChange={(e) =>
              setBestNext(clamp(Number(e.target.value) || 0, 0, 64))
            }
            className="min-h-9 w-24 rounded-lg border border-gray-200 bg-white px-2 text-sm text-gray-800 outline-none focus:border-primary"
          />
        </label>
        {qualification && (
          <p className="pb-2 text-xs text-gray-500">
            Clasifican {qualification.qualified.length} equipos en total.
          </p>
        )}
      </div>

      {data.groups.length === 0 ? (
        <p className="py-6 text-center text-sm text-gray-500">
          Esta fase aún no tiene grupos.
        </p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {data.groups.map(({ group, standings }) => (
            <div
              key={group.id}
              className="overflow-hidden rounded-xl border border-gray-200"
            >
              <div className="bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-800">
                {group.name}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[26rem] text-xs">
                  <thead className="text-gray-500">
                    <tr>
                      <th className={HEAD_CELL}>#</th>
                      <th className="px-2 py-2 text-left font-medium">
                        Equipo
                      </th>
                      <th className={HEAD_CELL}>PJ</th>
                      <th className={HEAD_CELL}>G</th>
                      <th className={HEAD_CELL}>E</th>
                      <th className={HEAD_CELL}>P</th>
                      <th className={HEAD_CELL}>GF</th>
                      <th className={HEAD_CELL}>GC</th>
                      <th className={HEAD_CELL}>DG</th>
                      <th className={HEAD_CELL}>Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {standings.length === 0 ? (
                      <tr>
                        <td
                          colSpan={10}
                          className="px-3 py-4 text-center text-gray-400"
                        >
                          Sin equipos asignados
                        </td>
                      </tr>
                    ) : (
                      standings.map(renderRow)
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {qualification && qualification.bestNext > 0 && (
        <div className="mt-6">
          <h3 className="mb-2 text-sm font-semibold text-gray-800">
            Ranking de {nextPlace}º lugares
          </h3>
          <div className="max-h-96 overflow-auto rounded-xl border border-gray-200">
            <table className="w-full min-w-[30rem] text-xs">
              <thead className="sticky top-0 bg-gray-50 text-gray-500">
                <tr>
                  <th className={HEAD_CELL}>#</th>
                  <th className="px-2 py-2 text-left font-medium">Equipo</th>
                  <th className="px-2 py-2 text-left font-medium">Grupo</th>
                  <th className={HEAD_CELL}>DG</th>
                  <th className={HEAD_CELL}>GF</th>
                  <th className={HEAD_CELL}>Pts</th>
                  <th className={HEAD_CELL}>Pasa</th>
                </tr>
              </thead>
              <tbody>
                {qualification.bestNextRanking.map((entry, index) => (
                  <tr
                    key={entry.teamId}
                    className={[
                      "border-t border-gray-100",
                      entry.qualified ? "bg-emerald-50/50" : "",
                    ].join(" ")}
                  >
                    <td className={CELL}>{index + 1}</td>
                    <td className="px-2 py-1.5 text-left text-gray-800">
                      {teamName(entry.teamId)}
                    </td>
                    <td className="px-2 py-1.5 text-left text-gray-600">
                      {groupName(entry.groupId)}
                    </td>
                    <td className={CELL}>{entry.goalDifference}</td>
                    <td className={CELL}>{entry.goalsFor}</td>
                    <td className="px-2 py-1.5 text-center font-semibold text-gray-900">
                      {entry.points}
                    </td>
                    <td className={CELL}>{entry.qualified ? "Sí" : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {qualification && qualification.pendingTies.length > 0 && (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <h3 className="text-sm font-semibold text-amber-800">
            Empates por resolver
          </h3>
          <p className="mb-2 text-xs text-amber-700">
            Siguen empatados tras todos los desempates automáticos y afectan
            quién clasifica. Requieren decisión manual del administrador.
          </p>
          <ul className="space-y-1 text-sm text-amber-900">
            {qualification.pendingTies.map((tie, index) => (
              <li key={index}>
                <strong>
                  {tie.scope === "group"
                    ? groupName(tie.groupId)
                    : `Mejores ${nextPlace}º lugares`}
                  :
                </strong>{" "}
                {tie.teamIds.map(teamName).join(", ")}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

import { useMemo, useState } from "react";
import { usePhaseStandings } from "../hooks/use-phase-standings";
import { useSetManualRanks } from "../hooks/use-set-manual-ranks";
import { useClosePhase } from "../hooks/use-close-phase";
import { useReopenPhase } from "../hooks/use-reopen-phase";
import { getPhaseErrorMessage } from "../utils/phase-error-message";
import { PhaseTieResolver } from "./PhaseTieResolver";
import type { StandingRow } from "../types";
import type { Team } from "../../teams/types";

interface PhaseStandingsPanelProps {
  tournamentId: string;
  phaseId: string;
  teams: Team[];
}

interface GroupTie {
  key: string;
  groupName: string;
  rows: StandingRow[];
  affectsQualification: boolean;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const HEAD_CELL = "px-2 py-2 text-center font-medium";
const CELL = "px-2 py-1.5 text-center text-gray-700";

function CheckItem({
  ok,
  children,
}: {
  ok: boolean;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-2 text-sm">
      <span
        className={[
          "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
          ok ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400",
        ].join(" ")}
      >
        {ok ? "✓" : "○"}
      </span>
      <span className={ok ? "text-gray-700" : "text-gray-500"}>{children}</span>
    </li>
  );
}

export function PhaseStandingsPanel({
  tournamentId,
  phaseId,
  teams,
}: PhaseStandingsPanelProps) {
  const [perGroup, setPerGroup] = useState(2);
  const [bestNext, setBestNext] = useState(0);
  const [actionError, setActionError] = useState<string | null>(null);
  const [syncedClosureAt, setSyncedClosureAt] = useState<string | null>(null);

  const { data, isLoading, isFetching, error, refetch } = usePhaseStandings(
    tournamentId,
    phaseId,
    perGroup,
    bestNext,
  );
  const setRanks = useSetManualRanks(tournamentId, phaseId);
  const closePhase = useClosePhase(tournamentId, phaseId);
  const reopenPhase = useReopenPhase(tournamentId, phaseId);

  const closure = data?.closure ?? null;

  // Con la fase cerrada, los números de clasificación son los del cierre. Se ajusta durante
  // el render (patrón recomendado por React) en vez de con un useEffect.
  if (closure && syncedClosureAt !== closure.closedAt) {
    setSyncedClosureAt(closure.closedAt);
    setPerGroup(closure.qualifiersPerGroup);
    setBestNext(closure.bestNextCount);
  }
  if (!closure && syncedClosureAt !== null) {
    setSyncedClosureAt(null);
  }

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

  // Empates que siguen sin resolver dentro de cada grupo (los que afectan la
  // clasificación van primero).
  const groupTies = useMemo(() => {
    const pending = data?.qualification?.pendingTies ?? [];
    const ties: GroupTie[] = [];
    for (const { group, standings } of data?.groups ?? []) {
      const byTie = new Map<number, StandingRow[]>();
      for (const row of standings) {
        if (row.tieGroup === null) continue;
        byTie.set(row.tieGroup, [...(byTie.get(row.tieGroup) ?? []), row]);
      }
      for (const [tieGroup, rows] of byTie) {
        ties.push({
          key: `${group.id}:${tieGroup}`,
          groupName: group.name,
          rows,
          affectsQualification: pending.some(
            (p) =>
              p.scope === "group" &&
              p.groupId === group.id &&
              rows.some((r) => p.teamIds.includes(r.teamId)),
          ),
        });
      }
    }
    return ties.sort(
      (a, b) => Number(b.affectsQualification) - Number(a.affectsQualification),
    );
  }, [data]);

  const bestNextTie = data?.qualification?.pendingTies.find(
    (p) => p.scope === "best_next",
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

  const { progress, qualification, manualRanks } = data;
  const nextPlace = perGroup + 1;
  const isClosed = closure !== null;

  // Requisitos para poder cerrar la fase.
  const candidates = qualification?.bestNextRanking.length ?? 0;
  const pendingTiesCount = qualification?.pendingTies.length ?? 0;
  const configOk = bestNext <= candidates;
  const canClose =
    !isClosed &&
    progress.isComplete &&
    pendingTiesCount === 0 &&
    configOk &&
    qualification !== null &&
    qualification.qualified.length > 0;

  function handleClose() {
    if (!qualification) return;
    const detail =
      bestNext > 0
        ? `${perGroup} por grupo + ${bestNext} mejores ${nextPlace}º lugares`
        : `${perGroup} por grupo`;
    const ok = window.confirm(
      `Vas a cerrar la fase con ${qualification.qualified.length} clasificados (${detail}).\n\nSe guardará la lista de clasificados. Podrás reabrir la fase si te equivocas.\n\n¿Continuar?`,
    );
    if (!ok) return;
    setActionError(null);
    closePhase.mutate(
      { perGroup, bestNext },
      { onError: (err) => setActionError(getPhaseErrorMessage(err)) },
    );
  }

  function handleReopen() {
    const ok = window.confirm(
      "Reabrir la fase borra la lista de clasificados guardada y permite volver a editar resultados y desempates.\n\n¿Reabrir la fase?",
    );
    if (!ok) return;
    setActionError(null);
    reopenPhase.mutate(undefined, {
      onError: (err) => setActionError(getPhaseErrorMessage(err)),
    });
  }

  // El número que se guarda es la posición de la tabla que ocupa cada equipo: así dos
  // empates distintos del mismo grupo nunca repiten número y el backend no los rechaza.
  function saveGroupTie(assignment: Map<string, number>) {
    setActionError(null);
    const ranks: { teamId: string; rank: number }[] = [];
    for (const { standings } of data!.groups) {
      for (const row of standings) {
        const chosen = assignment.get(row.teamId);
        if (chosen !== undefined) {
          ranks.push({ teamId: row.teamId, rank: chosen });
        } else if (row.resolvedManually) {
          // El backend reemplaza todo: se conservan las decisiones ya vigentes.
          ranks.push({ teamId: row.teamId, rank: row.position });
        }
      }
    }
    setRanks.mutate(
      { scope: "group", ranks },
      { onError: (err) => setActionError(getPhaseErrorMessage(err)) },
    );
  }

  function saveBestNextTie(assignment: Map<string, number>) {
    setActionError(null);
    setRanks.mutate(
      {
        scope: "best_next",
        ranks: [...assignment].map(([teamId, rank]) => ({ teamId, rank })),
      },
      { onError: (err) => setActionError(getPhaseErrorMessage(err)) },
    );
  }

  async function handleClearAll() {
    if (
      !window.confirm(
        "¿Quitar todas las decisiones manuales de desempate de esta fase?",
      )
    ) {
      return;
    }
    setActionError(null);
    try {
      await setRanks.mutateAsync({ scope: "group", ranks: [] });
      await setRanks.mutateAsync({ scope: "best_next", ranks: [] });
    } catch (err) {
      setActionError(getPhaseErrorMessage(err));
    }
  }

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
          {row.resolvedManually && (
            <span className="ml-2 rounded bg-sky-100 px-1.5 py-0.5 text-[10px] font-semibold text-sky-700">
              Desempate manual
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
            favor, enfrentamiento directo y decisión manual.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {manualRanks.length > 0 && !isClosed && (
            <button
              type="button"
              onClick={handleClearAll}
              disabled={setRanks.isPending}
              className="min-h-9 shrink-0 rounded-xl border border-gray-200 bg-white px-4 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Quitar desempates manuales ({manualRanks.length})
            </button>
          )}
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="min-h-9 shrink-0 rounded-xl border border-gray-200 bg-white px-4 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            {isFetching ? "Actualizando..." : "Actualizar"}
          </button>
        </div>
      </div>

      {/* Fase cerrada: lista de clasificados guardada */}
      {closure && (
        <div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-sm font-semibold text-green-800">
                Fase cerrada
              </h3>
              <p className="text-xs text-green-700">
                Cerrada el{" "}
                {new Date(closure.closedAt).toLocaleString("es-MX", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
                . Clasificaron {closure.qualified.length} equipos (
                {closure.qualifiersPerGroup} por grupo
                {closure.bestNextCount > 0
                  ? ` + ${closure.bestNextCount} mejores ${closure.qualifiersPerGroup + 1}º lugares`
                  : ""}
                ).
              </p>
            </div>
            <button
              type="button"
              onClick={handleReopen}
              disabled={reopenPhase.isPending}
              className="min-h-9 shrink-0 rounded-xl border border-green-300 bg-white px-4 text-xs font-medium text-green-800 hover:bg-green-100 disabled:opacity-50"
            >
              {reopenPhase.isPending ? "Reabriendo..." : "Reabrir fase"}
            </button>
          </div>

          <div className="mt-3 max-h-80 overflow-auto rounded-lg border border-green-200 bg-white">
            <table className="w-full min-w-[26rem] text-xs">
              <thead className="sticky top-0 bg-green-50 text-green-800">
                <tr>
                  <th className="px-2 py-2 text-left font-medium">Equipo</th>
                  <th className="px-2 py-2 text-left font-medium">Grupo</th>
                  <th className={HEAD_CELL}>Pos.</th>
                  <th className="px-2 py-2 text-left font-medium">Pasó como</th>
                  <th className={HEAD_CELL}>DG</th>
                  <th className={HEAD_CELL}>Pts</th>
                </tr>
              </thead>
              <tbody>
                {closure.qualified.map((item) => (
                  <tr key={item.teamId} className="border-t border-green-100">
                    <td className="px-2 py-1.5 text-gray-800">
                      {teamName(item.teamId)}
                    </td>
                    <td className="px-2 py-1.5 text-gray-600">
                      {groupName(item.groupId)}
                    </td>
                    <td className={CELL}>{item.position}º</td>
                    <td className="px-2 py-1.5 text-gray-600">
                      {item.via === "group"
                        ? "Directo"
                        : `Mejor ${item.position}º`}
                    </td>
                    <td className={CELL}>{item.goalDifference}</td>
                    <td className="px-2 py-1.5 text-center font-semibold text-gray-900">
                      {item.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
            disabled={isClosed}
            onChange={(e) =>
              setPerGroup(clamp(Number(e.target.value) || 1, 1, 32))
            }
            className="min-h-9 w-24 rounded-lg border border-gray-200 bg-white px-2 text-sm text-gray-800 outline-none focus:border-primary disabled:bg-gray-100 disabled:text-gray-500"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-gray-500">
          Mejores {nextPlace}º lugares que también pasan
          <input
            type="number"
            min={0}
            max={64}
            value={bestNext}
            disabled={isClosed}
            onChange={(e) =>
              setBestNext(clamp(Number(e.target.value) || 0, 0, 64))
            }
            className="min-h-9 w-24 rounded-lg border border-gray-200 bg-white px-2 text-sm text-gray-800 outline-none focus:border-primary disabled:bg-gray-100 disabled:text-gray-500"
          />
        </label>
        {qualification && (
          <p className="pb-2 text-xs text-gray-500">
            Clasifican {qualification.qualified.length} equipos en total.
            {isClosed && " Valores fijados por el cierre de la fase."}
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

      {!isClosed && (groupTies.length > 0 || bestNextTie) && (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <h3 className="text-sm font-semibold text-amber-800">
            Empates por resolver
          </h3>
          <p className="mb-3 text-xs text-amber-700">
            Siguen empatados tras todos los desempates automáticos. Elige la
            posición de cada equipo y guarda la decisión.
          </p>
          <div className="space-y-3">
            {groupTies.map((tie) => (
              <PhaseTieResolver
                key={tie.key}
                title={tie.groupName}
                affectsQualification={tie.affectsQualification}
                teams={tie.rows.map((row) => ({
                  teamId: row.teamId,
                  name: teamName(row.teamId),
                }))}
                positions={tie.rows
                  .map((row) => row.position)
                  .sort((a, b) => a - b)}
                isSaving={setRanks.isPending}
                onSave={saveGroupTie}
              />
            ))}
            {bestNextTie && qualification && (
              <PhaseTieResolver
                key="best-next"
                title={`Mejores ${nextPlace}º lugares`}
                affectsQualification
                teams={bestNextTie.teamIds.map((teamId) => ({
                  teamId,
                  name: teamName(teamId),
                }))}
                positions={bestNextTie.teamIds
                  .map(
                    (teamId) =>
                      qualification.bestNextRanking.findIndex(
                        (entry) => entry.teamId === teamId,
                      ) + 1,
                  )
                  .sort((a, b) => a - b)}
                isSaving={setRanks.isPending}
                onSave={saveBestNextTie}
              />
            )}
          </div>
        </div>
      )}

      {/* Cierre de fase: requisitos y botón */}
      {!isClosed && (
        <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50/60 p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-800">
                Cierre de fase
              </h3>
              <p className="mb-2 text-xs text-gray-500">
                El cierre es manual: guarda la lista de clasificados con la
                configuración de arriba.
              </p>
              <ul className="space-y-1.5">
                <CheckItem ok={progress.isComplete}>
                  {progress.finishedMatches} de {progress.expectedMatches}{" "}
                  partidos de grupos terminados
                </CheckItem>
                <CheckItem ok={pendingTiesCount === 0}>
                  {pendingTiesCount === 0
                    ? "Sin empates pendientes que afecten la clasificación"
                    : `${pendingTiesCount} empate(s) pendiente(s) que afectan la clasificación`}
                </CheckItem>
                <CheckItem ok={configOk}>
                  {configOk
                    ? "Configuración de clasificación válida"
                    : `Pides ${bestNext} mejores ${nextPlace}º lugares, pero solo hay ${candidates} candidatos`}
                </CheckItem>
              </ul>
            </div>
            <button
              type="button"
              onClick={handleClose}
              disabled={!canClose || closePhase.isPending}
              className="min-h-10 shrink-0 rounded-xl bg-primary px-5 text-xs font-medium text-white hover:opacity-90 disabled:opacity-50"
            >
              {closePhase.isPending ? "Cerrando..." : "Cerrar fase"}
            </button>
          </div>
        </div>
      )}

      {actionError && (
        <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600">
          {actionError}
        </div>
      )}
    </div>
  );
}

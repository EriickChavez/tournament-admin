import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { matchesApi } from "../../matches/api/matches-api";
import { useMatches } from "../../matches/hooks/use-matches";
import { useMatchGroupNames } from "../../matches/hooks/use-match-group-names";
import { MATCH_STATUS_LABELS } from "../../matches/types";
import { getMatchErrorMessage } from "../../matches/utils/match-error-message";
import { MatchEventsModal } from "../../match-events/components/MatchEventsModal";
import type { Match } from "../../matches/types";
import type { Phase, PhaseGroup } from "../types";

interface PhaseResultsPanelProps {
  tournamentId: string;
  phase: Phase;
  groups: PhaseGroup[];
}

export function PhaseResultsPanel({
  tournamentId,
  phase,
  groups,
}: PhaseResultsPanelProps) {
  const queryClient = useQueryClient();
  const matchesQuery = useMatches(tournamentId, 1, 100, { phaseId: phase.id });
  const matches = useMemo(
    () => matchesQuery.data?.matches ?? [],
    [matchesQuery.data],
  );
  const groupNameById = useMatchGroupNames(matches);

  const [groupFilter, setGroupFilter] = useState("");
  const [eventsMatch, setEventsMatch] = useState<Match | null>(null);
  const [isFinishing, setIsFinishing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  const sortedGroups = useMemo(
    () =>
      [...groups].sort(
        (a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name),
      ),
    [groups],
  );

  const sortedMatches = useMemo(() => {
    return [...matches].sort((a, b) => {
      const gA = a.phaseGroupId ?? "";
      const gB = b.phaseGroupId ?? "";
      if (gA !== gB) return gA.localeCompare(gB);
      const rA = a.round ?? 0;
      const rB = b.round ?? 0;
      if (rA !== rB) return rA - rB;
      return (
        new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
      );
    });
  }, [matches]);

  const visible = useMemo(() => {
    if (!groupFilter) return sortedMatches;
    return sortedMatches.filter((m) => m.phaseGroupId === groupFilter);
  }, [sortedMatches, groupFilter]);

  // Partidos en curso, más los programados que ya traen marcador de antes de la cédula
  // (esos primero se inician y luego se finalizan).
  const pendingMatches = matches.filter(
    (m) =>
      m.status === "in_progress" ||
      ((m.status === "scheduled" || m.status === "postponed") &&
        m.homeScore != null &&
        m.awayScore != null),
  );

  async function handleFinalizeAllWithScore() {
    if (pendingMatches.length === 0) return;
    setIsFinishing(true);
    setSummary(null);
    let count = 0;
    try {
      for (const m of pendingMatches) {
        if (m.status !== "in_progress") await matchesApi.start(m.id);
        await matchesApi.finish(m.id);
        count++;
      }
      setSummary(`Se finalizaron ${count} partidos.`);
    } catch (err) {
      setSummary(
        `Se finalizaron ${count} partidos. ${getMatchErrorMessage(err)}`,
      );
    } finally {
      // Aunque falle uno, los anteriores ya cambiaron: se refresca siempre.
      await queryClient.invalidateQueries({
        queryKey: ["tournaments", tournamentId, "matches"],
      });
      setIsFinishing(false);
    }
  }

  if (matchesQuery.isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200/70 bg-white p-6 text-sm text-gray-500">
        Cargando resultados...
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-500">
        Esta fase aún no tiene partidos. Créalos en el calendario para poder
        capturar resultados.
      </div>
    );
  }

  const finishedCount = matches.filter((m) => m.status === "finished").length;

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-base font-bold text-gray-900">
            Resultados & Cédulas
          </h2>
          <p className="text-xs text-gray-500">
            {finishedCount} de {matches.length} partidos finalizados. Haz clic
            en el marcador para registrar goles, goleadores y minutos.
          </p>
          {(matchesQuery.data?.pagination.total ?? 0) > 100 && (
            <p className="text-xs text-amber-600">
              Se muestran los primeros 100 partidos de la fase.
            </p>
          )}
        </div>
        {pendingMatches.length > 0 && (
          <button
            type="button"
            onClick={handleFinalizeAllWithScore}
            disabled={isFinishing}
            className="min-h-9 shrink-0 rounded-xl bg-primary px-4 text-xs font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            {isFinishing
              ? "Finalizando..."
              : `Finalizar partidos en curso (${pendingMatches.length})`}
          </button>
        )}
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        {sortedGroups.length > 0 && (
          <select
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
            className="min-h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-primary"
          >
            <option value="">Todos los grupos</option>
            {sortedGroups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="max-h-[36rem] overflow-auto rounded-xl border border-gray-200">
        <table className="w-full min-w-[44rem] text-sm">
          <thead className="sticky top-0 bg-gray-50 text-left text-xs text-gray-500">
            <tr>
              <th className="px-3 py-2 font-medium">Grupo</th>
              <th className="w-14 px-3 py-2 font-medium">Jor.</th>
              <th className="px-3 py-2 text-right font-medium">Local</th>
              <th className="w-48 px-3 py-2 text-center font-medium">
                Marcador / Eventos
              </th>
              <th className="px-3 py-2 font-medium">Visitante</th>
              <th className="w-28 px-3 py-2 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((match) => {
              const groupName = match.phaseGroupId
                ? groupNameById.get(match.phaseGroupId)
                : undefined;
              return (
                <tr
                  key={match.id}
                  className="border-t border-gray-100 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-3 py-2 text-gray-600">
                    {groupName ?? "—"}
                  </td>
                  <td className="px-3 py-2 text-gray-600">
                    {match.round ?? "—"}
                  </td>
                  <td className="px-3 py-2 text-right font-medium text-gray-800">
                    {match.homeTeam?.name ?? "—"}
                  </td>
                  <td className="px-3 py-2 text-center">
                    <button
                      type="button"
                      onClick={() => setEventsMatch(match)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:border-emerald-500 hover:bg-emerald-50/70 transition-all shadow-xs group"
                      title="Registrar goles, jugadores y minutos"
                    >
                      <span className="tabular-nums font-bold text-sm text-gray-900 group-hover:text-emerald-700">
                        {match.homeScore != null && match.awayScore != null
                          ? `${match.homeScore} - ${match.awayScore}`
                          : "0 - 0"}
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200 group-hover:bg-emerald-100">
                        ⚽ Cédula
                      </span>
                    </button>
                  </td>
                  <td className="px-3 py-2 font-medium text-gray-800">
                    {match.awayTeam?.name ?? "—"}
                  </td>
                  <td className="px-3 py-2 text-xs text-gray-500">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium ${
                        match.status === "finished"
                          ? "bg-green-50 text-green-700"
                          : match.status === "in_progress"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {MATCH_STATUS_LABELS[match.status]}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {summary && (
        <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
          {summary}
        </div>
      )}

      <MatchEventsModal
        isOpen={Boolean(eventsMatch)}
        onClose={() => setEventsMatch(null)}
        match={eventsMatch}
        tournamentId={tournamentId}
      />
    </div>
  );
}

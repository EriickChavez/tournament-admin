import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { matchesApi } from "../../matches/api/matches-api";
import { useMatches } from "../../matches/hooks/use-matches";
import { useMatchGroupNames } from "../../matches/hooks/use-match-group-names";
import { getMatchErrorMessage } from "../../matches/utils/match-error-message";
import { MATCH_STATUS_LABELS } from "../../matches/types";
import type { Match } from "../../matches/types";
import type { Phase, PhaseGroup } from "../types";

interface PhaseResultsPanelProps {
  tournamentId: string;
  phase: Phase;
  groups: PhaseGroup[];
}

interface ScoreEdit {
  home: string;
  away: string;
}

const savedHome = (m: Match) =>
  m.homeScore != null ? String(m.homeScore) : "";
const savedAway = (m: Match) =>
  m.awayScore != null ? String(m.awayScore) : "";

// Goles de prueba: sobre todo 0 a 3, con algún 4 de vez en cuando.
const randomGoals = () =>
  Math.random() < 0.15 ? 4 : Math.floor(Math.random() * 4);

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

  const [edits, setEdits] = useState<Record<string, ScoreEdit>>({});
  const [groupFilter, setGroupFilter] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [progress, setProgress] = useState(0);
  const [rowErrors, setRowErrors] = useState<Record<string, string>>({});
  const [summary, setSummary] = useState<string | null>(null);

  const sortedGroups = useMemo(
    () =>
      [...groups].sort(
        (a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name),
      ),
    [groups],
  );

  // Orden estable: por grupo, jornada y hora.
  const sortedMatches = useMemo(() => {
    const nameOf = (m: Match) =>
      (m.phaseGroupId && groupNameById.get(m.phaseGroupId)) || "";
    return [...matches].sort(
      (a, b) =>
        nameOf(a).localeCompare(nameOf(b)) ||
        (a.round ?? 0) - (b.round ?? 0) ||
        a.scheduledAt.localeCompare(b.scheduledAt),
    );
  }, [matches, groupNameById]);

  const visible = groupFilter
    ? sortedMatches.filter((m) => m.phaseGroupId === groupFilter)
    : sortedMatches;

  function rowState(match: Match) {
    const edit = edits[match.id];
    const home = edit?.home ?? savedHome(match);
    const away = edit?.away ?? savedAway(match);
    return {
      home,
      away,
      dirty: home !== savedHome(match) || away !== savedAway(match),
      // Marcador a medias: el backend lo rechazaría.
      partial: (home === "") !== (away === ""),
    };
  }

  function updateScore(match: Match, side: "home" | "away", value: string) {
    setSummary(null);
    const clean = value.replace(/\D/g, "").slice(0, 2);
    setEdits((prev) => {
      const base = prev[match.id] ?? {
        home: savedHome(match),
        away: savedAway(match),
      };
      return { ...prev, [match.id]: { ...base, [side]: clean } };
    });
  }

  const dirtyMatches = matches.filter((m) => rowState(m).dirty);
  const hasPartial = dirtyMatches.some((m) => rowState(m).partial);

  function handleFillRandom() {
    const targets = visible.filter((m) => {
      const state = rowState(m);
      return m.homeScore == null && state.home === "" && state.away === "";
    });
    if (targets.length === 0) return;
    const ok = window.confirm(
      `Se llenarán ${targets.length} marcadores con valores aleatorios (solo para pruebas).\n\nNo se guarda nada hasta que pulses "Guardar resultados". ¿Continuar?`,
    );
    if (!ok) return;
    setSummary(null);
    setEdits((prev) => {
      const next = { ...prev };
      for (const m of targets) {
        next[m.id] = {
          home: String(randomGoals()),
          away: String(randomGoals()),
        };
      }
      return next;
    });
  }

  async function handleSave() {
    setIsSaving(true);
    setProgress(0);
    setRowErrors({});
    setSummary(null);

    const errors: Record<string, string> = {};
    const saved: string[] = [];
    let done = 0;

    // En serie: así cada error se asocia a su fila.
    for (const match of dirtyMatches) {
      const state = rowState(match);
      const clearing = state.home === "" && state.away === "";
      try {
        await matchesApi.update(
          match.id,
          clearing
            ? { homeScore: null, awayScore: null, status: "scheduled" }
            : {
                homeScore: Number(state.home),
                awayScore: Number(state.away),
                status: "finished",
              },
        );
        saved.push(match.id);
      } catch (err) {
        errors[match.id] = getMatchErrorMessage(err);
      }
      done += 1;
      setProgress(done);
    }

    // Las filas guardadas dejan de ser "pendientes"; las fallidas conservan su edición.
    setEdits((prev) => {
      const next = { ...prev };
      for (const id of saved) delete next[id];
      return next;
    });
    setRowErrors(errors);
    const failed = Object.keys(errors).length;
    setSummary(
      failed === 0
        ? `Se guardaron ${saved.length} resultados.`
        : `Se guardaron ${saved.length} resultados; ${failed} fallaron (revisa las filas marcadas).`,
    );
    setIsSaving(false);
    // Una sola vez al final.
    await queryClient.invalidateQueries({
      queryKey: ["tournaments", tournamentId, "matches"],
    });
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

  const finishedCount = matches.filter(
    (m) => m.homeScore != null && m.awayScore != null,
  ).length;

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-base font-bold text-gray-900">Resultados</h2>
          <p className="text-xs text-gray-500">
            {finishedCount} de {matches.length} partidos con marcador. Al
            guardar, el partido queda como finalizado.
          </p>
          {(matchesQuery.data?.pagination.total ?? 0) > 100 && (
            <p className="text-xs text-amber-600">
              Se muestran los primeros 100 partidos de la fase.
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={dirtyMatches.length === 0 || hasPartial || isSaving}
          className="min-h-9 shrink-0 rounded-xl bg-primary px-4 text-xs font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          {isSaving
            ? `Guardando ${progress}/${dirtyMatches.length}...`
            : `Guardar resultados (${dirtyMatches.length})`}
        </button>
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
        <button
          type="button"
          onClick={handleFillRandom}
          disabled={isSaving}
          className="min-h-10 rounded-xl border border-gray-200 bg-white px-4 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          title="Llena marcadores vacíos con valores al azar; no guarda nada hasta que pulses Guardar"
        >
          Rellenar aleatorios (solo pruebas)
        </button>
      </div>

      <div className="max-h-[36rem] overflow-auto rounded-xl border border-gray-200">
        <table className="w-full min-w-[44rem] text-sm">
          <thead className="sticky top-0 bg-gray-50 text-left text-xs text-gray-500">
            <tr>
              <th className="px-3 py-2 font-medium">Grupo</th>
              <th className="w-14 px-3 py-2 font-medium">Jor.</th>
              <th className="px-3 py-2 text-right font-medium">Local</th>
              <th className="w-32 px-3 py-2 text-center font-medium">
                Marcador
              </th>
              <th className="px-3 py-2 font-medium">Visitante</th>
              <th className="w-28 px-3 py-2 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((match) => {
              const state = rowState(match);
              const error = rowErrors[match.id];
              const groupName = match.phaseGroupId
                ? groupNameById.get(match.phaseGroupId)
                : undefined;
              return (
                <tr
                  key={match.id}
                  className={[
                    "border-t border-gray-100 align-top",
                    error ? "bg-red-50/60" : state.dirty ? "bg-blue-50/40" : "",
                  ].join(" ")}
                >
                  <td className="px-3 py-2 text-gray-600">
                    {groupName ?? "—"}
                  </td>
                  <td className="px-3 py-2 text-gray-600">
                    {match.round ?? "—"}
                  </td>
                  <td className="px-3 py-2 text-right text-gray-800">
                    {match.homeTeam?.name ?? "—"}
                  </td>
                  <td className="px-3 py-1.5">
                    <div className="flex items-center justify-center gap-1.5">
                      <input
                        type="text"
                        inputMode="numeric"
                        value={state.home}
                        onChange={(e) =>
                          updateScore(match, "home", e.target.value)
                        }
                        className={[
                          "min-h-9 w-12 rounded-lg border px-2 text-center text-sm outline-none focus:border-primary",
                          state.partial ? "border-red-300" : "border-gray-200",
                        ].join(" ")}
                      />
                      <span className="text-gray-400">-</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={state.away}
                        onChange={(e) =>
                          updateScore(match, "away", e.target.value)
                        }
                        className={[
                          "min-h-9 w-12 rounded-lg border px-2 text-center text-sm outline-none focus:border-primary",
                          state.partial ? "border-red-300" : "border-gray-200",
                        ].join(" ")}
                      />
                    </div>
                    {error && (
                      <p className="mt-1 text-center text-xs text-red-600">
                        {error}
                      </p>
                    )}
                    {state.partial && !error && (
                      <p className="mt-1 text-center text-xs text-red-600">
                        Completa ambos
                      </p>
                    )}
                  </td>
                  <td className="px-3 py-2 text-gray-800">
                    {match.awayTeam?.name ?? "—"}
                  </td>
                  <td className="px-3 py-2 text-xs text-gray-500">
                    {MATCH_STATUS_LABELS[match.status]}
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
    </div>
  );
}

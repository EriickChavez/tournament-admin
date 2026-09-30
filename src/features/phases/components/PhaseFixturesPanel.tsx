import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { matchesApi } from "../../matches/api/matches-api";
import { useMatches } from "../../matches/hooks/use-matches";
import { datetimeLocalToIso } from "../../matches/utils/datetime";
import { getMatchErrorMessage } from "../../matches/utils/match-error-message";
import { roundRobin } from "../utils/round-robin";
import type { Phase, PhaseGroup, PhaseTeam } from "../types";
import type { Team } from "../../teams/types";

interface PhaseFixturesPanelProps {
  tournamentId: string;
  categoryId: string;
  phase: Phase;
  groups: PhaseGroup[];
  teams: Team[];
  assignments: PhaseTeam[];
}

interface Fixture {
  key: string;
  groupId: string;
  groupName: string;
  round: number;
  homeId: string;
  awayId: string;
}

interface RowEdit {
  datetime?: string;
  venue?: string;
  swapped?: boolean;
  round?: number;
}

// Clave sin orden: "A vs B" y "B vs A" son el mismo cruce.
const pairKey = (a: string, b: string) => [a, b].sort().join("|");

export function PhaseFixturesPanel({
  tournamentId,
  categoryId,
  phase,
  groups,
  teams,
  assignments,
}: PhaseFixturesPanelProps) {
  const queryClient = useQueryClient();
  // Partidos que la fase ya tiene (la API permite hasta 100 por página).
  const matchesQuery = useMatches(tournamentId, 1, 100, { phaseId: phase.id });

  const [edits, setEdits] = useState<Record<string, RowEdit>>({});
  const [defaultDatetime, setDefaultDatetime] = useState("");
  const [groupFilter, setGroupFilter] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  const [rowErrors, setRowErrors] = useState<Record<string, string>>({});
  const [summary, setSummary] = useState<string | null>(null);

  const teamById = useMemo(() => new Map(teams.map((t) => [t.id, t])), [teams]);

  const existingPairs = useMemo(() => {
    const set = new Set<string>();
    for (const match of matchesQuery.data?.matches ?? []) {
      set.add(pairKey(match.homeTeamId, match.awayTeamId));
    }
    return set;
  }, [matchesQuery.data]);

  const sortedGroups = useMemo(
    () =>
      [...groups].sort(
        (a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name),
      ),
    [groups],
  );

  // Cruces que faltan por crear: todos contra todos por grupo, menos los que ya existen.
  const fixtures = useMemo(() => {
    const result: Fixture[] = [];
    for (const group of sortedGroups) {
      const groupTeams = assignments
        .filter((a) => a.phaseGroupId === group.id)
        .map((a) => teamById.get(a.teamId))
        .filter((t): t is Team => t !== undefined)
        .sort((a, b) => a.name.localeCompare(b.name, "es"));

      for (const f of roundRobin(groupTeams)) {
        if (existingPairs.has(pairKey(f.home.id, f.away.id))) continue;
        result.push({
          key: `${group.id}:${f.home.id}:${f.away.id}`,
          groupId: group.id,
          groupName: group.name,
          round: f.round,
          homeId: f.home.id,
          awayId: f.away.id,
        });
      }
    }
    return result;
  }, [sortedGroups, assignments, teamById, existingPairs]);

  function resolve(f: Fixture) {
    const edit = edits[f.key] ?? {};
    const swapped = edit.swapped ?? false;
    return {
      homeId: swapped ? f.awayId : f.homeId,
      awayId: swapped ? f.homeId : f.awayId,
      round: edit.round ?? f.round,
      datetime: edit.datetime ?? "",
      venue: edit.venue ?? "",
    };
  }

  function updateEdit(key: string, patch: RowEdit) {
    setSummary(null);
    setEdits((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));
  }

  const visible = groupFilter
    ? fixtures.filter((f) => f.groupId === groupFilter)
    : fixtures;
  const withDate = fixtures.filter((f) => resolve(f).datetime !== "");
  // "Crear todos" necesita una fecha para cada cruce: la propia o la de por defecto.
  const canCreateAll =
    fixtures.length > 0 &&
    (defaultDatetime !== "" || withDate.length === fixtures.length);

  async function createMatches(targets: Fixture[]) {
    setIsCreating(true);
    setProgress(0);
    setTotal(targets.length);
    setRowErrors({});
    setSummary(null);

    const errors: Record<string, string> = {};
    let created = 0;
    let done = 0;

    // En serie: así cada error se asocia a su fila y no se satura el servidor.
    for (const f of targets) {
      const row = resolve(f);
      try {
        await matchesApi.create(tournamentId, {
          categoryId,
          homeTeamId: row.homeId,
          awayTeamId: row.awayId,
          // La fecha propia de la fila manda; si no tiene, se usa la de por defecto.
          scheduledAt: datetimeLocalToIso(row.datetime || defaultDatetime),
          ...(row.venue.trim() ? { venue: row.venue.trim() } : {}),
          phaseId: phase.id,
          phaseGroupId: f.groupId,
          round: row.round,
        });
        created += 1;
      } catch (err) {
        errors[f.key] = getMatchErrorMessage(err);
      }
      done += 1;
      setProgress(done);
    }

    setRowErrors(errors);
    const failed = Object.keys(errors).length;
    setSummary(
      failed === 0
        ? `Se crearon ${created} partidos.`
        : `Se crearon ${created} partidos; ${failed} fallaron (revisa las filas marcadas).`,
    );
    setIsCreating(false);
    // Una sola vez al final; las filas creadas desaparecen de la tabla al refrescar.
    await queryClient.invalidateQueries({
      queryKey: ["tournaments", tournamentId, "matches"],
    });
  }

  function handleCreateAll() {
    const usingDefault = fixtures.filter(
      (f) => resolve(f).datetime === "",
    ).length;
    const ok = window.confirm(
      `Se crearán ${fixtures.length} partidos.\n\n` +
        (usingDefault > 0
          ? `${usingDefault} usarán la fecha por defecto; podrás corregirla después desde la pestaña Partidos.\n\n`
          : "") +
        "¿Continuar?",
    );
    if (!ok) return;
    void createMatches(fixtures);
  }

  if (groups.length === 0 || assignments.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-500">
        Asigna equipos a los grupos para poder generar el calendario.
      </div>
    );
  }

  if (matchesQuery.isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200/70 bg-white p-6 text-sm text-gray-500">
        Cargando partidos de la fase...
      </div>
    );
  }

  const existingCount = matchesQuery.data?.matches.length ?? 0;

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="mb-4">
        <h2 className="text-base font-bold text-gray-900">
          Calendario de la fase
        </h2>
        <p className="text-xs text-gray-500">
          {existingCount} partidos creados · {fixtures.length} cruces por crear.
        </p>
        <p className="text-xs text-gray-400">
          La hora se interpreta en la zona horaria de tu navegador.
        </p>
      </div>

      {fixtures.length > 0 && (
        <div className="mb-4 flex flex-col gap-3 rounded-xl border border-gray-200 bg-gray-50/60 p-4 lg:flex-row lg:items-end">
          <label className="flex flex-col gap-1 text-xs text-gray-500">
            Fecha por defecto (para los cruces sin fecha propia)
            <input
              type="datetime-local"
              value={defaultDatetime}
              onChange={(e) => setDefaultDatetime(e.target.value)}
              className="min-h-9 rounded-lg border border-gray-200 bg-white px-2 text-sm text-gray-800 outline-none focus:border-primary"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleCreateAll}
              disabled={!canCreateAll || isCreating}
              className="min-h-9 rounded-xl bg-primary px-4 text-xs font-medium text-white hover:opacity-90 disabled:opacity-50"
            >
              {isCreating
                ? `Creando ${progress}/${total}...`
                : `Crear todos (${fixtures.length})`}
            </button>
            <button
              type="button"
              onClick={() => void createMatches(withDate)}
              disabled={withDate.length === 0 || isCreating}
              className="min-h-9 rounded-xl border border-gray-200 bg-white px-4 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Crear solo los que tienen fecha ({withDate.length})
            </button>
          </div>
        </div>
      )}

      {fixtures.length === 0 ? (
        <p className="py-6 text-center text-sm text-gray-500">
          No hay cruces pendientes: todos los partidos de los grupos ya existen.
        </p>
      ) : (
        <>
          <div className="mb-3">
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
          </div>

          <div className="max-h-[36rem] overflow-auto rounded-xl border border-gray-200">
            <table className="w-full min-w-[56rem] text-sm">
              <thead className="sticky top-0 bg-gray-50 text-left text-xs text-gray-500">
                <tr>
                  <th className="px-3 py-2 font-medium">Grupo</th>
                  <th className="w-20 px-3 py-2 font-medium">Jornada</th>
                  <th className="px-3 py-2 font-medium">Partido</th>
                  <th className="w-52 px-3 py-2 font-medium">Fecha y hora</th>
                  <th className="w-48 px-3 py-2 font-medium">Sede</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((f) => {
                  const row = resolve(f);
                  const home = teamById.get(row.homeId)?.name ?? "—";
                  const away = teamById.get(row.awayId)?.name ?? "—";
                  const error = rowErrors[f.key];
                  return (
                    <tr
                      key={f.key}
                      className={[
                        "border-t border-gray-100 align-top",
                        error ? "bg-red-50/60" : "",
                      ].join(" ")}
                    >
                      <td className="px-3 py-2 text-gray-600">{f.groupName}</td>
                      <td className="px-3 py-1.5">
                        <input
                          type="number"
                          min={1}
                          value={row.round}
                          onChange={(e) =>
                            updateEdit(f.key, {
                              round: Math.max(1, Number(e.target.value) || 1),
                            })
                          }
                          className="min-h-9 w-16 rounded-lg border border-gray-200 px-2 text-sm outline-none focus:border-primary"
                        />
                      </td>
                      <td className="px-3 py-2 text-gray-800">
                        <div className="flex items-center gap-2">
                          <span>
                            {home} <span className="text-gray-400">vs</span>{" "}
                            {away}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateEdit(f.key, {
                                swapped: !(edits[f.key]?.swapped ?? false),
                              })
                            }
                            title="Intercambiar local y visitante"
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                          >
                            ⇄
                          </button>
                        </div>
                        {error && (
                          <p className="mt-1 text-xs text-red-600">{error}</p>
                        )}
                      </td>
                      <td className="px-3 py-1.5">
                        <input
                          type="datetime-local"
                          value={row.datetime}
                          onChange={(e) =>
                            updateEdit(f.key, { datetime: e.target.value })
                          }
                          className="min-h-9 w-full rounded-lg border border-gray-200 px-2 text-sm outline-none focus:border-primary"
                        />
                      </td>
                      <td className="px-3 py-1.5">
                        <input
                          type="text"
                          maxLength={200}
                          value={row.venue}
                          onChange={(e) =>
                            updateEdit(f.key, { venue: e.target.value })
                          }
                          placeholder="Opcional"
                          className="min-h-9 w-full rounded-lg border border-gray-200 px-2 text-sm outline-none focus:border-primary"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {summary && (
        <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
          {summary}
        </div>
      )}
    </div>
  );
}

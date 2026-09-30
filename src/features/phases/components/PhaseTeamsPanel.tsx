import { useMemo, useState } from "react";
import { useSyncPhaseTeams } from "../hooks/use-sync-phase-teams";
import { getPhaseErrorMessage } from "../utils/phase-error-message";
import type { Phase, PhaseGroup, PhaseTeam } from "../types";
import type { Team } from "../../teams/types";

interface PhaseTeamsPanelProps {
  phase: Phase;
  groups: PhaseGroup[];
  teams: Team[];
  assignments: PhaseTeam[];
}

// Valor del selector: "" = sin asignar, id de grupo, o "in" (fases sin grupos).
const IN_PHASE = "in";

// Para buscar sin distinguir mayúsculas ni acentos ("mexico" encuentra "México").
function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function PhaseTeamsPanel({
  phase,
  groups,
  teams,
  assignments,
}: PhaseTeamsPanelProps) {
  const syncTeams = useSyncPhaseTeams(phase.id);
  const isGroupPhase = phase.type === "group";

  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [search, setSearch] = useState("");

  const sortedTeams = useMemo(
    () => [...teams].sort((a, b) => a.name.localeCompare(b.name, "es")),
    [teams],
  );

  // Solo afecta lo que se muestra; los contadores y el guardado usan sortedTeams completo.
  const visibleTeams = useMemo(() => {
    const query = normalizeText(search);
    if (!query) return sortedTeams;
    return sortedTeams.filter(
      (team) =>
        normalizeText(team.name).includes(query) ||
        normalizeText(team.abbreviation ?? "").includes(query),
    );
  }, [sortedTeams, search]);

  const sortedGroups = useMemo(
    () =>
      [...groups].sort(
        (a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name),
      ),
    [groups],
  );

  // Lo guardado en el servidor, como { teamId: valor del selector }.
  const savedValues = useMemo(() => {
    const map: Record<string, string> = {};
    for (const a of assignments) {
      map[a.teamId] = isGroupPhase ? (a.phaseGroupId ?? "") : IN_PHASE;
    }
    return map;
  }, [assignments, isGroupPhase]);

  // Un grupo borrado deja su id huérfano: se trata como "sin asignar".
  const validGroupIds = useMemo(
    () => new Set(groups.map((g) => g.id)),
    [groups],
  );

  function valueOf(teamId: string): string {
    const value = overrides[teamId] ?? savedValues[teamId] ?? "";
    if (isGroupPhase && value && !validGroupIds.has(value)) return "";
    return value;
  }

  const counts = useMemo(() => {
    const result: Record<string, number> = {};
    for (const team of sortedTeams) {
      const value = overrides[team.id] ?? savedValues[team.id] ?? "";
      if (value) result[value] = (result[value] ?? 0) + 1;
    }
    return result;
  }, [sortedTeams, overrides, savedValues]);

  const unassigned = sortedTeams.filter((t) => valueOf(t.id) === "").length;
  const isDirty = Object.keys(overrides).length > 0;

  function handleChange(teamId: string, value: string) {
    setSaved(false);
    setOverrides((prev) => {
      const next = { ...prev };
      // Si vuelve al valor guardado, deja de contar como cambio.
      if (value === (savedValues[teamId] ?? "")) delete next[teamId];
      else next[teamId] = value;
      return next;
    });
  }

  function handleSave() {
    setError(null);
    setSaved(false);
    // "Sync" reemplaza toda la lista: se mandan todos los equipos con asignación,
    // estén o no visibles con el filtro actual.
    const payload = {
      teams: sortedTeams
        .filter((t) => valueOf(t.id) !== "")
        .map((t) => ({
          teamId: t.id,
          phaseGroupId: isGroupPhase ? valueOf(t.id) : null,
        })),
    };
    syncTeams.mutate(payload, {
      onSuccess: () => {
        setOverrides({});
        setSaved(true);
      },
      onError: (err) => setError(getPhaseErrorMessage(err)),
    });
  }

  if (isGroupPhase && groups.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-500">
        Crea al menos un grupo para poder asignar equipos.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-base font-bold text-gray-900">Equipos</h2>
          <p className="text-xs text-gray-500">
            {sortedTeams.length} equipos en la categoría ·{" "}
            {unassigned > 0 ? `${unassigned} sin asignar` : "todos asignados"}
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={!isDirty || syncTeams.isPending}
          className="min-h-9 shrink-0 rounded-xl bg-primary px-4 text-xs font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          {syncTeams.isPending ? "Guardando..." : "Guardar asignaciones"}
        </button>
      </div>

      {isGroupPhase && (
        <div className="mb-4 flex flex-wrap gap-2">
          {sortedGroups.map((group) => (
            <span
              key={group.id}
              className="rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs text-gray-700"
            >
              {group.name}:{" "}
              <strong className="text-gray-900">{counts[group.id] ?? 0}</strong>
            </span>
          ))}
        </div>
      )}

      {sortedTeams.length > 0 && (
        <div className="relative mb-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar equipo..."
            className="min-h-10 w-full rounded-xl border border-gray-200 px-3 pr-9 text-sm outline-none focus:border-primary"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              title="Limpiar búsqueda"
              className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            >
              ×
            </button>
          )}
        </div>
      )}

      {sortedTeams.length === 0 ? (
        <p className="py-6 text-center text-sm text-gray-500">
          Esta categoría aún no tiene equipos.
        </p>
      ) : visibleTeams.length === 0 ? (
        <p className="py-6 text-center text-sm text-gray-500">
          Ningún equipo coincide con "{search}".
        </p>
      ) : (
        <div className="max-h-[32rem] overflow-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-gray-50 text-left text-xs text-gray-500">
              <tr>
                <th className="px-3 py-2 font-medium">Equipo</th>
                <th className="w-56 px-3 py-2 font-medium">
                  {isGroupPhase ? "Grupo" : "En la fase"}
                </th>
              </tr>
            </thead>
            <tbody>
              {visibleTeams.map((team) => (
                <tr key={team.id} className="border-t border-gray-100">
                  <td className="px-3 py-2 text-gray-800">
                    {team.name}
                    {team.abbreviation && (
                      <span className="ml-2 text-xs text-gray-400">
                        {team.abbreviation}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-1.5">
                    <select
                      value={valueOf(team.id)}
                      onChange={(e) => handleChange(team.id, e.target.value)}
                      className="min-h-9 w-full rounded-lg border border-gray-200 bg-white px-2 text-sm outline-none focus:border-primary"
                    >
                      <option value="">Sin asignar</option>
                      {isGroupPhase ? (
                        sortedGroups.map((group) => (
                          <option key={group.id} value={group.id}>
                            {group.name}
                          </option>
                        ))
                      ) : (
                        <option value={IN_PHASE}>Incluido</option>
                      )}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {error && (
        <div className="mt-3 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}
      {saved && !isDirty && (
        <div className="mt-3 rounded-xl border border-green-100 bg-green-50 p-3 text-sm text-green-700">
          Asignaciones guardadas.
        </div>
      )}
    </div>
  );
}

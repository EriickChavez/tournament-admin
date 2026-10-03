import { useMemo, useState } from "react";
import { useBracket } from "../hooks/use-bracket";
import { useGenerateBracket } from "../hooks/use-generate-bracket";
import { usePhases } from "../../phases/hooks/use-phases";
import { useMatches } from "../../matches/hooks/use-matches";
import { BracketNodeCard } from "./BracketNodeCard";
import {
  buildRoundSizes,
  describeSource,
  mainRoundLabel,
  nodeStageLabel,
} from "../utils/bracket-labels";
import { getBracketErrorMessage } from "../utils/bracket-error-message";
import type { Phase } from "../../phases/types";
import type { Team } from "../../teams/types";
import type { BracketNode } from "../types";

interface BracketPanelProps {
  tournamentId: string;
  categoryId: string;
  phase: Phase;
  teams: Team[];
}

interface Column {
  key: string;
  title: string;
  nodes: BracketNode[];
}

interface GenerateFormProps {
  tournamentId: string;
  categoryId: string;
  phase: Phase;
  hasBracket: boolean;
}

function GenerateForm({
  tournamentId,
  categoryId,
  phase,
  hasBracket,
}: GenerateFormProps) {
  const phasesQuery = usePhases(tournamentId, categoryId);
  const generate = useGenerateBracket(tournamentId, phase.id);

  const [sourceId, setSourceId] = useState("");
  const [thirdPlace, setThirdPlace] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Solo fases de grupos de esta categoría; las cerradas son las que se pueden usar.
  const sources = (phasesQuery.data?.phases ?? []).filter(
    (p) => p.type === "group" && p.categoryId === phase.categoryId,
  );
  const firstClosed = sources.find((p) => p.status === "finished");
  const selected = sourceId || firstClosed?.id || "";

  function handleGenerate() {
    if (
      hasBracket &&
      !window.confirm(
        "Se reemplazará la llave actual por una nueva. ¿Continuar?",
      )
    ) {
      return;
    }
    setError(null);
    generate.mutate(
      { sourcePhaseId: selected, thirdPlace },
      { onError: (err) => setError(getBracketErrorMessage(err)) },
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-4">
      <h3 className="text-sm font-semibold text-gray-800">
        {hasBracket ? "Regenerar llave" : "Generar llave"}
      </h3>
      <p className="mb-3 text-xs text-gray-500">
        Los clasificados salen de una fase de grupos cerrada. Se ordenan por
        posición, puntos, diferencia y goles a favor, y se cruzan mejor contra
        peor.
      </p>

      {sources.length === 0 ? (
        <p className="text-sm text-gray-500">
          Esta categoría no tiene una fase de grupos.
        </p>
      ) : (
        <div className="flex flex-wrap items-end gap-4">
          <label className="flex flex-col gap-1 text-xs text-gray-500">
            Fase de grupos de origen
            <select
              value={selected}
              onChange={(e) => setSourceId(e.target.value)}
              className="min-h-9 rounded-lg border border-gray-200 bg-white px-2 text-sm text-gray-800 outline-none focus:border-primary"
            >
              {!firstClosed && <option value="">Sin fases cerradas</option>}
              {sources.map((p) => (
                <option
                  key={p.id}
                  value={p.id}
                  disabled={p.status !== "finished"}
                >
                  {p.name}
                  {p.status !== "finished" ? " (sin cerrar)" : ""}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 pb-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={thirdPlace}
              onChange={(e) => setThirdPlace(e.target.checked)}
            />
            Partido por el tercer lugar
          </label>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={!selected || generate.isPending}
            className="min-h-9 rounded-xl bg-primary px-4 text-xs font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            {generate.isPending
              ? "Generando..."
              : hasBracket
                ? "Regenerar llave"
                : "Generar llave"}
          </button>
        </div>
      )}

      {!firstClosed && sources.length > 0 && (
        <p className="mt-2 text-xs text-amber-600">
          Cierra primero la fase de grupos para poder generar la llave.
        </p>
      )}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export function BracketPanel({
  tournamentId,
  categoryId,
  phase,
  teams,
}: BracketPanelProps) {
  const bracketQuery = useBracket(tournamentId, phase.id);
  const matchesQuery = useMatches(tournamentId, 1, 100, { phaseId: phase.id });

  const nodes = useMemo(
    () => bracketQuery.data?.nodes ?? [],
    [bracketQuery.data],
  );

  const teamName = useMemo(() => {
    const map = new Map(teams.map((t) => [t.id, t.name]));
    return (id: string) => map.get(id) ?? "—";
  }, [teams]);

  const matchById = useMemo(
    () => new Map((matchesQuery.data?.matches ?? []).map((m) => [m.id, m])),
    [matchesQuery.data],
  );

  const nodeById = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);
  const roundSizes = useMemo(() => buildRoundSizes(nodes), [nodes]);

  // Columnas: repechaje, una por ronda del cuadro principal y, junto a la final, el tercer lugar.
  const columns = useMemo<Column[]>(() => {
    const playIn = nodes.filter((n) => n.stage === "play_in");
    const main = nodes.filter((n) => n.stage === "main");
    const third = nodes.filter((n) => n.stage === "third_place");
    const rounds = [...new Set(main.map((n) => n.round))].sort((a, b) => a - b);
    const lastRound = rounds[rounds.length - 1];

    const result: Column[] = [];
    if (playIn.length > 0) {
      result.push({ key: "play_in", title: "Repechaje", nodes: playIn });
    }
    for (const round of rounds) {
      const inRound = main
        .filter((n) => n.round === round)
        .sort((a, b) => a.position - b.position);
      result.push({
        key: `round-${round}`,
        title: mainRoundLabel(roundSizes.get(round) ?? 0),
        nodes: round === lastRound ? [...inRound, ...third] : inRound,
      });
    }
    return result;
  }, [nodes, roundSizes]);

  const started = nodes.some((n) => n.matchId !== null);

  const finalNode = nodes
    .filter((n) => n.stage === "main")
    .sort((a, b) => b.round - a.round)[0];
  const champion =
    finalNode?.winnerTeamId && columns.length > 0
      ? teamName(finalNode.winnerTeamId)
      : null;

  if (bracketQuery.isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200/70 bg-white p-6 text-sm text-gray-500">
        Cargando llave...
      </div>
    );
  }

  if (bracketQuery.error) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-sm text-red-600">
        {getBracketErrorMessage(bracketQuery.error)}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="mb-4">
        <h2 className="text-base font-bold text-gray-900">Llave</h2>
        <p className="text-xs text-gray-500">
          Programa cada cruce cuando ya tenga sus dos equipos y captura su
          resultado: el ganador avanza solo a la siguiente ronda.
        </p>
      </div>

      {champion && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
            Campeón
          </p>
          <p className="text-xl font-bold text-amber-900">{champion}</p>
        </div>
      )}

      {nodes.length === 0 ? (
        <GenerateForm
          tournamentId={tournamentId}
          categoryId={categoryId}
          phase={phase}
          hasBracket={false}
        />
      ) : (
        <>
          <div className="overflow-x-auto pb-2">
            <div className="flex min-w-max gap-4">
              {columns.map((column) => (
                <div key={column.key} className="w-64 shrink-0">
                  <h3 className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {column.title}
                  </h3>
                  <div className="flex flex-col gap-3">
                    {column.nodes.map((node) => (
                      <BracketNodeCard
                        key={node.id}
                        tournamentId={tournamentId}
                        phaseId={phase.id}
                        node={node}
                        title={nodeStageLabel(node, roundSizes)}
                        homePlaceholder={describeSource(
                          node.homeSource,
                          nodeById,
                          roundSizes,
                        )}
                        awayPlaceholder={describeSource(
                          node.awaySource,
                          nodeById,
                          roundSizes,
                        )}
                        teamName={teamName}
                        match={
                          node.matchId ? matchById.get(node.matchId) : undefined
                        }
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {!started && (
            <div className="mt-6">
              <GenerateForm
                tournamentId={tournamentId}
                categoryId={categoryId}
                phase={phase}
                hasBracket
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

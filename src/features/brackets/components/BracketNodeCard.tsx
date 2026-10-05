import { useState } from "react";
import { useScheduleBracketNode } from "../hooks/use-schedule-bracket-node";
import { useSaveBracketResult } from "../hooks/use-save-bracket-result";
import { useSetBracketNodePenalties } from "../hooks/use-set-bracket-node-penalties";
import { getBracketErrorMessage } from "../utils/bracket-error-message";
import { datetimeLocalToIso } from "../../matches/utils/datetime";
import { MATCH_STATUS_LABELS } from "../../matches/types";
import type { Match } from "../../matches/types";
import type { BracketNode } from "../types";

const cleanScore = (value: string) => value.replace(/\D/g, "").slice(0, 2);

const BUTTON =
  "min-h-8 rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700 hover:bg-gray-50";

type Mode =
  | { kind: "schedule"; leg: 1 | 2 }
  | { kind: "result"; leg: 1 | 2 }
  | { kind: "penalties" }
  | null;

type Goals = { home: number; away: number };

/**
 * Goles de un partido expresados respecto al cruce. En la vuelta el local del partido es el
 * visitante del cruce, así que se invierten.
 */
function goalsOf(leg: 1 | 2, match: Match | undefined): Goals | null {
  if (!match || match.homeScore == null || match.awayScore == null) return null;
  return leg === 1
    ? { home: match.homeScore, away: match.awayScore }
    : { home: match.awayScore, away: match.homeScore };
}

function formatDate(match: Match): string {
  const date = new Date(match.scheduledAt).toLocaleString("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  });
  return match.venue ? `${date} · ${match.venue}` : date;
}

interface TeamRowProps {
  name: string | null;
  placeholder: string;
  seed: number | null;
  isWinner: boolean;
  /** Una celda en partido único; tres (ida, vuelta, global) en ida y vuelta. */
  cells: Array<number | null>;
  penalties: number | null | undefined;
}

function TeamRow({
  name,
  placeholder,
  seed,
  isWinner,
  cells,
  penalties,
}: TeamRowProps) {
  const empty = cells.length > 1 ? "·" : "";
  return (
    <div
      className={[
        "flex items-center justify-between gap-2 rounded-lg px-2 py-1.5",
        isWinner ? "bg-green-50" : "",
      ].join(" ")}
    >
      <div className="flex min-w-0 items-center gap-2">
        {seed !== null && (
          <span className="shrink-0 text-[10px] font-semibold text-gray-400">
            #{seed}
          </span>
        )}
        <span
          className={[
            "truncate text-sm",
            name === null
              ? "italic text-gray-400"
              : isWinner
                ? "font-semibold text-gray-900"
                : "text-gray-700",
          ].join(" ")}
        >
          {name ?? placeholder}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-1.5 text-sm tabular-nums">
        {cells.map((value, index) => (
          <span
            key={index}
            className={[
              "w-6 text-right",
              isWinner && index === cells.length - 1
                ? "font-bold text-gray-900"
                : "text-gray-600",
            ].join(" ")}
          >
            {value ?? empty}
          </span>
        ))}
        {penalties != null && (
          <span className="text-xs text-gray-400">({penalties})</span>
        )}
      </div>
    </div>
  );
}

interface BaseFormProps {
  tournamentId: string;
  onDone: () => void;
}

function ScheduleForm({
  tournamentId,
  phaseId,
  nodeId,
  leg,
  twoLegged,
  onDone,
}: BaseFormProps & {
  phaseId: string;
  nodeId: string;
  leg: 1 | 2;
  twoLegged: boolean;
}) {
  const schedule = useScheduleBracketNode(tournamentId, phaseId);
  const [datetime, setDatetime] = useState("");
  const [venue, setVenue] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSave() {
    setError(null);
    schedule.mutate(
      {
        nodeId,
        payload: {
          scheduledAt: datetimeLocalToIso(datetime),
          ...(venue.trim() ? { venue: venue.trim() } : {}),
          ...(twoLegged ? { leg } : {}),
        },
      },
      {
        onSuccess: onDone,
        onError: (err) => setError(getBracketErrorMessage(err)),
      },
    );
  }

  return (
    <div className="mt-3 space-y-2 border-t border-gray-100 pt-3">
      <p className="text-xs font-medium text-gray-600">
        {twoLegged
          ? leg === 1
            ? "Partido de ida"
            : "Partido de vuelta"
          : "Partido"}
      </p>
      <input
        type="datetime-local"
        value={datetime}
        onChange={(e) => setDatetime(e.target.value)}
        className="min-h-9 w-full rounded-lg border border-gray-200 px-2 text-sm outline-none focus:border-primary"
      />
      <input
        type="text"
        maxLength={200}
        value={venue}
        onChange={(e) => setVenue(e.target.value)}
        placeholder="Sede (opcional)"
        className="min-h-9 w-full rounded-lg border border-gray-200 px-2 text-sm outline-none focus:border-primary"
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={!datetime || schedule.isPending}
          className="min-h-8 rounded-lg bg-primary px-3 text-xs font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          {schedule.isPending ? "Guardando..." : "Programar"}
        </button>
        <button type="button" onClick={onDone} className={BUTTON}>
          Cancelar
        </button>
      </div>
    </div>
  );
}

function ResultForm({
  tournamentId,
  match,
  homeName,
  awayName,
  allowPenalties,
  onDone,
}: BaseFormProps & {
  match: Match;
  homeName: string;
  awayName: string;
  /** Solo en partido único; en ida y vuelta los penales son del cruce. */
  allowPenalties: boolean;
}) {
  const save = useSaveBracketResult(tournamentId);
  const [home, setHome] = useState(
    match.homeScore != null ? String(match.homeScore) : "",
  );
  const [away, setAway] = useState(
    match.awayScore != null ? String(match.awayScore) : "",
  );
  const [homePen, setHomePen] = useState(
    match.homePenalties != null ? String(match.homePenalties) : "",
  );
  const [awayPen, setAwayPen] = useState(
    match.awayPenalties != null ? String(match.awayPenalties) : "",
  );
  const [error, setError] = useState<string | null>(null);

  const scoresFilled = home !== "" && away !== "";
  const needsPenalties = allowPenalties && scoresFilled && home === away;
  const penaltiesOk =
    !needsPenalties ||
    (homePen !== "" && awayPen !== "" && homePen !== awayPen);
  const canSave = scoresFilled && penaltiesOk;
  const hasResult = match.homeScore != null;

  function handleSave() {
    setError(null);
    save.mutate(
      {
        matchId: match.id,
        payload: {
          homeScore: Number(home),
          awayScore: Number(away),
          status: "finished",
          // Con marcador no empatado el backend borra los penales viejos por su cuenta.
          ...(needsPenalties
            ? { homePenalties: Number(homePen), awayPenalties: Number(awayPen) }
            : {}),
        },
      },
      {
        onSuccess: onDone,
        onError: (err) => setError(getBracketErrorMessage(err)),
      },
    );
  }

  function handleClear() {
    if (!window.confirm("¿Quitar el resultado de este partido?")) return;
    setError(null);
    save.mutate(
      {
        matchId: match.id,
        payload: {
          homeScore: null,
          awayScore: null,
          ...(allowPenalties
            ? { homePenalties: null, awayPenalties: null }
            : {}),
          status: "scheduled",
        },
      },
      {
        onSuccess: onDone,
        onError: (err) => setError(getBracketErrorMessage(err)),
      },
    );
  }

  const inputClass =
    "min-h-9 w-14 rounded-lg border border-gray-200 px-2 text-center text-sm outline-none focus:border-primary";

  return (
    <div className="mt-3 space-y-2 border-t border-gray-100 pt-3">
      <p className="text-xs font-medium text-gray-600">
        {homeName} vs {awayName}
      </p>
      <div className="flex items-center gap-2">
        <span className="w-20 text-xs text-gray-500">Goles</span>
        <input
          type="text"
          inputMode="numeric"
          value={home}
          onChange={(e) => setHome(cleanScore(e.target.value))}
          className={inputClass}
        />
        <span className="text-gray-400">-</span>
        <input
          type="text"
          inputMode="numeric"
          value={away}
          onChange={(e) => setAway(cleanScore(e.target.value))}
          className={inputClass}
        />
      </div>

      {needsPenalties && (
        <div className="flex items-center gap-2">
          <span className="w-20 text-xs text-gray-500">Penales</span>
          <input
            type="text"
            inputMode="numeric"
            value={homePen}
            onChange={(e) => setHomePen(cleanScore(e.target.value))}
            className={inputClass}
          />
          <span className="text-gray-400">-</span>
          <input
            type="text"
            inputMode="numeric"
            value={awayPen}
            onChange={(e) => setAwayPen(cleanScore(e.target.value))}
            className={inputClass}
          />
        </div>
      )}
      {needsPenalties && !penaltiesOk && (
        <p className="text-xs text-amber-600">
          Empate: captura los penales (no pueden quedar iguales).
        </p>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={!canSave || save.isPending}
          className="min-h-8 rounded-lg bg-primary px-3 text-xs font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          {save.isPending ? "Guardando..." : "Guardar resultado"}
        </button>
        {hasResult && (
          <button
            type="button"
            onClick={handleClear}
            disabled={save.isPending}
            className="min-h-8 rounded-lg border border-red-200 bg-white px-3 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            Quitar resultado
          </button>
        )}
        <button type="button" onClick={onDone} className={BUTTON}>
          Cancelar
        </button>
      </div>
    </div>
  );
}

function PenaltiesForm({
  tournamentId,
  phaseId,
  node,
  homeName,
  awayName,
  onDone,
}: BaseFormProps & {
  phaseId: string;
  node: BracketNode;
  homeName: string;
  awayName: string;
}) {
  const save = useSetBracketNodePenalties(tournamentId, phaseId);
  const [home, setHome] = useState(
    node.homePenalties != null ? String(node.homePenalties) : "",
  );
  const [away, setAway] = useState(
    node.awayPenalties != null ? String(node.awayPenalties) : "",
  );
  const [error, setError] = useState<string | null>(null);

  const canSave = home !== "" && away !== "" && home !== away;
  const hasPenalties = node.homePenalties != null;

  function submit(homePenalties: number | null, awayPenalties: number | null) {
    setError(null);
    save.mutate(
      { nodeId: node.id, payload: { homePenalties, awayPenalties } },
      {
        onSuccess: onDone,
        onError: (err) => setError(getBracketErrorMessage(err)),
      },
    );
  }

  const inputClass =
    "min-h-9 w-14 rounded-lg border border-gray-200 px-2 text-center text-sm outline-none focus:border-primary";

  return (
    <div className="mt-3 space-y-2 border-t border-gray-100 pt-3">
      <p className="text-xs font-medium text-gray-600">
        Penales del cruce: {homeName} vs {awayName}
      </p>
      <div className="flex items-center gap-2">
        <input
          type="text"
          inputMode="numeric"
          value={home}
          onChange={(e) => setHome(cleanScore(e.target.value))}
          className={inputClass}
        />
        <span className="text-gray-400">-</span>
        <input
          type="text"
          inputMode="numeric"
          value={away}
          onChange={(e) => setAway(cleanScore(e.target.value))}
          className={inputClass}
        />
      </div>
      {home !== "" && away !== "" && home === away && (
        <p className="text-xs text-amber-600">
          Los penales no pueden quedar iguales.
        </p>
      )}
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => submit(Number(home), Number(away))}
          disabled={!canSave || save.isPending}
          className="min-h-8 rounded-lg bg-primary px-3 text-xs font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          {save.isPending ? "Guardando..." : "Guardar penales"}
        </button>
        {hasPenalties && (
          <button
            type="button"
            onClick={() => submit(null, null)}
            disabled={save.isPending}
            className="min-h-8 rounded-lg border border-red-200 bg-white px-3 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            Quitar penales
          </button>
        )}
        <button type="button" onClick={onDone} className={BUTTON}>
          Cancelar
        </button>
      </div>
    </div>
  );
}

interface BracketNodeCardProps {
  tournamentId: string;
  phaseId: string;
  node: BracketNode;
  title: string;
  homePlaceholder: string;
  awayPlaceholder: string;
  teamName: (id: string) => string;
  /** Partido de ida (o el único). */
  firstMatch: Match | undefined;
  /** Partido de vuelta (solo cruces a ida y vuelta). */
  secondMatch: Match | undefined;
}

export function BracketNodeCard({
  tournamentId,
  phaseId,
  node,
  title,
  homePlaceholder,
  awayPlaceholder,
  teamName,
  firstMatch,
  secondMatch,
}: BracketNodeCardProps) {
  const [mode, setMode] = useState<Mode>(null);

  const twoLegged = node.legs === 2;
  const ready = node.homeTeamId !== null && node.awayTeamId !== null;
  const homeName = node.homeTeamId
    ? teamName(node.homeTeamId)
    : homePlaceholder;
  const awayName = node.awayTeamId
    ? teamName(node.awayTeamId)
    : awayPlaceholder;

  // Goles por partido, respecto al cruce, y global (solo cuando los dos partidos terminaron).
  const firstGoals = goalsOf(1, firstMatch);
  const secondGoals = twoLegged ? goalsOf(2, secondMatch) : null;
  const aggregate =
    twoLegged &&
    firstMatch?.status === "finished" &&
    secondMatch?.status === "finished" &&
    firstGoals &&
    secondGoals
      ? {
          home: firstGoals.home + secondGoals.home,
          away: firstGoals.away + secondGoals.away,
        }
      : null;
  const aggregateTied = aggregate !== null && aggregate.home === aggregate.away;

  // Partido único terminado en empate y sin ganador: faltan penales.
  const singleDrawPending =
    !twoLegged &&
    firstMatch?.status === "finished" &&
    firstMatch.homeScore != null &&
    firstMatch.homeScore === firstMatch.awayScore &&
    node.winnerTeamId === null;

  const homeCells = twoLegged
    ? [
        firstGoals?.home ?? null,
        secondGoals?.home ?? null,
        aggregate?.home ?? null,
      ]
    : [firstMatch?.homeScore ?? null];
  const awayCells = twoLegged
    ? [
        firstGoals?.away ?? null,
        secondGoals?.away ?? null,
        aggregate?.away ?? null,
      ]
    : [firstMatch?.awayScore ?? null];

  // Penales: del cruce en ida y vuelta; del propio partido en partido único.
  const homePenalties = twoLegged
    ? node.homePenalties
    : firstMatch?.homePenalties;
  const awayPenalties = twoLegged
    ? node.awayPenalties
    : firstMatch?.awayPenalties;

  let statusLabel: string;
  let statusStyle: string;
  if (!ready) {
    statusLabel = "Por definir";
    statusStyle = "bg-gray-100 text-gray-500";
  } else if (node.winnerTeamId) {
    statusLabel = "Finalizado";
    statusStyle = "bg-green-50 text-green-700";
  } else if (aggregateTied || singleDrawPending) {
    statusLabel = "Faltan penales";
    statusStyle = "bg-amber-50 text-amber-700";
  } else if (!firstMatch) {
    statusLabel = "Sin programar";
    statusStyle = "bg-amber-50 text-amber-700";
  } else if (twoLegged && !secondMatch) {
    statusLabel = "Falta la vuelta";
    statusStyle = "bg-blue-50 text-blue-700";
  } else {
    statusLabel = MATCH_STATUS_LABELS[firstMatch.status] ?? "Programado";
    statusStyle = "bg-blue-50 text-blue-700";
  }

  const resultMatch =
    mode?.kind === "result"
      ? mode.leg === 1
        ? firstMatch
        : secondMatch
      : undefined;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-gray-500">
          {title}
          {node.stage !== "third_place" && ` ${node.position + 1}`}
          {twoLegged && " · ida y vuelta"}
        </span>
        <span
          className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${statusStyle}`}
        >
          {statusLabel}
        </span>
      </div>

      {twoLegged && (
        <div className="flex justify-end gap-1.5 px-2 text-[10px] text-gray-400">
          <span className="w-6 text-right">Ida</span>
          <span className="w-6 text-right">Vta</span>
          <span className="w-6 text-right">Glob</span>
        </div>
      )}

      <TeamRow
        name={node.homeTeamId ? teamName(node.homeTeamId) : null}
        placeholder={homePlaceholder}
        seed={node.homeSeed}
        cells={homeCells}
        penalties={homePenalties}
        isWinner={
          node.winnerTeamId !== null && node.winnerTeamId === node.homeTeamId
        }
      />
      <TeamRow
        name={node.awayTeamId ? teamName(node.awayTeamId) : null}
        placeholder={awayPlaceholder}
        seed={node.awaySeed}
        cells={awayCells}
        penalties={awayPenalties}
        isWinner={
          node.winnerTeamId !== null && node.winnerTeamId === node.awayTeamId
        }
      />

      {(firstMatch || secondMatch) && (
        <div className="mt-2 space-y-0.5 text-[11px] text-gray-500">
          {firstMatch && (
            <p>
              {twoLegged && <span className="font-medium">Ida: </span>}
              {formatDate(firstMatch)}
            </p>
          )}
          {secondMatch && (
            <p>
              <span className="font-medium">Vuelta: </span>
              {formatDate(secondMatch)}
            </p>
          )}
        </div>
      )}

      {mode === null && ready && (
        <div className="mt-2 flex flex-wrap gap-2">
          {!firstMatch ? (
            <button
              type="button"
              onClick={() => setMode({ kind: "schedule", leg: 1 })}
              className={BUTTON}
            >
              {twoLegged ? "Programar ida" : "Programar partido"}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setMode({ kind: "result", leg: 1 })}
              className={BUTTON}
            >
              {twoLegged
                ? firstMatch.homeScore != null
                  ? "Editar resultado de la ida"
                  : "Resultado de la ida"
                : firstMatch.homeScore != null
                  ? "Editar resultado"
                  : "Capturar resultado"}
            </button>
          )}

          {twoLegged && firstMatch && !secondMatch && (
            <button
              type="button"
              onClick={() => setMode({ kind: "schedule", leg: 2 })}
              className={BUTTON}
            >
              Programar vuelta
            </button>
          )}
          {twoLegged && secondMatch && (
            <button
              type="button"
              onClick={() => setMode({ kind: "result", leg: 2 })}
              className={BUTTON}
            >
              {secondMatch.homeScore != null
                ? "Editar resultado de la vuelta"
                : "Resultado de la vuelta"}
            </button>
          )}

          {twoLegged && (aggregateTied || node.homePenalties != null) && (
            <button
              type="button"
              onClick={() => setMode({ kind: "penalties" })}
              className={BUTTON}
            >
              {node.homePenalties != null
                ? "Editar penales"
                : "Penales del cruce"}
            </button>
          )}
        </div>
      )}

      {mode?.kind === "schedule" && (
        <ScheduleForm
          tournamentId={tournamentId}
          phaseId={phaseId}
          nodeId={node.id}
          leg={mode.leg}
          twoLegged={twoLegged}
          onDone={() => setMode(null)}
        />
      )}
      {mode?.kind === "result" && resultMatch && (
        <ResultForm
          tournamentId={tournamentId}
          match={resultMatch}
          homeName={teamName(resultMatch.homeTeamId)}
          awayName={teamName(resultMatch.awayTeamId)}
          allowPenalties={!twoLegged}
          onDone={() => setMode(null)}
        />
      )}
      {mode?.kind === "penalties" && (
        <PenaltiesForm
          tournamentId={tournamentId}
          phaseId={phaseId}
          node={node}
          homeName={homeName}
          awayName={awayName}
          onDone={() => setMode(null)}
        />
      )}
    </div>
  );
}

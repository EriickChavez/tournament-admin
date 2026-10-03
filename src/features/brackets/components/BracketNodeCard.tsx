import { useState } from "react";
import { useScheduleBracketNode } from "../hooks/use-schedule-bracket-node";
import { useSaveBracketResult } from "../hooks/use-save-bracket-result";
import { getBracketErrorMessage } from "../utils/bracket-error-message";
import {
  datetimeLocalToIso,
  isoToDatetimeLocal,
} from "../../matches/utils/datetime";
import { MATCH_STATUS_LABELS } from "../../matches/types";
import type { Match } from "../../matches/types";
import type { BracketNode } from "../types";

const cleanScore = (value: string) => value.replace(/\D/g, "").slice(0, 2);

interface TeamRowProps {
  name: string | null;
  placeholder: string;
  seed: number | null;
  score: number | null | undefined;
  penalties: number | null | undefined;
  isWinner: boolean;
}

function TeamRow({
  name,
  placeholder,
  seed,
  score,
  penalties,
  isWinner,
}: TeamRowProps) {
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
      {score != null && (
        <span
          className={[
            "shrink-0 text-sm tabular-nums",
            isWinner ? "font-bold text-gray-900" : "text-gray-600",
          ].join(" ")}
        >
          {score}
          {penalties != null && (
            <span className="ml-1 text-xs font-normal text-gray-400">
              ({penalties})
            </span>
          )}
        </span>
      )}
    </div>
  );
}

interface FormProps {
  tournamentId: string;
  phaseId: string;
  onDone: () => void;
}

function ScheduleForm({
  tournamentId,
  phaseId,
  nodeId,
  onDone,
}: FormProps & { nodeId: string }) {
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
        <button
          type="button"
          onClick={onDone}
          className="min-h-8 rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

function ResultForm({
  tournamentId,
  match,
  onDone,
}: Omit<FormProps, "phaseId"> & { match: Match }) {
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
  const isDraw = scoresFilled && home === away;
  const penaltiesOk =
    !isDraw || (homePen !== "" && awayPen !== "" && homePen !== awayPen);
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
          ...(isDraw
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
          homePenalties: null,
          awayPenalties: null,
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

      {isDraw && (
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
      {isDraw && !penaltiesOk && (
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
        <button
          type="button"
          onClick={onDone}
          className="min-h-8 rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700 hover:bg-gray-50"
        >
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
  match: Match | undefined;
}

export function BracketNodeCard({
  tournamentId,
  phaseId,
  node,
  title,
  homePlaceholder,
  awayPlaceholder,
  teamName,
  match,
}: BracketNodeCardProps) {
  const [mode, setMode] = useState<"schedule" | "result" | null>(null);

  const ready = node.homeTeamId !== null && node.awayTeamId !== null;
  const finished = match?.status === "finished";

  const statusLabel = !ready
    ? "Por definir"
    : !match
      ? "Sin programar"
      : (MATCH_STATUS_LABELS[match.status] ?? "Programado");

  const statusStyle = !ready
    ? "bg-gray-100 text-gray-500"
    : !match
      ? "bg-amber-50 text-amber-700"
      : finished
        ? "bg-green-50 text-green-700"
        : "bg-blue-50 text-blue-700";

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-gray-500">
          {title}
          {node.stage !== "third_place" && ` ${node.position + 1}`}
        </span>
        <span
          className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${statusStyle}`}
        >
          {statusLabel}
        </span>
      </div>

      <TeamRow
        name={node.homeTeamId ? teamName(node.homeTeamId) : null}
        placeholder={homePlaceholder}
        seed={node.homeSeed}
        score={match?.homeScore}
        penalties={match?.homePenalties}
        isWinner={
          node.winnerTeamId !== null && node.winnerTeamId === node.homeTeamId
        }
      />
      <TeamRow
        name={node.awayTeamId ? teamName(node.awayTeamId) : null}
        placeholder={awayPlaceholder}
        seed={node.awaySeed}
        score={match?.awayScore}
        penalties={match?.awayPenalties}
        isWinner={
          node.winnerTeamId !== null && node.winnerTeamId === node.awayTeamId
        }
      />

      {match && (
        <p className="mt-2 text-[11px] text-gray-500">
          {new Date(match.scheduledAt).toLocaleString("es-MX", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
          {match.venue ? ` · ${match.venue}` : ""}
        </p>
      )}

      {mode === null && ready && (
        <div className="mt-2">
          {!match ? (
            <button
              type="button"
              onClick={() => setMode("schedule")}
              className="min-h-8 rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              Programar partido
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setMode("result")}
              className="min-h-8 rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              {match.homeScore != null
                ? "Editar resultado"
                : "Capturar resultado"}
            </button>
          )}
        </div>
      )}

      {mode === "schedule" && (
        <ScheduleForm
          tournamentId={tournamentId}
          phaseId={phaseId}
          nodeId={node.id}
          onDone={() => setMode(null)}
        />
      )}
      {mode === "result" && match && (
        <ResultForm
          tournamentId={tournamentId}
          match={match}
          onDone={() => setMode(null)}
        />
      )}
    </div>
  );
}

// Útil si se necesita precargar una fecha existente en un futuro formulario de edición.
export { isoToDatetimeLocal };

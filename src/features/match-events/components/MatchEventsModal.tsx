import { useState, useMemo } from "react";
import type { Match, MatchStatus } from "../../matches/types";
import { MATCH_STATUS_LABELS } from "../../matches/types";
import { useMatchEvents } from "../hooks/use-match-events";
import { useCreateMatchEvent } from "../hooks/use-create-match-event";
import { useDeleteMatchEvent } from "../hooks/use-delete-match-event";
import { useTeamPlayers } from "../../players/hooks/use-team-players";
import { useUpdateMatch } from "../../matches/hooks/use-update-match";
import type { MatchEventType } from "../types";

interface MatchEventsModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: Match | null;
  tournamentId: string;
}

const EVENT_TYPE_LABELS: Record<
  MatchEventType,
  { label: string; icon: string; badge: string }
> = {
  gol: {
    label: "Gol",
    icon: "⚽",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  tarjeta_amarilla: {
    label: "Tarjeta amarilla",
    icon: "🟨",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
  },
  tarjeta_roja: {
    label: "Tarjeta roja",
    icon: "🟥",
    badge: "bg-rose-50 text-rose-700 border-rose-200",
  },
  asistencia: {
    label: "Asistencia",
    icon: "🎯",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
  },
  cambio: {
    label: "Cambio",
    icon: "🔄",
    badge: "bg-purple-50 text-purple-700 border-purple-200",
  },
  otro: {
    label: "Otro",
    icon: "📝",
    badge: "bg-gray-50 text-gray-700 border-gray-200",
  },
};

export function MatchEventsModal({
  isOpen,
  onClose,
  match,
  tournamentId,
}: MatchEventsModalProps) {
  if (!isOpen || !match) return null;

  const matchId = match.id;
  const homeTeamId = match.homeTeamId;
  const awayTeamId = match.awayTeamId;
  const homeName = match.homeTeam?.name ?? "Local";
  const awayName = match.awayTeam?.name ?? "Visitante";

  const { data: eventsData, isLoading: isLoadingEvents } = useMatchEvents(matchId);

  // Cargamos los jugadores de ambos equipos directamente (sin importar cuántos miles de jugadores tenga el torneo)
  const { data: homePlayersData, isLoading: isLoadingHome } = useTeamPlayers(homeTeamId);
  const { data: awayPlayersData, isLoading: isLoadingAway } = useTeamPlayers(awayTeamId);

  const homePlayers = homePlayersData?.players ?? [];
  const awayPlayers = awayPlayersData?.players ?? [];

  const createEventMutation = useCreateMatchEvent(tournamentId, matchId);
  const deleteEventMutation = useDeleteMatchEvent(tournamentId, matchId);
  const updateMatchMutation = useUpdateMatch(tournamentId);

  const [selectedTeamId, setSelectedTeamId] = useState<string>(homeTeamId);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>("");
  const [eventType, setEventType] = useState<MatchEventType>("gol");
  const [minute, setMinute] = useState<string>("");
  const [status, setStatus] = useState<MatchStatus>(match.status);
  const [homePen, setHomePen] = useState<string>(
    match.homePenalties != null ? String(match.homePenalties) : "",
  );
  const [awayPen, setAwayPen] = useState<string>(
    match.awayPenalties != null ? String(match.awayPenalties) : "",
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const teamPlayers = selectedTeamId === homeTeamId ? homePlayers : awayPlayers;
  const isLoadingPlayers = selectedTeamId === homeTeamId ? isLoadingHome : isLoadingAway;

  const playerMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const p of [...homePlayers, ...awayPlayers]) {
      const numStr = p.number != null ? `#${p.number} ` : "";
      map.set(p.id, `${numStr}${p.firstName} ${p.lastName}`);
    }
    return map;
  }, [homePlayers, awayPlayers]);

  const events = eventsData?.events ?? [];

  // Marcador derivado de los eventos
  const homeGoals = events.filter(
    (e) => e.eventType === "gol" && e.teamId === homeTeamId,
  ).length;
  const awayGoals = events.filter(
    (e) => e.eventType === "gol" && e.teamId === awayTeamId,
  ).length;

  const isTie = homeGoals === awayGoals;

  async function handleAddEvent(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    try {
      const minVal = minute.trim() ? parseInt(minute.trim(), 10) : undefined;
      await createEventMutation.mutateAsync({
        eventType,
        teamId: selectedTeamId,
        playerId: selectedPlayerId || undefined,
        minute: minVal != null && !isNaN(minVal) ? minVal : undefined,
      });
      setMinute("");
      setSelectedPlayerId("");
    } catch (err: any) {
      setFormError(err?.message || "Error al registrar el evento");
    }
  }

  async function handleDeleteEvent(id: string) {
    setFormError(null);
    try {
      await deleteEventMutation.mutateAsync(id);
    } catch (err: any) {
      setFormError(err?.message || "Error al eliminar el evento");
    }
  }

  async function handleUpdateStatus() {
    setStatusMessage(null);
    setFormError(null);
    try {
      const payload: any = {
        status,
      };
      if (isTie && homePen !== "" && awayPen !== "") {
        payload.homePenalties = Number(homePen);
        payload.awayPenalties = Number(awayPen);
      } else if (!isTie) {
        payload.homePenalties = null;
        payload.awayPenalties = null;
      }

      await updateMatchMutation.mutateAsync({
        id: matchId,
        payload,
      });
      setStatusMessage("Estado del partido actualizado");
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: any) {
      setFormError(err?.message || "Error al actualizar el estado");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-base font-bold text-gray-900">
              Cédula de Partido & Eventos
            </h2>
            <p className="text-xs text-gray-500">
              {match.category?.title ? `${match.category.title} • ` : ""}
              {new Date(match.scheduledAt).toLocaleDateString("es-MX", {
                dateStyle: "medium",
              })}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto p-6 flex flex-col gap-6">
          {/* Marcador en vivo */}
          <div className="rounded-2xl bg-gradient-to-b from-gray-50 to-gray-100/60 p-5 border border-gray-200/80 shadow-xs">
            <div className="flex items-center justify-between gap-4">
              {/* Local */}
              <div className="flex-1 text-center sm:text-right">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Local
                </span>
                <p className="text-base sm:text-lg font-bold text-gray-900 truncate">
                  {homeName}
                </p>
              </div>

              {/* Scoreboard display */}
              <div className="flex flex-col items-center px-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl sm:text-4xl font-extrabold text-gray-900 tabular-nums">
                    {homeGoals}
                  </span>
                  <span className="text-xl font-medium text-gray-400">-</span>
                  <span className="text-3xl sm:text-4xl font-extrabold text-gray-900 tabular-nums">
                    {awayGoals}
                  </span>
                </div>
                {isTie && (homePen !== "" || awayPen !== "") && (
                  <span className="text-xs text-gray-500 mt-1">
                    (Penales: {homePen || "0"} - {awayPen || "0"})
                  </span>
                )}
                <span className="mt-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-white border border-gray-200 text-gray-600">
                  {MATCH_STATUS_LABELS[status]}
                </span>
              </div>

              {/* Visitante */}
              <div className="flex-1 text-center sm:text-left">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Visitante
                </span>
                <p className="text-base sm:text-lg font-bold text-gray-900 truncate">
                  {awayName}
                </p>
              </div>
            </div>

            {/* Selector de estado rápido */}
            <div className="mt-4 pt-3 border-t border-gray-200/60 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <label className="font-medium text-gray-600">Estado:</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as MatchStatus)}
                  className="rounded-lg border border-gray-300 bg-white px-2.5 py-1 text-xs text-gray-800 outline-none focus:border-primary"
                >
                  <option value="scheduled">Programado</option>
                  <option value="in_progress">En curso</option>
                  <option value="finished">Finalizado</option>
                  <option value="postponed">Pospuesto</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </div>

              {isTie && status === "finished" && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 font-medium">Penales:</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="Loc"
                    value={homePen}
                    onChange={(e) => setHomePen(e.target.value)}
                    className="w-12 rounded-lg border border-gray-300 bg-white px-1.5 py-1 text-center text-xs outline-none focus:border-primary"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="Vis"
                    value={awayPen}
                    onChange={(e) => setAwayPen(e.target.value)}
                    className="w-12 rounded-lg border border-gray-300 bg-white px-1.5 py-1 text-center text-xs outline-none focus:border-primary"
                  />
                </div>
              )}

              <button
                type="button"
                onClick={handleUpdateStatus}
                disabled={updateMatchMutation.isPending}
                className="rounded-lg bg-gray-800 text-white px-3 py-1 font-medium hover:bg-gray-900 disabled:opacity-50 transition-colors"
              >
                {updateMatchMutation.isPending
                  ? "Guardando..."
                  : "Actualizar estado"}
              </button>
            </div>

            {statusMessage && (
              <p className="mt-2 text-xs text-emerald-600 font-medium text-center">
                ✓ {statusMessage}
              </p>
            )}
          </div>

          {formError && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-600">
              {formError}
            </div>
          )}

          {/* Formulario para registrar gol o evento */}
          <div className="rounded-2xl border border-gray-200 p-4 bg-white">
            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-1.5">
              <span>⚽</span> Registrar Gol / Evento
            </h3>

            <form onSubmit={handleAddEvent} className="flex flex-col gap-3">
              {/* Selector de equipo */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTeamId(homeTeamId);
                    setSelectedPlayerId("");
                  }}
                  className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    selectedTeamId === homeTeamId
                      ? "bg-primary text-white border-primary shadow-xs"
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  Local: {homeName}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTeamId(awayTeamId);
                    setSelectedPlayerId("");
                  }}
                  className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    selectedTeamId === awayTeamId
                      ? "bg-primary text-white border-primary shadow-xs"
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  Visitante: {awayName}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Tipo de evento */}
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-medium text-gray-500">
                    Tipo de evento
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) =>
                      setEventType(e.target.value as MatchEventType)
                    }
                    className="min-h-9 px-2.5 rounded-lg border border-gray-200 bg-gray-50 text-xs text-gray-800 outline-none focus:bg-white focus:border-primary"
                  >
                    <option value="gol">⚽ Gol</option>
                    <option value="tarjeta_amarilla">
                      🟨 Tarjeta amarilla
                    </option>
                    <option value="tarjeta_roja">🟥 Tarjeta roja</option>
                    <option value="asistencia">🎯 Asistencia</option>
                    <option value="cambio">🔄 Cambio</option>
                    <option value="otro">📝 Otro</option>
                  </select>
                </div>

                {/* Jugador */}
                <div className="flex flex-col gap-1 sm:col-span-1">
                  <label className="text-[11px] font-medium text-gray-500">
                    Jugador (
                    {selectedTeamId === homeTeamId ? "Local" : "Visitante"})
                  </label>
                  <select
                    value={selectedPlayerId}
                    onChange={(e) => setSelectedPlayerId(e.target.value)}
                    className="min-h-9 px-2.5 rounded-lg border border-gray-200 bg-gray-50 text-xs text-gray-800 outline-none focus:bg-white focus:border-primary"
                  >
                    <option value="">
                      {isLoadingPlayers
                        ? "Cargando jugadores..."
                        : teamPlayers.length === 0
                          ? "(No hay jugadores en este equipo)"
                          : "(Sin asignar / Desconocido)"}
                    </option>
                    {teamPlayers.map((player) => (
                      <option key={player.id} value={player.id}>
                        {player.number != null ? `#${player.number} ` : ""}
                        {player.firstName} {player.lastName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Minuto */}
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-medium text-gray-500">
                    Minuto (opcional)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="0"
                      max="150"
                      value={minute}
                      onChange={(e) => setMinute(e.target.value)}
                      placeholder="Ej. 34"
                      className="w-full min-h-9 px-2.5 rounded-lg border border-gray-200 bg-gray-50 text-xs text-gray-800 outline-none focus:bg-white focus:border-primary"
                    />
                    <button
                      type="submit"
                      disabled={createEventMutation.isPending}
                      className="shrink-0 min-h-9 px-3.5 rounded-lg bg-primary text-white text-xs font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
                    >
                      {createEventMutation.isPending ? "..." : "+ Agregar"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Línea de tiempo / Eventos registrados */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-gray-900">
              Eventos registrados ({events.length})
            </h3>

            {isLoadingEvents ? (
              <p className="text-xs text-gray-400 py-3 text-center">
                Cargando eventos...
              </p>
            ) : events.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 p-4 text-center text-xs text-gray-400">
                No hay eventos registrados. Agrega goles o tarjetas arriba.
              </div>
            ) : (
              <div className="divide-y divide-gray-100 rounded-xl border border-gray-200 overflow-hidden bg-white">
                {events.map((evt) => {
                  const isHome = evt.teamId === homeTeamId;
                  const typeMeta =
                    EVENT_TYPE_LABELS[evt.eventType] || EVENT_TYPE_LABELS.otro;
                  const playerName = evt.playerId
                    ? playerMap.get(evt.playerId)
                    : null;

                  return (
                    <div
                      key={evt.id}
                      className="flex items-center justify-between px-3.5 py-2.5 hover:bg-gray-50/80 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 text-center text-xs font-bold text-gray-500 tabular-nums">
                          {evt.minute != null ? `${evt.minute}'` : "—"}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md border ${typeMeta.badge}`}
                        >
                          <span>{typeMeta.icon}</span>
                          <span>{typeMeta.label}</span>
                        </span>
                        <div>
                          <p className="text-xs font-semibold text-gray-800">
                            {playerName ?? "(Jugador sin asignar)"}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            {isHome ? homeName : awayName}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteEvent(evt.id)}
                        disabled={deleteEventMutation.isPending}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Eliminar evento"
                      >
                        🗑️
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="min-h-9 px-4 rounded-xl bg-white border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

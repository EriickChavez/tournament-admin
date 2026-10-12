import { useMemo, useState } from "react";
import { useMembers } from "../../members/hooks/use-members";
import {
  useMatchReferees,
  useSetMatchReferees,
} from "../hooks/use-match-referees";
import { getMatchErrorMessage } from "../utils/match-error-message";
import type { Match } from "../types";

const MAX_REFEREES = 10;

interface MatchRefereesModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: Match | null;
  tournamentId: string;
  /** Solo el dueño del torneo puede asignar; los demás ven la lista. */
  canEdit: boolean;
}

export function MatchRefereesModal({
  isOpen,
  onClose,
  match,
  tournamentId,
  canEdit,
}: MatchRefereesModalProps) {
  if (!isOpen || !match) return null;
  // key: al cambiar de partido se reinicia el borrador.
  return (
    <MatchRefereesContent
      key={match.id}
      onClose={onClose}
      match={match}
      tournamentId={tournamentId}
      canEdit={canEdit}
    />
  );
}

function MatchRefereesContent({
  onClose,
  match,
  tournamentId,
  canEdit,
}: {
  onClose: () => void;
  match: Match;
  tournamentId: string;
  canEdit: boolean;
}) {
  const membersQuery = useMembers(tournamentId);
  const refereesQuery = useMatchReferees(match.id);
  const setReferees = useSetMatchReferees(match.id);

  // null = sin cambios del usuario: se muestra lo que hay en el servidor.
  const [draft, setDraft] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const members = useMemo(
    () =>
      [...(membersQuery.data?.members ?? [])].sort((a, b) =>
        a.displayName.localeCompare(b.displayName),
      ),
    [membersQuery.data],
  );

  const serverIds = refereesQuery.data?.refereeUserIds ?? [];
  const selected = draft ?? serverIds;
  const isLoading = membersQuery.isLoading || refereesQuery.isLoading;
  const loadError = membersQuery.error ?? refereesQuery.error;
  const isDirty =
    draft !== null &&
    (draft.length !== serverIds.length ||
      draft.some((id) => !serverIds.includes(id)));

  function toggle(userId: string) {
    setError(null);
    setDraft(
      selected.includes(userId)
        ? selected.filter((id) => id !== userId)
        : [...selected, userId],
    );
  }

  function handleSave() {
    setError(null);
    setReferees.mutate(selected, {
      onSuccess: onClose,
      onError: (err) => setError(getMatchErrorMessage(err)),
    });
  }

  const homeName = match.homeTeam?.name ?? "Local";
  const awayName = match.awayTeam?.name ?? "Visitante";
  const assignedMembers = members.filter((m) => selected.includes(m.userId));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="min-w-0">
            <h2 className="text-base font-bold text-gray-900">
              Árbitros del partido
            </h2>
            <p className="text-xs text-gray-500 truncate">
              {homeName} vs {awayName} •{" "}
              {new Date(match.scheduledAt).toLocaleDateString("es-MX", {
                dateStyle: "medium",
              })}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 shrink-0 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-4 flex flex-col gap-3">
          {isLoading && (
            <p className="text-sm text-gray-400 py-2">Cargando...</p>
          )}

          {!isLoading && loadError && (
            <div className="rounded-xl bg-red-50 border border-red-100 px-3 py-2 text-sm text-red-600">
              {getMatchErrorMessage(loadError)}
            </div>
          )}

          {!isLoading && !loadError && canEdit && (
            <div className="flex flex-col gap-2">
              {members.map((member) => {
                const checked = selected.includes(member.userId);
                const disabled = !checked && selected.length >= MAX_REFEREES;
                return (
                  <label
                    key={member.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                      checked
                        ? "border-primary bg-primary/5"
                        : "border-gray-100 hover:bg-gray-50"
                    } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={disabled}
                      onChange={() => toggle(member.userId)}
                      className="h-4 w-4 accent-primary"
                    />
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[11px] font-bold text-primary">
                      {member.displayName.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {member.displayName}
                      </p>
                      <p className="text-xs text-gray-400">
                        {member.roleName === "OWNER" ? "Dueño" : "Admin"}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          )}

          {!isLoading && !loadError && !canEdit && (
            <div className="flex flex-col gap-2">
              {assignedMembers.length === 0 ? (
                <p className="text-sm text-gray-500">
                  Este partido no tiene árbitros asignados.
                </p>
              ) : (
                assignedMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 p-3 rounded-xl border border-gray-100"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[11px] font-bold text-primary">
                      {member.displayName.slice(0, 2).toUpperCase()}
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {member.displayName}
                    </p>
                  </div>
                ))
              )}
              <p className="text-xs text-gray-400">
                Solo el dueño del torneo puede asignar árbitros.
              </p>
            </div>
          )}

          {!isLoading && !loadError && (
            <p className="text-[11px] text-gray-400">
              Sin árbitros asignados, cualquier administrador del torneo puede
              operar la cédula. Con árbitros asignados, solo ellos y el dueño.
            </p>
          )}

          {error && (
            <div className="rounded-xl bg-red-50 border border-red-100 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-gray-100 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="min-h-10 px-4 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            {canEdit ? "Cancelar" : "Cerrar"}
          </button>
          {canEdit && (
            <button
              type="button"
              onClick={handleSave}
              disabled={!isDirty || setReferees.isPending || isLoading}
              className="min-h-10 px-4 rounded-xl bg-primary text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {setReferees.isPending ? "Guardando..." : "Guardar"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

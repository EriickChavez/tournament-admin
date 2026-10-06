import { useState } from "react";
import { useCategoryClosures } from "../hooks/use-category-closures";
import { useCloseCategory } from "../hooks/use-close-category";
import { useReopenCategory } from "../hooks/use-reopen-category";
import { getBracketErrorMessage } from "../../brackets/utils/bracket-error-message";

interface ChampionshipClosurePanelProps {
  tournamentId: string;
  categoryId: string;
  /** Campeón detectado en la llave (ganador de la final); null si aún no hay. */
  championName: string | null;
  teamName: (id: string) => string;
}

export function ChampionshipClosurePanel({
  tournamentId,
  categoryId,
  championName,
  teamName,
}: ChampionshipClosurePanelProps) {
  const closuresQuery = useCategoryClosures(tournamentId);
  const closeCategory = useCloseCategory(tournamentId, categoryId);
  const reopenCategory = useReopenCategory(tournamentId, categoryId);
  const [error, setError] = useState<string | null>(null);

  const closure =
    closuresQuery.data?.closures.find((c) => c.categoryId === categoryId) ??
    null;

  function handleClose() {
    const ok = window.confirm(
      `Vas a cerrar el campeonato de esta categoría${championName ? ` con ${championName} como campeón` : ""}.\n\nYa no se podrán crear fases nuevas en ella. Podrás reabrirlo si te equivocas.\n\n¿Continuar?`,
    );
    if (!ok) return;
    setError(null);
    closeCategory.mutate(undefined, {
      onError: (err) => setError(getBracketErrorMessage(err)),
    });
  }

  function handleReopen() {
    const ok = window.confirm(
      "Reabrir el campeonato permite volver a crear fases en esta categoría.\n\n¿Reabrirlo?",
    );
    if (!ok) return;
    setError(null);
    reopenCategory.mutate(undefined, {
      onError: (err) => setError(getBracketErrorMessage(err)),
    });
  }

  // Campeonato cerrado.
  if (closure) {
    return (
      <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-green-800">
              Campeonato cerrado
            </h3>
            <p className="text-xs text-green-700">
              Campeón:{" "}
              <strong>
                {closure.championTeamId
                  ? teamName(closure.championTeamId)
                  : "—"}
              </strong>
              {" · "}
              cerrado el{" "}
              {new Date(closure.closedAt).toLocaleString("es-MX", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
              . No se pueden crear fases nuevas en esta categoría.
            </p>
          </div>
          <button
            type="button"
            onClick={handleReopen}
            disabled={reopenCategory.isPending}
            className="min-h-9 shrink-0 rounded-xl border border-green-300 bg-white px-4 text-xs font-medium text-green-800 hover:bg-green-100 disabled:opacity-50"
          >
            {reopenCategory.isPending ? "Reabriendo..." : "Reabrir campeonato"}
          </button>
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
    );
  }

  // Ya hay campeón pero el campeonato sigue abierto: se sugiere cerrarlo (el cierre es manual).
  if (championName) {
    return (
      <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-blue-800">
              Ya hay campeón
            </h3>
            <p className="text-xs text-blue-700">
              <strong>{championName}</strong> ganó la final. Cierra el
              campeonato para dejarlo definido e impedir fases nuevas en esta
              categoría.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={closeCategory.isPending}
            className="min-h-9 shrink-0 rounded-xl bg-primary px-4 text-xs font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            {closeCategory.isPending ? "Cerrando..." : "Cerrar campeonato"}
          </button>
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
    );
  }

  return null;
}

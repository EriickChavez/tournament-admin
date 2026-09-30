import { useState } from "react";
import { useCreatePhaseGroup } from "../hooks/use-create-phase-group";
import { useDeletePhaseGroup } from "../hooks/use-delete-phase-group";
import { getPhaseErrorMessage } from "../utils/phase-error-message";
import type { PhaseGroup } from "../types";

interface PhaseGroupsPanelProps {
  phaseId: string;
  groups: PhaseGroup[];
}

const MAX_GENERATED_GROUPS = 26; // A–Z

export function PhaseGroupsPanel({ phaseId, groups }: PhaseGroupsPanelProps) {
  const createGroup = useCreatePhaseGroup(phaseId);
  const deleteGroup = useDeletePhaseGroup(phaseId);

  const [name, setName] = useState("");
  const [count, setCount] = useState(12);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAdd() {
    const trimmed = name.trim();
    if (!trimmed) return;
    setError(null);
    try {
      await createGroup.mutateAsync({
        name: trimmed,
        sortOrder: groups.length + 1,
      });
      setName("");
    } catch (err) {
      setError(getPhaseErrorMessage(err));
    }
  }

  // Crea "Grupo A", "Grupo B"... hasta llegar a `count`, saltando los que ya existen.
  async function handleGenerate() {
    setError(null);
    setIsGenerating(true);
    const existing = new Set(groups.map((g) => g.name));
    try {
      for (let i = 0; i < count; i += 1) {
        const groupName = `Grupo ${String.fromCharCode(65 + i)}`;
        if (existing.has(groupName)) continue;
        await createGroup.mutateAsync({ name: groupName, sortOrder: i + 1 });
      }
    } catch (err) {
      setError(getPhaseErrorMessage(err));
    } finally {
      setIsGenerating(false);
    }
  }

  function handleDelete(group: PhaseGroup) {
    if (
      !window.confirm(
        `¿Eliminar "${group.name}"? Los equipos asignados quedarán sin grupo.`,
      )
    ) {
      return;
    }
    setError(null);
    deleteGroup.mutate(group.id, {
      onError: (err) => setError(getPhaseErrorMessage(err)),
    });
  }

  const busy = isGenerating || createGroup.isPending;

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <h2 className="text-base font-bold text-gray-900">Grupos</h2>
      <p className="mb-4 text-xs text-gray-500">
        Crea los grupos de esta fase y luego asigna los equipos abajo.
      </p>

      {groups.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {groups.map((group) => (
            <span
              key={group.id}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 py-1 pl-3 pr-1 text-sm text-gray-800"
            >
              {group.name}
              <button
                type="button"
                onClick={() => handleDelete(group)}
                disabled={deleteGroup.isPending}
                title="Eliminar grupo"
                className="flex h-6 w-6 items-center justify-center rounded-md text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex flex-1 gap-2">
          <input
            type="text"
            value={name}
            maxLength={100}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="Nombre del grupo"
            className="min-h-10 flex-1 rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-primary"
          />
          <button
            type="button"
            onClick={handleAdd}
            disabled={busy || !name.trim()}
            className="min-h-10 rounded-xl bg-primary px-4 text-xs font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            Agregar
          </button>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="number"
            min={1}
            max={MAX_GENERATED_GROUPS}
            value={count}
            onChange={(e) =>
              setCount(
                Math.min(
                  MAX_GENERATED_GROUPS,
                  Math.max(1, Number(e.target.value) || 1),
                ),
              )
            }
            className="min-h-10 w-20 rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-primary"
          />
          <button
            type="button"
            onClick={handleGenerate}
            disabled={busy}
            className="min-h-10 rounded-xl border border-gray-200 bg-white px-4 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            {isGenerating ? "Generando..." : "Generar grupos A, B, C..."}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-3 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
}

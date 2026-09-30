import type { Phase } from "../types";
import { PHASE_STATUS_LABELS, PHASE_TYPE_LABELS } from "../types";

const PencilIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
  </svg>
);

const TrashIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
);

interface PhaseItemProps {
  phase: Phase;
  onEdit: (phase: Phase) => void;
  onDelete: (phase: Phase) => void;
  onOpen: (phase: Phase) => void;
  isDeleting?: boolean;
}

const statusStyles: Record<string, string> = {
  upcoming: "bg-amber-50 text-amber-700 border-amber-200",
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  finished: "bg-gray-100 text-gray-600 border-gray-200",
};

export function PhaseItem({
  phase,
  onEdit,
  onDelete,
  onOpen,
  isDeleting,
}: PhaseItemProps) {
  return (
    <div className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white px-4 py-3.5 transition-colors hover:border-gray-300 hover:bg-gray-50/50">
      <button
        type="button"
        onClick={() => onOpen(phase)}
        className="min-w-0 flex-1 text-left"
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-gray-900">{phase.name}</span>
          <span className="rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-600">
            {PHASE_TYPE_LABELS[phase.type]}
          </span>
          <span
            className={`rounded-md border px-2 py-0.5 text-xs font-medium ${statusStyles[phase.status] ?? statusStyles.upcoming}`}
          >
            {PHASE_STATUS_LABELS[phase.status]}
          </span>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Orden {phase.sortOrder}
          {phase.startDate ? ` · ${phase.startDate}` : ""}
          {phase.endDate ? ` → ${phase.endDate}` : ""}
        </p>
      </button>

      <div className="flex shrink-0 items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={() => onEdit(phase)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800"
          title="Editar"
        >
          <PencilIcon />
        </button>
        <button
          type="button"
          onClick={() => onDelete(phase)}
          disabled={isDeleting}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
          title="Eliminar"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
}

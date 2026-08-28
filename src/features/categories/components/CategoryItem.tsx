import type { Category } from "../types";

const EditIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const TrashIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

interface CategoryItemProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  isDeleting: boolean;
}

export function CategoryItem({
  category,
  onEdit,
  onDelete,
  isDeleting,
}: CategoryItemProps) {
  function renderAgeBadge() {
    if (category.minAge !== null && category.maxAge !== null) {
      return `${category.minAge} - ${category.maxAge} años`;
    }
    if (category.minAge !== null) {
      return `Mín. ${category.minAge} años`;
    }
    if (category.maxAge !== null) {
      return `Máx. ${category.maxAge} años`;
    }
    return "Todas las edades";
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-colors">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          <h3 className="text-base font-bold text-gray-900 truncate">
            {category.title}
          </h3>
          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[11px] font-semibold">
            {renderAgeBadge()}
          </span>
          {category.order !== undefined && category.order > 0 && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-gray-200/60 text-gray-600 text-[10px] font-medium">
              Orden: {category.order}
            </span>
          )}
        </div>

        {category.description ? (
          <p className="text-xs text-gray-500 line-clamp-2">
            {category.description}
          </p>
        ) : (
          <p className="text-xs text-gray-400 italic">Sin descripción</p>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
        <button
          type="button"
          onClick={() => onEdit(category)}
          className="min-h-8 px-3 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 hover:text-primary transition-colors flex items-center gap-1.5"
          title="Editar categoría"
        >
          <EditIcon />
          Editar
        </button>
        <button
          type="button"
          disabled={isDeleting}
          onClick={() => onDelete(category)}
          className="min-h-8 px-3 rounded-lg border border-red-200 text-xs font-medium text-red-600 bg-white hover:bg-red-50 disabled:opacity-50 transition-colors flex items-center gap-1.5"
          title="Eliminar categoría"
        >
          <TrashIcon />
          Eliminar
        </button>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useCategories } from "../hooks/use-categories";
import { useCreateCategory } from "../hooks/use-create-category";
import { useUpdateCategory } from "../hooks/use-update-category";
import { useDeleteCategory } from "../hooks/use-delete-category";
import { CategoryItem } from "./CategoryItem";
import { CategoryFormModal } from "./CategoryFormModal";
import { getCategoryErrorMessage } from "../utils/category-error-message";
import type { Category } from "../types";
import type { CategoryFormOutput } from "../schemas/category-schema";

const PlusIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const TagIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);

interface CategoriesSectionProps {
  tournamentId: string;
}

export function CategoriesSection({ tournamentId }: CategoriesSectionProps) {
  const { data, isLoading, isError, error, refetch } =
    useCategories(tournamentId);

  const createCategory = useCreateCategory(tournamentId);
  const updateCategory = useUpdateCategory(tournamentId);
  const deleteCategory = useDeleteCategory(tournamentId);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  const categories = data?.categories ?? [];

  function handleOpenCreate() {
    setEditingCategory(null);
    setModalError(null);
    setModalOpen(true);
  }

  function handleOpenEdit(category: Category) {
    setEditingCategory(category);
    setModalError(null);
    setModalOpen(true);
  }

  function handleCloseModal() {
    setModalOpen(false);
    setEditingCategory(null);
    setModalError(null);
  }

  function handleSubmitForm(values: CategoryFormOutput) {
    setModalError(null);

    const payload = {
      title: values.title,
      minAge: values.minAge,
      maxAge: values.maxAge,
      description: values.description,
      order: values.order,
    };

    if (editingCategory) {
      updateCategory.mutate(
        { id: editingCategory.id, payload },
        {
          onSuccess: () => handleCloseModal(),
          onError: (err) => setModalError(getCategoryErrorMessage(err)),
        },
      );
    } else {
      createCategory.mutate(payload, {
        onSuccess: () => handleCloseModal(),
        onError: (err) => setModalError(getCategoryErrorMessage(err)),
      });
    }
  }

  function handleDeleteCategory(category: Category) {
    const isConfirm = window.confirm(
      `¿Estás seguro de que deseas eliminar la categoría "${category.title}"?`,
    );
    if (!isConfirm) return;

    deleteCategory.mutate(category.id, {
      onError: (err) => {
        alert(getCategoryErrorMessage(err));
      },
    });
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Section Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <TagIcon />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-gray-900">Categorías</h2>
              <span className="px-2 py-0.5 rounded-full bg-gray-100 text-xs font-semibold text-gray-600">
                {categories.length}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Administra las divisiones o categorías de este torneo
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="min-h-9 px-3.5 rounded-xl bg-primary text-white text-xs font-medium flex items-center gap-1.5 hover:opacity-90 transition-opacity"
        >
          <PlusIcon />
          Nueva categoría
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center gap-2 text-sm text-gray-400 py-8">
          <svg
            className="animate-spin text-primary"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <path d="M12 2a10 10 0 0 1 10 10" opacity="0.3" />
            <path d="M12 2a10 10 0 0 1 10 10" />
          </svg>
          Cargando categorías...
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="rounded-xl bg-red-50 border border-red-100 p-4 flex flex-col items-start gap-2">
          <p className="text-xs text-red-600">
            {getCategoryErrorMessage(error)}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="text-xs text-red-700 underline font-medium hover:opacity-80"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && categories.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center py-10 px-4 rounded-xl border border-dashed border-gray-200 bg-gray-50/50">
          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
            <TagIcon />
          </div>
          <h3 className="text-sm font-semibold text-gray-800">
            No hay categorías registradas
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mt-1 mb-4">
            Crea categorías (ej. Sub-15, Libre, Veteranos) para organizar los
            equipos y partidos de tu torneo.
          </p>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="min-h-9 px-4 rounded-xl bg-primary text-white text-xs font-medium hover:opacity-90 transition-opacity"
          >
            + Crear primera categoría
          </button>
        </div>
      )}

      {/* Category List */}
      {!isLoading && !isError && categories.length > 0 && (
        <div className="flex flex-col gap-2.5">
          {categories.map((cat) => (
            <CategoryItem
              tournamentId={tournamentId}
              key={cat.id}
              category={cat}
              onEdit={handleOpenEdit}
              onDelete={handleDeleteCategory}
              isDeleting={deleteCategory.isPending}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <CategoryFormModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitForm}
        category={editingCategory}
        isSubmitting={createCategory.isPending || updateCategory.isPending}
        errorMessage={modalError}
      />
    </div>
  );
}

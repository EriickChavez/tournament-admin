import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  categoryFormSchema,
  type CategoryFormValues,
  type CategoryFormOutput,
} from "../schemas/category-schema";
import type { Category } from "../types";

const CloseIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: CategoryFormOutput) => void;
  category?: Category | null;
  isSubmitting: boolean;
  errorMessage?: string | null;
}

export function CategoryFormModal({
  isOpen,
  onClose,
  onSubmit,
  category,
  isSubmitting,
  errorMessage,
}: CategoryFormModalProps) {
  const isEdit = Boolean(category);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues, unknown, CategoryFormOutput>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      title: "",
      minAge: "",
      maxAge: "",
      description: "",
      order: "0",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (category) {
        reset({
          title: category.title,
          minAge: category.minAge !== null ? String(category.minAge) : "",
          maxAge: category.maxAge !== null ? String(category.maxAge) : "",
          description: category.description ?? "",
          order: String(category.order ?? 0),
        });
      } else {
        reset({
          title: "",
          minAge: "",
          maxAge: "",
          description: "",
          order: "0",
        });
      }
    }
  }, [isOpen, category, reset]);

  if (!isOpen) return null;

  const inputClass =
    "w-full min-h-11 px-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-100 p-6 z-10 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {isEdit ? "Editar categoría" : "Nueva categoría"}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {isEdit
                ? "Modifica los datos de la categoría"
                : "Define los detalles y restricciones de la categoría"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="cat-title"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Nombre de la categoría <span className="text-red-500">*</span>
            </label>
            <input
              id="cat-title"
              placeholder="Ej. Libre Varonil, Sub-18, Veteranos"
              className={inputClass}
              {...register("title")}
            />
            {errors.title && (
              <p className="text-xs text-red-500 mt-1.5">{errors.title.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="cat-minAge"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Edad mínima <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <input
                id="cat-minAge"
                type="number"
                min={0}
                max={120}
                placeholder="Ej. 18"
                className={inputClass}
                {...register("minAge")}
              />
              {errors.minAge && (
                <p className="text-xs text-red-500 mt-1.5">
                  {errors.minAge.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="cat-maxAge"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Edad máxima <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <input
                id="cat-maxAge"
                type="number"
                min={0}
                max={120}
                placeholder="Ej. 35"
                className={inputClass}
                {...register("maxAge")}
              />
              {errors.maxAge && (
                <p className="text-xs text-red-500 mt-1.5">
                  {errors.maxAge.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label
                htmlFor="cat-order"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Orden de visualización
              </label>
              <input
                id="cat-order"
                type="number"
                placeholder="0"
                className={inputClass}
                {...register("order")}
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Número para ordenar la posición en la lista (menor número = más arriba).
              </p>
              {errors.order && (
                <p className="text-xs text-red-500 mt-1.5">
                  {errors.order.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="cat-description"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Descripción o reglas <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <textarea
              id="cat-description"
              rows={3}
              placeholder="Reglas especiales, formato de juego o especificaciones..."
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs text-red-500 mt-1.5">
                {errors.description.message}
              </p>
            )}
          </div>

          {errorMessage && (
            <div className="rounded-xl bg-red-50 border border-red-100 p-3">
              <p className="text-xs text-red-600">{errorMessage}</p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 mt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="min-h-10 px-4 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="min-h-10 px-5 rounded-xl bg-primary text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {isSubmitting
                ? "Guardando..."
                : isEdit
                  ? "Guardar cambios"
                  : "Crear categoría"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

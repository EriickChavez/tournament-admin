import { useState } from "react";
import { useSponsors } from "../hooks/use-sponsors";
import { useCreateSponsor } from "../hooks/use-create-sponsor";
import { useUpdateSponsor } from "../hooks/use-update-sponsor";
import { useDeleteSponsor } from "../hooks/use-delete-sponsor";
import { SponsorItem } from "./SponsorItem";
import { SponsorFormModal, type SponsorSubmitValues } from "./SponsorFormModal";
import { getSponsorErrorMessage } from "../utils/sponsor-error-message";
import type { TournamentSponsor } from "../types";

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

const StarIcon = () => (
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
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

interface SponsorsSectionProps {
  tournamentId: string;
  // Si el torneo aún no expone maxSponsors (torneos creados antes de este campo,
  // o algún desfase de caché), asumimos 0 y bloqueamos la creación por seguridad
  // en lugar de dejar pasar creaciones sin límite conocido.
  maxSponsors: number;
}

export function SponsorsSection({
  tournamentId,
  maxSponsors,
}: SponsorsSectionProps) {
  const { data, isLoading, isError, error, refetch } =
    useSponsors(tournamentId);

  const createSponsor = useCreateSponsor(tournamentId);
  const updateSponsor = useUpdateSponsor(tournamentId);
  const deleteSponsor = useDeleteSponsor(tournamentId);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingSponsor, setEditingSponsor] =
    useState<TournamentSponsor | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  const sponsors = data?.sponsors ?? [];
  const availableSlots = Math.max(maxSponsors - sponsors.length, 0);
  const limitReached = availableSlots <= 0;

  function handleOpenCreate() {
    if (limitReached) return; // seguro extra: el botón ya está deshabilitado en este caso
    setEditingSponsor(null);
    setModalError(null);
    setModalOpen(true);
  }

  function handleOpenEdit(sponsor: TournamentSponsor) {
    setEditingSponsor(sponsor);
    setModalError(null);
    setModalOpen(true);
  }

  function handleCloseModal() {
    setModalOpen(false);
    setEditingSponsor(null);
    setModalError(null);
  }

  function handleSubmitForm(values: SponsorSubmitValues) {
    setModalError(null);
    const { logo, ...rest } = values;

    if (editingSponsor) {
      updateSponsor.mutate(
        { id: editingSponsor.id, payload: { ...rest, logo } },
        {
          onSuccess: () => handleCloseModal(),
          onError: (err) => setModalError(getSponsorErrorMessage(err)),
        },
      );
    } else {
      createSponsor.mutate(
        { ...rest, logo },
        {
          onSuccess: () => handleCloseModal(),
          // Si por una condición de carrera el backend igual rechaza por límite
          // (ej. otro admin creó un sponsor al mismo tiempo), se muestra el error real.
          onError: (err) => setModalError(getSponsorErrorMessage(err)),
        },
      );
    }
  }

  function handleDeleteSponsor(sponsor: TournamentSponsor) {
    const isConfirm = window.confirm(
      `¿Estás seguro de que deseas eliminar al sponsor "${sponsor.name}"?`,
    );
    if (!isConfirm) return;

    deleteSponsor.mutate(sponsor.id, {
      onError: (err) => alert(getSponsorErrorMessage(err)),
    });
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Section Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <StarIcon />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-gray-900">Sponsors</h2>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  limitReached
                    ? "bg-red-100 text-red-600"
                    : "bg-gray-100 text-gray-600"
                }`}
                title="Sponsors usados / límite máximo del torneo"
              >
                {sponsors.length} / {maxSponsors}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              {limitReached
                ? "Alcanzaste el límite de sponsors de este torneo. Contacta al administrador de la plataforma para aumentarlo."
                : `Puedes agregar ${availableSlots} sponsor${availableSlots === 1 ? "" : "s"} más`}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          disabled={limitReached}
          title={limitReached ? "Límite de sponsors alcanzado" : undefined}
          className="min-h-9 px-3.5 rounded-xl bg-primary text-white text-xs font-medium flex items-center gap-1.5 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:opacity-40 transition-opacity"
        >
          <PlusIcon />
          Nuevo sponsor
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
          Cargando sponsors...
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="rounded-xl bg-red-50 border border-red-100 p-4 flex flex-col items-start gap-2">
          <p className="text-xs text-red-600">
            {getSponsorErrorMessage(error)}
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
      {!isLoading && !isError && sponsors.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center py-10 px-4 rounded-xl border border-dashed border-gray-200 bg-gray-50/50">
          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
            <StarIcon />
          </div>
          <h3 className="text-sm font-semibold text-gray-800">
            No hay sponsors registrados
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mt-1 mb-4">
            Este torneo admite hasta {maxSponsors} sponsor
            {maxSponsors === 1 ? "" : "s"}.
          </p>
          {!limitReached && (
            <button
              type="button"
              onClick={handleOpenCreate}
              className="min-h-9 px-4 rounded-xl bg-primary text-white text-xs font-medium hover:opacity-90 transition-opacity"
            >
              + Agregar primer sponsor
            </button>
          )}
        </div>
      )}

      {/* Sponsor List */}
      {!isLoading && !isError && sponsors.length > 0 && (
        <div className="flex flex-col gap-2.5">
          {sponsors.map((sponsor) => (
            <SponsorItem
              key={sponsor.id}
              sponsor={sponsor}
              onEdit={handleOpenEdit}
              onDelete={handleDeleteSponsor}
              isDeleting={deleteSponsor.isPending}
            />
          ))}
        </div>
      )}

      <SponsorFormModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitForm}
        sponsor={editingSponsor}
        isSubmitting={createSponsor.isPending || updateSponsor.isPending}
        errorMessage={modalError}
      />
    </div>
  );
}

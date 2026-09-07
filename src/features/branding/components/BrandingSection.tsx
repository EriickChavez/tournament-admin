import { useEffect, useState } from "react";
import { env } from "../../../app/env";
import { ApiError } from "../../../shared/types/api-error";
import { useBranding } from "../hooks/use-branding";
import { useUpsertBranding } from "../hooks/use-upsert-branding";
import { validateBrandingFile } from "../utils/file-validation";
import { getBrandingErrorMessage } from "../utils/branding-error-message";
import { BrandingImageCard } from "./BrandingImageCard";

const ImageIcon = () => (
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
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

interface BrandingSectionProps {
  tournamentId: string;
}

export function BrandingSection({ tournamentId }: BrandingSectionProps) {
  const { data, isLoading, isError, error } = useBranding(tournamentId);
  const upsertBranding = useUpsertBranding(tournamentId);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    logo?: string;
    banner?: string;
  }>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [justSaved, setJustSaved] = useState(false);

  // Libera los object URLs al reemplazarlos o desmontar, para no dejar memoria colgada.
  useEffect(() => {
    return () => {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
    };
  }, [logoPreview]);

  useEffect(() => {
    return () => {
      if (bannerPreview) URL.revokeObjectURL(bannerPreview);
    };
  }, [bannerPreview]);

  // El torneo puede simplemente no tener branding todavía (404 esperado),
  // eso no es un error que deba bloquear el formulario.
  const isNotFound =
    error instanceof ApiError && error.code === "BRANDING_NOT_FOUND";
  const branding = data?.branding;

  const currentLogoUrl = branding?.logoUrl
    ? `${env.VITE_API_URL}${branding.logoUrl}`
    : null;
  const currentBannerUrl = branding?.bannerUrl
    ? `${env.VITE_API_URL}${branding.bannerUrl}`
    : null;

  function handleSelectLogo(file: File) {
    const validationError = validateBrandingFile(file, "logo");
    setFieldErrors((prev) => ({ ...prev, logo: validationError ?? undefined }));
    setJustSaved(false);
    if (validationError) return;

    if (logoPreview) URL.revokeObjectURL(logoPreview);
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  }

  function handleSelectBanner(file: File) {
    const validationError = validateBrandingFile(file, "banner");
    setFieldErrors((prev) => ({
      ...prev,
      banner: validationError ?? undefined,
    }));
    setJustSaved(false);
    if (validationError) return;

    if (bannerPreview) URL.revokeObjectURL(bannerPreview);
    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
  }

  function handleSave() {
    if (!logoFile && !bannerFile) return;
    setSubmitError(null);

    upsertBranding.mutate(
      { logo: logoFile ?? undefined, banner: bannerFile ?? undefined },
      {
        onSuccess: () => {
          setLogoFile(null);
          setBannerFile(null);
          setLogoPreview(null);
          setBannerPreview(null);
          setJustSaved(true);
        },
        onError: (err) => setSubmitError(getBrandingErrorMessage(err)),
      },
    );
  }

  const hasPendingChanges = Boolean(logoFile || bannerFile);
  const hasFieldErrors = Boolean(fieldErrors.logo || fieldErrors.banner);

  return (
    <div className="flex flex-col gap-5">
      {/* Section Header */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
          <ImageIcon />
        </div>
        <div>
          <h2 className="text-base font-bold text-gray-900">Branding</h2>
          <p className="text-xs text-gray-500">
            Personaliza el logo y el banner públicos de este torneo
          </p>
        </div>
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
          Cargando branding...
        </div>
      )}

      {/* Error real (distinto de "sin branding aún") */}
      {isError && !isNotFound && (
        <div className="rounded-xl bg-red-50 border border-red-100 p-4">
          <p className="text-xs text-red-600">
            {getBrandingErrorMessage(error)}
          </p>
        </div>
      )}

      {/* Formulario de logo/banner */}
      {!isLoading && (isNotFound || !isError) && (
        <div className="rounded-2xl border border-gray-200/70 p-5 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <BrandingImageCard
              label="Logo"
              hint="Cuadrado, PNG/JPEG/WEBP, máx. 2MB"
              currentUrl={currentLogoUrl}
              previewUrl={logoPreview}
              onSelectFile={handleSelectLogo}
              error={fieldErrors.logo}
              aspect="square"
            />

            <div className="flex-1">
              <BrandingImageCard
                label="Banner"
                hint="Panorámico, PNG/JPEG/WEBP, máx. 5MB"
                currentUrl={currentBannerUrl}
                previewUrl={bannerPreview}
                onSelectFile={handleSelectBanner}
                error={fieldErrors.banner}
                aspect="wide"
              />
            </div>
          </div>

          {submitError && (
            <div className="rounded-xl bg-red-50 border border-red-100 p-3">
              <p className="text-xs text-red-600">{submitError}</p>
            </div>
          )}

          {justSaved && !hasPendingChanges && (
            <div className="rounded-xl bg-green-50 border border-green-100 p-3">
              <p className="text-xs text-green-700">
                Branding actualizado correctamente
              </p>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              disabled={
                !hasPendingChanges || upsertBranding.isPending || hasFieldErrors
              }
              onClick={handleSave}
              className="min-h-10 px-5 rounded-xl bg-primary text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {upsertBranding.isPending ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

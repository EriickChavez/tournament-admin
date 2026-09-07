import { useRef } from "react";

const UploadIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="16 16 12 12 8 16" />
    <line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
  </svg>
);

interface BrandingImageCardProps {
  label: string;
  hint: string;
  currentUrl: string | null;
  previewUrl: string | null;
  onSelectFile: (file: File) => void;
  error?: string | null;
  aspect: "square" | "wide";
}

export function BrandingImageCard({
  label,
  hint,
  currentUrl,
  previewUrl,
  onSelectFile,
  error,
  aspect,
}: BrandingImageCardProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const displayUrl = previewUrl ?? currentUrl;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onSelectFile(file);
    e.target.value = "";
  }

  return (
    <div className="flex flex-col gap-2">
      <div>
        <p className="text-sm font-medium text-gray-700">{label}</p>
        <p className="text-xs text-gray-400">{hint}</p>
      </div>

      <div
        onClick={() => fileRef.current?.click()}
        className={[
          "relative rounded-xl border-2 border-dashed overflow-hidden group cursor-pointer transition-all duration-200",
          aspect === "square" ? "h-32 w-32" : "h-32 w-full",
          error
            ? "border-red-300 bg-red-50/50"
            : "border-gray-200 bg-gray-50 hover:border-primary hover:bg-blue-50/40",
        ].join(" ")}
      >
        {displayUrl ? (
          <>
            <img
              src={displayUrl}
              alt={label}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-xs font-medium bg-black/50 px-3 py-1.5 rounded-full">
                Cambiar imagen
              </span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-1.5 text-gray-400 group-hover:text-primary transition-colors px-2 text-center">
            <UploadIcon />
            <span className="text-xs font-medium">Subir imagen</span>
          </div>
        )}

        {previewUrl && (
          <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-full bg-primary text-white text-[10px] font-semibold">
            Nuevo
          </span>
        )}

        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={handleChange}
        />
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

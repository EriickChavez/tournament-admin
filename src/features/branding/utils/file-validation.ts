export const ALLOWED_MIME_TYPES = ["image/png", "image/jpeg", "image/webp"];
export const MAX_LOGO_SIZE_MB = 2;
export const MAX_BANNER_SIZE_MB = 5;

export function validateBrandingFile(
    file: File,
    kind: "logo" | "banner"
): string | null {
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        return "Formato no permitido. Usa PNG, JPEG o WEBP.";
    }

    const maxMb = kind === "logo" ? MAX_LOGO_SIZE_MB : MAX_BANNER_SIZE_MB;
    if (file.size > maxMb * 1024 * 1024) {
        return `El archivo excede el máximo de ${maxMb}MB.`;
    }

    return null;
}
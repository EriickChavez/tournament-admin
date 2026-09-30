import { ApiError, NetworkError } from "../../../shared/types/api-error";
import type { ImportRowError, ImportValidationDetails } from "../types";

export function getImportRowErrors(
    error: unknown,
): { errors: ImportRowError[]; truncated: boolean } | null {
    if (!(error instanceof ApiError) || error.code !== "IMPORT_VALIDATION_FAILED") {
        return null;
    }
    // ApiError tipa `details` como array genérico; aquí el backend manda { errors, truncated }.
    const details = error.details as unknown as ImportValidationDetails | undefined;
    if (!details || !Array.isArray(details.errors)) return null;
    return { errors: details.errors, truncated: Boolean(details.truncated) };
}

export function getImportErrorMessage(error: unknown): string {
    if (error instanceof NetworkError)
        return "No pudimos conectar con el servidor. Intenta de nuevo.";
    if (error instanceof ApiError) {
        switch (error.code) {
            case "NOT_TOURNAMENT_OWNER":
                return "Solo el dueño del torneo puede importar datos";
            case "TOURNAMENT_NOT_FOUND":
                return "El torneo no fue encontrado";
            case "IMPORT_FILE_REQUIRED":
                return "Selecciona un archivo .xlsx";
            case "IMPORT_FILE_TOO_LARGE":
                return "El archivo excede el tamaño máximo permitido (5MB)";
            case "INVALID_IMPORT_FILE":
                return `Archivo inválido: ${error.message}`;
            default:
                return error.message || "Ocurrió un error al importar";
        }
    }
    return "Ocurrió un error inesperado";
}
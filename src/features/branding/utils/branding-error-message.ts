import { ApiError, NetworkError } from "../../../shared/types/api-error";

export function getBrandingErrorMessage(error: unknown): string {
    if (error instanceof NetworkError)
        return "No pudimos conectar con el servidor. Intenta de nuevo.";
    if (error instanceof ApiError) {
        switch (error.code) {
            case "INVALID_FILE_TYPE":
                return "El archivo debe ser PNG, JPEG o WEBP";
            case "FILE_TOO_LARGE":
                return error.message || "El archivo excede el tamaño máximo permitido";
            case "NO_FILE_PROVIDED":
                return "Selecciona al menos un archivo para guardar";
            case "NOT_TOURNAMENT_OWNER":
                return "No tienes permisos para editar el branding de este torneo";
            case "TOURNAMENT_NOT_FOUND":
                return "El torneo no fue encontrado";
            case "BRANDING_NOT_FOUND":
                return "Este torneo aún no tiene branding configurado";
            default:
                return error.message || "Ocurrió un error al guardar el branding";
        }
    }
    return "Ocurrió un error inesperado";
}

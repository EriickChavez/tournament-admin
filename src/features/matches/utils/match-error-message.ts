import { ApiError, NetworkError } from "../../../shared/types/api-error";

export function getMatchErrorMessage(error: unknown): string {
    if (error instanceof NetworkError)
        return "No pudimos conectar con el servidor. Intenta de nuevo.";
    if (error instanceof ApiError) {
        switch (error.code) {
            case "NOT_TOURNAMENT_OWNER":
            case "NOT_TOURNAMENT_OWNER_OR_ADMIN":
                return "No tienes permisos para gestionar partidos en este torneo";
            case "TOURNAMENT_NOT_FOUND":
                return "El torneo no fue encontrado";
            case "MATCH_NOT_FOUND":
                return "El partido ya no existe";
            case "INVALID_CATEGORY":
                return "La categoría no es válida para este torneo";
            case "INVALID_TEAM":
                return "Uno o ambos equipos no son válidos para esta categoría";
            case "SAME_TEAM_MATCH":
                return "El equipo local y visitante deben ser diferentes";
            case "INVALID_MATCH_STATUS":
                return "El estado del partido no es válido";
            case "VALIDATION_ERROR":
                return error.message || "Revisa los datos del formulario";
            default:
                return error.message || "Ocurrió un error con el partido";
        }
    }
    return "Ocurrió un error inesperado";
}

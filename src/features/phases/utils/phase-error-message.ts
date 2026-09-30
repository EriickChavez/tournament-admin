import { ApiError, NetworkError } from "../../../shared/types/api-error";

export function getPhaseErrorMessage(error: unknown): string {
    if (error instanceof NetworkError)
        return "No pudimos conectar con el servidor. Intenta de nuevo.";
    if (error instanceof ApiError) {
        switch (error.code) {
            case "NOT_TOURNAMENT_OWNER":
            case "NOT_TOURNAMENT_OWNER_OR_ADMIN":
                return "No tienes permisos para gestionar fases en este torneo";
            case "TOURNAMENT_NOT_FOUND":
                return "El torneo no fue encontrado";
            case "CATEGORY_NOT_FOUND":
                return "La categoría no fue encontrada";
            case "PHASE_NOT_FOUND":
                return "La fase ya no existe";
            case "PHASE_GROUP_NOT_FOUND":
                return "El grupo ya no existe";
            case "PHASE_GROUP_NOT_ALLOWED":
                return "Los grupos solo se permiten en fases de tipo grupos";
            case "INVALID_PHASE_DATE_RANGE":
                return "La fecha de fin debe ser mayor o igual a la de inicio";
            case "TEAM_NOT_IN_CATEGORY":
                return "Uno o más equipos no pertenecen a esta categoría";
            case "DUPLICATE_PHASE_TEAM":
                return "Un equipo solo puede asignarse una vez por fase";
            case "PHASE_HAS_MATCHES":
                return "No se puede eliminar una fase que todavía tiene partidos";
            case "VALIDATION_ERROR":
                return error.message || "Revisa los datos del formulario";
            default:
                return error.message || "Ocurrió un error con la fase";
        }
    }
    return "Ocurrió un error inesperado";
}
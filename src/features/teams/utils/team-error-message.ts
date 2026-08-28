import { ApiError, NetworkError } from "../../../shared/types/api-error";

export function getTeamErrorMessage(error: unknown): string {
    if (error instanceof NetworkError)
        return "No pudimos conectar con el servidor. Intenta de nuevo.";
    if (error instanceof ApiError) {
        switch (error.code) {
            case "NOT_TOURNAMENT_OWNER":
            case "NOT_TOURNAMENT_OWNER_OR_ADMIN":
                return "No tienes permisos para gestionar equipos en este torneo";
            case "TOURNAMENT_NOT_FOUND":
                return "El torneo no fue encontrado";
            case "CATEGORY_NOT_FOUND":
            case "INVALID_CATEGORY":
                return "La categoría no es válida para este torneo";
            case "TEAM_NOT_FOUND":
                return "El equipo ya no existe";
            case "TEAM_NAME_ALREADY_EXISTS":
            case "DUPLICATE_TEAM_NAME":
                return "Ya existe un equipo con ese nombre en el torneo";
            case "VALIDATION_ERROR":
                return error.message || "Revisa los datos del formulario";
            default:
                return error.message || "Ocurrió un error con el equipo";
        }
    }
    return "Ocurrió un error inesperado";
}
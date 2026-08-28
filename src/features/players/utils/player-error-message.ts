import { ApiError, NetworkError } from "../../../shared/types/api-error";

export function getPlayerErrorMessage(error: unknown): string {
    if (error instanceof NetworkError)
        return "No pudimos conectar con el servidor. Intenta de nuevo.";
    if (error instanceof ApiError) {
        switch (error.code) {
            case "NOT_TOURNAMENT_OWNER":
            case "NOT_TOURNAMENT_OWNER_OR_ADMIN":
                return "No tienes permisos para gestionar jugadores en este torneo";
            case "TOURNAMENT_NOT_FOUND":
                return "El torneo no fue encontrado";
            case "PLAYER_NOT_FOUND":
                return "El jugador ya no existe";
            case "JERSEY_NUMBER_ALREADY_IN_USE":
                return "Ese número de camiseta ya está en uso en este torneo";
            case "INVALID_CATEGORY":
                return "La categoría no existe o no pertenece a este torneo";
            case "INVALID_TEAM":
                return "El equipo no existe, no pertenece al torneo o no coincide con la categoría";
            case "VALIDATION_ERROR":
                return error.message || "Revisa los datos del formulario";
            default:
                return error.message || "Ocurrió un error con el jugador";
        }
    }
    return "Ocurrió un error inesperado";
}
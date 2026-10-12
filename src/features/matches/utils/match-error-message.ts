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
            case "MATCH_NOT_IN_PROGRESS":
                return "La cédula no está abierta: inicia el partido (o reábrelo) para registrar o borrar eventos";
            case "INVALID_MATCH_TRANSITION":
                return "Ese cambio de estado no es posible desde el estado actual del partido";
            case "USE_LIFECYCLE_ENDPOINTS":
                return "Para iniciar, finalizar o reabrir un partido usa los botones de la cédula";
            case "MATCH_HAS_EVENTS":
                return "No se pueden cambiar los equipos ni la categoría de un partido que ya tiene eventos";
            case "NOT_ASSIGNED_TO_MATCH":
                return "No estás asignado como árbitro de este partido";
            case "INVALID_REFEREE":
                return "Todos los árbitros deben ser miembros del torneo con rol de administrador";
            case "INVALID_SUBSTITUTION":
                return "Un cambio necesita al jugador que sale y al que entra: distintos y del mismo equipo";
            case "INVALID_OCCURRED_AT":
                return "La hora del evento no puede estar en el futuro";
            case "PLAYER_ALREADY_SENT_OFF":
                return "Ese jugador ya fue expulsado en este partido";
            case "DERIVED_MATCH_EVENT":
                return "Esta roja se generó por doble amarilla: elimina la segunda amarilla";
            case "VALIDATION_ERROR":
                return error.message || "Revisa los datos del formulario";
            case "CATEGORY_FINISHED":
                return "El campeonato de esta categoría está cerrado: ya no se pueden crear ni modificar partidos ni resultados. Reábrelo primero";
            default:
                return error.message || "Ocurrió un error con el partido";
        }
    }
    return "Ocurrió un error inesperado";
}
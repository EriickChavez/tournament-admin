import { ApiError } from "../../../shared/types/api-error";
import { getMatchErrorMessage } from "../../matches/utils/match-error-message";

export function getBracketErrorMessage(error: unknown): string {
    if (error instanceof ApiError) {
        switch (error.code) {
            case "INVALID_BRACKET_PHASE":
                return `No se puede generar la llave: ${error.message}`;
            case "SOURCE_PHASE_NOT_CLOSED":
                return "La fase de grupos debe estar cerrada antes de generar la llave";
            case "NOT_ENOUGH_QUALIFIED_TEAMS":
                return "Se necesitan al menos 2 clasificados para generar la llave";
            case "BRACKET_IN_PROGRESS":
                return "La llave ya tiene partidos o resultados, no se puede regenerar";
            case "BRACKET_NODE_NOT_FOUND":
                return "Ese cruce ya no existe";
            case "BRACKET_NODE_NOT_READY":
                return "Aún no se conocen los dos equipos de este cruce";
            case "BRACKET_NODE_ALREADY_SCHEDULED":
                return "Este cruce ya tiene un partido programado";
            case "BRACKET_ADVANCE_CONFLICT":
                return "Este cambio alteraría quién avanza, y el siguiente cruce ya tiene partido. Borra o reprograma ese partido primero";
            case "BRACKET_MATCH_TEAMS_LOCKED":
                return "Los equipos de un partido de la llave no se pueden cambiar";
            case "INVALID_PENALTIES":
                return "Penales inválidos: solo aplican con empate y no pueden quedar empatados";
            case "NOT_TOURNAMENT_OWNER":
                return "Solo el dueño del torneo puede generar la llave";
            default:
                return getMatchErrorMessage(error);
        }
    }
    return getMatchErrorMessage(error);
}